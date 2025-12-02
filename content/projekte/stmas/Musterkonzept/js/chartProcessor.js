/**
 * Chart Processor Module
 * Handles chart configuration parsing and data preparation from YAML
 */

const ChartProcessor = (() => {
  // Track all charts for appendix generation
  let chartsMetadata = [];

  /**
   * Extract and process chart blocks from HTML
   * @param {HTMLElement} element - Container element
   * @param {Object} globalConfig - Global parameters (year, palette, etc.)
   * @returns {Promise<void>}
   */
  async function processCharts(element, globalConfig = {}) {
    chartsMetadata = []; // Reset for new processing
    const codeBlocks = element.querySelectorAll('pre > code.language-chart');
    
    for (const block of codeBlocks) {
      try {
        const yamlText = block.textContent.trim();
        const config = jsyaml.load(yamlText);
        
        // Merge with global config
        const mergedConfig = { ...globalConfig, ...config };
        
        // Validate configuration
        validateChartConfig(mergedConfig);
        
        // Render the chart
        await renderChart(block.parentElement, mergedConfig);
      } catch (error) {
        console.error('Chart processing error:', error);
        block.parentElement.innerHTML = `<div style="color: red; padding: 10px; background: #ffe0e0; border-radius: 4px;">
          <strong>Chart Error:</strong> ${error.message}
        </div>`;
      }
    }
  }

  /**
   * Get all charts metadata for appendix
   * @returns {Array} Array of chart metadata objects
   */
  function getChartsMetadata() {
    return chartsMetadata;
  }

  /**
   * Validate chart configuration
   * @param {Object} config - Chart configuration
   * @throws {Error} If configuration is invalid
   */
  function validateChartConfig(config) {
    if (!config.type) {
      throw new Error('Chart must have a "type" (bar, line, pie, etc.)');
    }

    if (!config.title) {
      throw new Error('Chart must have a "title"');
    }

    if (!config.data || !config.data.groupBy) {
      throw new Error('Chart data must specify "groupBy" column');
    }

    if (!DataManager.isDataLoaded()) {
      throw new Error('No dataset loaded. Please load a CSV file first.');
    }
    // If groupFill provided, verify column exists
    if (config.data && config.data.groupFill) {
      const cols = DataManager.getColumns();
      if (!cols.includes(config.data.groupFill)) {
        throw new Error(`groupFill column "${config.data.groupFill}" not found in dataset`);
      }
    }
  }

  /**
   * Render a single chart
   * @param {HTMLElement} container - Container element
   * @param {Object} config - Chart configuration
   * @returns {Promise<void>}
   */
  async function renderChart(container, config) {
    // If a groupFill (secondary grouping) is provided, build datasets per fill-category
    let labels = [];
    let datasets = [];

    if (config.data.groupFill) {
      // Get all distinct fill values
      const fillColumn = config.data.groupFill;
      const fillValues = DataManager.getUniqueValues(fillColumn);

      // For each fill value, aggregate over the primary group with a filter
      const series = fillValues.map(fillVal => {
        const aggregated = DataManager.aggregate({
          groupBy: config.data.groupBy,
          countColumn: config.data.countColumn || null,
          operation: config.data.operation || 'count',
          filters: Object.assign({}, config.data.filters || {}, { [fillColumn]: fillVal })
        });
        return { fillVal, aggregated };
      });

      // Build master label list (union of all group labels)
      const labelSet = new Set();
      series.forEach(s => s.aggregated.forEach(g => labelSet.add(g._label)));
      labels = Array.from(labelSet);

      // Create datasets aligned to labels
      datasets = series.map((s, idx) => {
        const map = new Map(s.aggregated.map(g => [g._label, g._value]));
        const values = labels.map(l => map.get(l) || 0);
        return {
          label: s.fillVal,
          data: values,
          backgroundColor: getChartColors(config.palette || 'palette1', fillValues.length)[idx],
          borderColor: getChartBorderColors(config.palette || 'palette1')
        };
      });

      // Store metadata for appendix
      chartsMetadata.push({
        title: config.title,
        description: config.description || '',
        data: series.reduce((acc, s) => {
          acc.push(...s.aggregated.map(a => ({ fill: s.fillVal, label: a._label, value: a._value })));
          return acc;
        }, []),
        groupBy: config.data.groupBy,
        groupFill: config.data.groupFill
      });
    } else {
      // Single-dimension aggregation
      const aggregatedData = DataManager.aggregate({
        groupBy: config.data.groupBy,
        countColumn: config.data.countColumn || null,
        operation: config.data.operation || 'count',
        filters: config.data.filters || {}
      });

      if (aggregatedData.length === 0) {
        throw new Error(`No data found for groupBy: "${config.data.groupBy}"`);
      }

      // Extract labels and values
      labels = aggregatedData.map(d => d._label);
      const values = aggregatedData.map(d => d._value);

      datasets = [{
        label: config.title,
        data: values,
        backgroundColor: getChartColors(config.palette || 'palette1', values.length),
        borderColor: getChartBorderColors(config.palette || 'palette1')
      }];

      // Store metadata for appendix
      chartsMetadata.push({
        title: config.title,
        description: config.description || '',
        data: aggregatedData,
        groupBy: config.data.groupBy
      });
    }

    // Create chart container
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '30px';
    wrapper.style.padding = '20px';
    wrapper.style.border = '2px solid #b6a6f6';
    wrapper.style.borderRadius = '8px';
    wrapper.style.backgroundColor = '#fafafa';

    // Add title
    const title = document.createElement('h3');
    title.textContent = config.title;
    title.style.marginTop = '0';
    title.style.color = '#4d57b9';
    wrapper.appendChild(title);

    // Add description if provided
    if (config.description) {
      const desc = document.createElement('p');
      desc.textContent = config.description;
      desc.style.fontSize = '0.9rem';
      desc.style.color = '#666';
      desc.style.marginBottom = '15px';
      wrapper.appendChild(desc);
    }

  // Create canvas for chart
  const canvas = document.createElement('canvas');
  canvas.id = `chart-${Date.now()}-${Math.random()}`;
  canvas.style.maxHeight = '400px';
  wrapper.appendChild(canvas);

    // Replace pre element with wrapper
    container.replaceWith(wrapper);

    // Render Chart.js
    renderChartJS(canvas, {
      type: config.type,
      title: config.title,
      labels: labels,
      datasets: datasets,
      options: config.chartOptions || {},
      stacked: Boolean(config.data.stacked)
    });
  }

  /**
   * Render Chart.js chart
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} chartData - Chart data
   */
  function renderChartJS(canvas, chartData) {
    const ctx = canvas.getContext('2d');
    
    const chartConfig = {
      type: chartData.type,
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: Array.isArray(ds.backgroundColor) ? ds.backgroundColor : [ds.backgroundColor],
          borderColor: ds.borderColor,
          borderWidth: 2,
          borderRadius: 4,
          fill: true
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'x',
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: false
          },
          datalabels: {
            display: true,
            color: '#000',
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => value.toString()
          }
        },
        scales: chartData.type !== 'pie' && chartData.type !== 'doughnut' ? {
          x: {
            stacked: chartData.stacked || false
          },
          y: {
            beginAtZero: true,
            stacked: chartData.stacked || false,
            ticks: {
              stepSize: 1
            }
          }
        } : undefined,
        ...chartData.options
      }
    };

    // Register chartjs-plugin-datalabels if available
    if (typeof ChartDataLabels !== 'undefined') {
      Chart.register(ChartDataLabels);
    }

    new Chart(ctx, chartConfig);
  }

  /**
   * Get color palette
   * @param {string} palette - Palette name
   * @param {number} count - Number of colors needed
   * @returns {string[]} Array of colors
   */
  function getChartColors(palette, count) {
    const palettes = {
      palette1: ['#4d57b9', '#ff7550', '#cfff63', '#6dd3f3', '#f5a623'],
      palette2: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
      palette3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3']
    };

    const colors = palettes[palette] || palettes.palette1;
    const result = [];
    
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    
    return result;
  }

  /**
   * Get border color for palette
   * @param {string} palette - Palette name
   * @returns {string} Border color
   */
  function getChartBorderColors(palette) {
    const borders = {
      palette1: '#4d57b9',
      palette2: '#1f77b4',
      palette3: '#8dd3c7'
    };
    return borders[palette] || borders.palette1;
  }

  // Public API
  return {
    processCharts,
    getChartsMetadata
  };
})();

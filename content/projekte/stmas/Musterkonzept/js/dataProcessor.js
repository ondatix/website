/**
 * Data Processor Module
 * Provides functions equivalent to R Funktionen chunk:
 * - tabellen_datenschutz: Privacy protection for tables
 * - grafik_datenschutz: Privacy protection for charts (returns NA if below threshold)
 * - datenvorbereitung: Data aggregation with grouping
 * - alttexterstellung: Generate accessible alt text for charts
 */

const DataProcessor = (() => {
  /**
   * Apply privacy protection for tables
   * Shows count if >= kleinstgruppe threshold, otherwise shows "<n"
   * @param {number} value - Count value
   * @param {number} kleinstgruppe - Privacy threshold (default: 3)
   * @returns {string} Protected value as string
   */
  function tabellen_datenschutz(value, kleinstgruppe = 3) {
    if (value >= kleinstgruppe) {
      return String(value);
    } else {
      return `< ${kleinstgruppe}`;
    }
  }

  /**
   * Apply privacy protection for charts
   * Returns the value if >= kleinstgruppe, otherwise returns null (will be omitted from chart)
   * @param {number} value - Count value
   * @param {number} kleinstgruppe - Privacy threshold (default: 3)
   * @returns {number|null} Value or null if below threshold
   */
  function grafik_datenschutz(value, kleinstgruppe = 3) {
    if (value >= kleinstgruppe) {
      return value;
    } else {
      return null; // Will be filtered out
    }
  }

  /**
   * Data preparation: aggregate data by group variables with privacy protection
   * Equivalent to R datenvorbereitung function
   * @param {string} groupByColumns - Single column name or comma-separated column names
   * @param {number} kleinstgruppe - Privacy threshold (default: 3)
   * @returns {Object} Configuration for use with DataManager.aggregate
   */
  function datenvorbereitung(groupByColumns, kleinstgruppe = 3) {
    // Convert single column to array, handle comma-separated or array input
    let columns = Array.isArray(groupByColumns) 
      ? groupByColumns 
      : groupByColumns.split(',').map(col => col.trim());

    return {
      groupBy: columns,
      kleinstgruppe: kleinstgruppe,
      operation: 'count'
    };
  }

  /**
   * Generate accessible alt text for bar charts
   * Creates descriptive German text for screen readers
   * @param {Object[]} data - Aggregated data array
   * @param {string} xLabel - X-axis label (e.g., "Qualifikationsebene")
   * @param {string} fillLabel - Fill/legend label (e.g., "Geschlechtsschluessel")
   * @param {string} yLabel - Y-axis label (default: "Anzahl")
   * @returns {string} Accessible description of chart
   */
  function alttexterstellung(data, xLabel, fillLabel, yLabel = "Anzahl") {
    let alttext = `Ein Balkendiagramm zeigt die Verteilung der ${xLabel} in der Dienststelle, differenziert nach ${fillLabel}. ` +
      `Die x-Achse repräsentiert das Merkmal ${xLabel}, während die y-Achse die ${yLabel} der Beschäftigten darstellt. ` +
      `Für jede Ausprägung von ${xLabel} ist das Merkmal ${fillLabel} als verschiedenfarbige Balken dargestellt. ` +
      `Die Balken sind nebeneinander angeordnet, um den Vergleich zu erleichtern. ` +
      `Die Farben der Balken entsprechen der Geschlechterzuordnung, wobei eine Legende die Farbcodierung erklärt. ` +
      `Werte der Balken: `;

    // Add data values for accessibility
    data.forEach(row => {
      // Construct key labels from row
      const rowDesc = Object.entries(row)
        .filter(([key]) => key !== '_value' && key !== '_label')
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ');
      
      alttext += `${rowDesc}: ${row._value} ${yLabel}, `;
    });

    return alttext.slice(0, -2); // Remove trailing comma and space
  }

  /**
   * Prepare table data: group by multiple columns with privacy protection
   * Equivalent to R tabellendatenvorbereitung function
   * @param {string} groupVar1 - First grouping variable
   * @param {string|string[]} groupVar2 - Second grouping variable(s) for pivot
   * @param {number} kleinstgruppe - Privacy threshold (default: 3)
   * @returns {Object[]} Array of aggregated rows ready for table display
   */
  function tabellendatenvorbereitung(groupVar1, groupVar2, kleinstgruppe = 3) {
    const vars2 = Array.isArray(groupVar2) ? groupVar2 : [groupVar2];
    
    // Get all unique values for both grouping variables
    const uniqueVar1 = [...new Set(DataManager.getData().map(row => row[groupVar1]))];
    const uniqueVar2 = [...new Set(DataManager.getData().flatMap(row => vars2.map(v => row[v])))];

    // Aggregate data by both variables
    const tableData = {};
    
    uniqueVar1.forEach(val1 => {
      tableData[val1] = {};
      uniqueVar2.forEach(val2 => {
        // Count rows matching both criteria
        const count = DataManager.filterData({
          [groupVar1]: val1,
          [vars2[0]]: val2  // Using first var2 for filtering
        }).length;
        
        tableData[val1][val2] = tabellen_datenschutz(count, kleinstgruppe);
      });
    });

    return tableData;
  }

  /**
   * Validate and apply privacy protection to aggregated chart data
   * @param {Object[]} aggregatedData - Data from DataManager.aggregate()
   * @param {number} kleinstgruppe - Privacy threshold
   * @returns {Object[]} Filtered data with privacy protection applied
   */
  function applyPrivacyToChartData(aggregatedData, kleinstgruppe = 3) {
    return aggregatedData
      .map(item => ({
        ...item,
        _value: grafik_datenschutz(item._value, kleinstgruppe)
      }))
      .filter(item => item._value !== null); // Remove items below threshold
  }

  // Public API
  return {
    tabellen_datenschutz,
    grafik_datenschutz,
    datenvorbereitung,
    alttexterstellung,
    tabellendatenvorbereitung,
    applyPrivacyToChartData
  };
})();

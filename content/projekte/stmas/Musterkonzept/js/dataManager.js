/**
 * Data Manager Module
 * Handles CSV data loading, parsing, filtering, and aggregation
 */

const DataManager = (() => {
  let rawData = [];
  let columnNames = [];
  let isLoaded = false;

  /**
   * Load and parse CSV file
   * @param {File} file - CSV file from input
   * @returns {Promise<boolean>} Success status
   */
  async function loadCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.trim().split('\n');
          
          if (lines.length < 2) {
            throw new Error('CSV must contain at least header and one data row');
          }

          // Parse header
          columnNames = lines[0].split(',').map(h => h.trim());

          // Parse data rows
          rawData = lines.slice(1).map((line, rowIndex) => {
            const values = parseCSVLine(line);
            
            if (values.length !== columnNames.length) {
              console.warn(`Row ${rowIndex + 2}: Expected ${columnNames.length} columns, got ${values.length}`);
            }

            const row = {};
            columnNames.forEach((col, idx) => {
              row[col] = values[idx] !== undefined ? values[idx].trim() : '';
            });
            return row;
          });

          isLoaded = true;
          console.log(`✓ Loaded ${rawData.length} rows with ${columnNames.length} columns`);
          resolve(true);
        } catch (error) {
          console.error('CSV parsing error:', error);
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Parse CSV line handling quoted fields
   * @param {string} line - CSV line
   * @returns {string[]} Parsed values
   */
  function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  }

  /**
   * Check if data is loaded
   * @returns {boolean}
   */
  function isDataLoaded() {
    return isLoaded && rawData.length > 0;
  }

  /**
   * Get all column names
   * @returns {string[]}
   */
  function getColumns() {
    return [...columnNames];
  }

  /**
   * Get raw data (all rows)
   * @returns {Object[]}
   */
  function getData() {
    return [...rawData];
  }

  /**
   * Get unique values for a column
   * @param {string} column - Column name
   * @returns {string[]}
   */
  function getUniqueValues(column) {
    if (!columnNames.includes(column)) {
      throw new Error(`Column "${column}" not found`);
    }
    return [...new Set(rawData.map(row => row[column]).filter(v => v !== ''))];
  }

  /**
   * Filter data by conditions
   * @param {Object} filters - Object with column:value pairs or column:[values] arrays
   * @returns {Object[]}
   */
  function filterData(filters = {}) {
    return rawData.filter(row => {
      for (const [column, value] of Object.entries(filters)) {
        if (!columnNames.includes(column)) {
          console.warn(`Filter column "${column}" not found`);
          continue;
        }

        if (Array.isArray(value)) {
          // Array of allowed values
          if (!value.includes(row[column])) {
            return false;
          }
        } else if (value !== null && value !== undefined) {
          // Single value
          if (row[column] !== value) {
            return false;
          }
        }
      }
      return true;
    });
  }

  /**
   * Aggregate data by grouping and counting
   * @param {Object} config - Configuration object
   * @param {string} config.groupBy - Column to group by
   * @param {string} config.countColumn - Column to count (for sums)
   * @param {string} config.operation - 'count' or 'sum'
   * @param {Object} config.filters - Filter conditions
   * @returns {Object[]} Array of {_label: string, _value: number}
   */
  function aggregate(config) {
    const {
      groupBy,
      countColumn = null,
      operation = 'count',
      filters = {}
    } = config;

    if (!columnNames.includes(groupBy)) {
      throw new Error(`Group column "${groupBy}" not found`);
    }

    // Apply filters first
    const filtered = filterData(filters);

    // Group and aggregate
    const groups = {};
    filtered.forEach(row => {
      const groupKey = row[groupBy];
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          _label: groupKey,
          _value: 0,
          _count: 0,
          _sum: 0,
          _rows: []
        };
      }

      groups[groupKey]._rows.push(row);
      groups[groupKey]._count += 1;

      if (operation === 'sum' && countColumn) {
        const val = parseFloat(row[countColumn]) || 0;
        groups[groupKey]._sum += val;
      }
    });

    // Build result array
    return Object.values(groups).map(group => {
      if (operation === 'sum') {
        group._value = group._sum;
      } else {
        group._value = group._count;
      }
      delete group._sum;
      delete group._count;
      delete group._rows;
      return group;
    });
  }

  /**
   * Get data statistics
   * @returns {Object} Statistics object
   */
  function getStats() {
    return {
      rowCount: rawData.length,
      columnCount: columnNames.length,
      columns: columnNames,
      isLoaded: isLoaded
    };
  }

  // Public API
  return {
    loadCSV,
    isDataLoaded,
    getColumns,
    getData,
    getUniqueValues,
    filterData,
    aggregate,
    getStats
  };
})();

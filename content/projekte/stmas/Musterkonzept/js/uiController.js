/**
 * UI Controller Module
 * Handles all user interface interactions and event management
 */

const UIController = (() => {
  let globalConfig = {};

  /**
   * Initialize all UI event listeners
   */
  function init() {
    attachDataLoaderListener();
    attachExportListener();
    attachSubmitListener();
    attachPreviewListener();
  }

  /**
   * Attach listener to CSV data loader
   */
  function attachDataLoaderListener() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.addEventListener("change", handleDataLoad);
    }
  }

  /**
   * Handle CSV data loading
   */
  async function handleDataLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Show loading state
      const statusEl = document.getElementById("dataStatus") || createStatusElement();
      statusEl.innerHTML = '<span style="color: #4d57b9;">⏳ Loading data...</span>';

      // Load data into DataManager
      await DataManager.loadCSV(file);
      
      // Store global config
      globalConfig = {
        year: document.getElementById("yearInput").value,
        palette: document.getElementById("paletteInput").value,
        smallestN: document.getElementById("nInput").value,
        agency: document.getElementById("agencyInput").value
      };

      // Show success status
      const stats = DataManager.getStats();
      statusEl.innerHTML = `
        <span style="color: #2a9d2a;">
          ✓ Dataset loaded: ${stats.rowCount} rows, ${stats.columnCount} columns
        </span>
      `;
    } catch (error) {
      const statusEl = document.getElementById("dataStatus") || createStatusElement();
      statusEl.innerHTML = `<span style="color: #d62728;">✗ Error: ${error.message}</span>`;
      console.error('Data loading error:', error);
    }
  }

  /**
   * Create status display element
   */
  function createStatusElement() {
    const statusEl = document.createElement('div');
    statusEl.id = 'dataStatus';
    statusEl.style.marginTop = '10px';
    statusEl.style.padding = '10px';
    statusEl.style.borderRadius = '4px';
    statusEl.style.fontSize = '0.9rem';
    document.querySelector('.container').insertBefore(
      statusEl, 
      document.getElementById('mdInput')
    );
    return statusEl;
  }

  /**
   * Attach listener to export DOCX button
   */
  function attachExportListener() {
    const exportBtn = document.getElementById("exportDocxBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", handleExport);
    }
  }

  /**
   * Attach listener to submit button
   */
  function attachSubmitListener() {
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", handleSubmit);
    }
  }

  /**
   * Attach listener to preview button
   */
  function attachPreviewListener() {
    const previewBtn = document.getElementById("previewBtn");
    if (previewBtn) {
      previewBtn.addEventListener("click", handlePreview);
    }
  }

  /**
   * Handle export to DOCX
   */
  async function handleExport() {
    const preview = document.getElementById("preview");
    if (!preview.innerHTML.trim()) {
      alert("Bitte erst eine Vorschau erzeugen");
      return;
    }

    try {
      const doc = await DocumentBuilder.buildDocument(preview);
      await DocumentBuilder.exportToDocx(doc, "report.docx");
    } catch (error) {
      console.error('Error exporting document:', error);
      alert('Fehler beim Export: ' + error.message);
    }
  }

  /**
   * Handle report creation from markdown
   */
  function handleSubmit() {
    if (!DataManager.isDataLoaded()) {
      alert("Bitte laden Sie zunächst eine CSV-Datei");
      return;
    }

    const mdFile = document.getElementById("mdInput").files[0];
    if (!mdFile) {
      alert("Bitte Markdown-Datei hochladen");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
      const mdText = e.target.result;
      const html = marked.parse(mdText);
      const preview = document.getElementById("preview");
      preview.style.display = "block";
      preview.innerHTML = html;

      // Process charts with data
      try {
        await ChartProcessor.processCharts(preview, globalConfig);
        document.getElementById("exportDocxBtn").style.display = "block";
      } catch (error) {
        console.error('Chart processing error:', error);
        alert('Fehler beim Verarbeiten der Charts: ' + error.message);
      }
    };
    reader.readAsText(mdFile);
  }

  /**
   * Handle preview generation from markdown
   */
  function handlePreview() {
    if (!DataManager.isDataLoaded()) {
      alert("Bitte laden Sie zunächst eine CSV-Datei");
      return;
    }

    const mdFile = document.getElementById("mdInput").files[0];
    if (!mdFile) {
      alert("Bitte Markdown-Datei hochladen");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
      const mdText = e.target.result;
      const html = marked.parse(mdText);
      const preview = document.getElementById("preview");
      preview.style.display = "block";
      document.getElementById("exportDocxBtn").style.display = "block";
      preview.innerHTML = html;

      // Process charts with data
      try {
        await ChartProcessor.processCharts(preview, globalConfig);
      } catch (error) {
        console.error('Chart processing error:', error);
        alert('Fehler beim Verarbeiten der Charts: ' + error.message);
      }
    };
    reader.readAsText(mdFile);
  }

  /**
   * Get form parameters
   * @returns {Object} Form parameters
   */
  function getFormParams() {
    return {
      csvFile: document.getElementById("fileInput").files[0],
      year: document.getElementById("yearInput").value,
      palette: document.getElementById("paletteInput").value,
      smallestN: document.getElementById("nInput").value,
      agency: document.getElementById("agencyInput").value
    };
  }

  return {
    init,
    getFormParams
  };
})();

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  UIController.init();
});

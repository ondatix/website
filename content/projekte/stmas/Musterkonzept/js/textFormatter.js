/**
 * Text Formatter Module
 * Handles extraction and preservation of text formatting from HTML elements
 */

const TextFormatter = (() => {
  /**
   * Extract text styling options from HTML element
   * @param {HTMLElement} el - The HTML element to extract styling from
   * @returns {Object} Formatting options for TextRun
   */
  function getTextRunOptions(el) {
    const options = { font: 'Arial' };
    const style = window.getComputedStyle(el);
    
    if (style.fontWeight === 'bold' || el.tagName === 'STRONG' || el.tagName === 'B') {
      options.bold = true;
    }
    if (style.fontStyle === 'italic' || el.tagName === 'EM' || el.tagName === 'I') {
      options.italics = true;
    }
    if (el.tagName === 'U') {
      options.underline = {};
    }
    if (style.color && style.color !== 'rgb(51, 51, 51)') {
      const rgb = style.color.match(/\d+/g);
      if (rgb) {
        options.color = ((parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2]))
          .toString(16)
          .padStart(6, '0')
          .toUpperCase();
      }
    }
    return options;
  }

  /**
   * Extract text content with formatting as TextRun objects
   * @param {HTMLElement} el - The HTML element to extract text from
   * @returns {Array} Array of TextRun objects
   */
  function extractTextRuns(el) {
    const { TextRun } = docx;
    const runs = [];
    const children = el.childNodes;
    
    if (children.length === 0) {
      const options = getTextRunOptions(el);
      if (el.textContent.trim()) {
        runs.push(new TextRun({ text: el.textContent.trim(), ...options }));
      }
      return runs;
    }
    
    for (let child of children) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) {
          runs.push(new TextRun({ text: text, font: 'Arial' }));
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const options = getTextRunOptions(child);
        if (child.textContent.trim()) {
          runs.push(new TextRun({ text: child.textContent.trim(), ...options }));
        }
      }
    }
    return runs;
  }

  return {
    getTextRunOptions,
    extractTextRuns
  };
})();

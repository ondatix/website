/**
 * List Processor Module
 * Handles recursive processing of HTML lists (ul, ol) with nesting support
 */

const ListProcessor = (() => {
  /**
   * Process HTML list elements recursively
   * @param {HTMLElement} el - The UL or OL element
   * @param {boolean} isOrdered - Whether this is an ordered list
   * @returns {Array} Array of Paragraph objects representing list items
   */
  function processList(el, isOrdered) {
    const { Paragraph } = docx;
    const items = [];
    const listItems = el.querySelectorAll(':scope > li');
    
    listItems.forEach((li) => {
      let hasNestedList = false;
      let nestedList = null;
      let textContent = '';
      
      for (let child of li.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent.trim();
          if (text) {
            textContent += text + ' ';
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === 'UL' || child.tagName === 'OL') {
            hasNestedList = true;
            nestedList = child;
          } else {
            const text = child.textContent.trim();
            if (text && child.tagName !== 'UL' && child.tagName !== 'OL') {
              textContent += text + ' ';
            }
          }
        }
      }
      
      items.push(new Paragraph({
        text: textContent.trim() || li.textContent.trim(),
        font: 'Arial',
        bullet: { level: 0 },
        spacing: { line: 240 }
      }));
      
      if (hasNestedList && nestedList) {
        const nestedItems = processList(nestedList, nestedList.tagName === 'OL');
        nestedItems.forEach(item => {
          items.push(new Paragraph({
            text: item.options?.text || '',
            font: 'Arial',
            bullet: { level: 1 },
            spacing: { line: 240 }
          }));
        });
      }
    });
    
    return items;
  }

  return {
    processList
  };
})();

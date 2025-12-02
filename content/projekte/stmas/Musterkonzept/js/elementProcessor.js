/**
 * Element Processor Module
 * Handles conversion of HTML elements to DOCX elements
 */

const ElementProcessor = (() => {
  /**
   * Main processor for converting HTML elements to DOCX format
   * @param {HTMLElement} el - The HTML element to process
   * @param {Array} headings - Array to collect headings for TOC
   * @returns {Array} Array of DOCX elements (Paragraphs, Tables, etc.)
   */
  function processElement(el, headings = []) {
    const {
      Paragraph,
      Table,
      TableRow,
      TableCell,
      TextRun,
      HeadingLevel,
      ImageRun,
      AlignmentType,
      BorderStyle,
      WidthType
    } = docx;

    const results = [];

    if (el.nodeType === Node.TEXT_NODE) {
      const text = el.textContent.trim();
      if (text) {
        results.push(new Paragraph({
          text: text,
          font: 'Arial'
        }));
      }
      return results;
    }

    if (el.nodeType !== Node.ELEMENT_NODE) return results;

    const tagName = el.tagName.toLowerCase();

    switch (tagName) {
      case 'h1':
        const h1Text = el.textContent;
        headings.push({ text: h1Text, level: 1 });
        results.push(new Paragraph({
          children: TextFormatter.extractTextRuns(el),
          heading: HeadingLevel.HEADING_1,
          bold: true,
          size: 32,
          font: 'Arial',
          spacing: { before: 240, after: 120 }
        }));
        break;

      case 'h2':
        const h2Text = el.textContent;
        headings.push({ text: h2Text, level: 2 });
        results.push(new Paragraph({
          children: TextFormatter.extractTextRuns(el),
          heading: HeadingLevel.HEADING_2,
          bold: true,
          size: 28,
          font: 'Arial',
          spacing: { before: 200, after: 100 }
        }));
        break;

      case 'h3':
        const h3Text = el.textContent;
        headings.push({ text: h3Text, level: 3 });
        results.push(new Paragraph({
          children: TextFormatter.extractTextRuns(el),
          heading: HeadingLevel.HEADING_3,
          bold: true,
          size: 24,
          font: 'Arial',
          spacing: { before: 160, after: 80 }
        }));
        break;

      case 'h4':
        const h4Text = el.textContent;
        headings.push({ text: h4Text, level: 4 });
        results.push(new Paragraph({
          children: TextFormatter.extractTextRuns(el),
          heading: HeadingLevel.HEADING_4,
          bold: true,
          size: 22,
          font: 'Arial',
          spacing: { before: 120, after: 60 }
        }));
        break;

      case 'h5':
      case 'h6':
        results.push(new Paragraph({
          children: TextFormatter.extractTextRuns(el),
          bold: true,
          size: 20,
          font: 'Arial',
          spacing: { before: 100, after: 40 }
        }));
        break;

      case 'p':
        results.push(new Paragraph({
          children: TextFormatter.extractTextRuns(el).length > 0
            ? TextFormatter.extractTextRuns(el)
            : [new TextRun(el.textContent)],
          font: 'Arial',
          spacing: { line: 360, after: 200 }
        }));
        break;

      case 'blockquote':
        // Extract all text content from blockquote and apply gray background
        const blockquoteChildren = [];
        el.childNodes.forEach((child) => {
          const processed = processElement(child, headings);
          blockquoteChildren.push(...processed);
        });
        
        // Apply gray background to each paragraph in blockquote
        blockquoteChildren.forEach((para) => {
          if (para && para.children) {
            para.shading = { fill: 'E8E8E8' }; // Light gray background
            para.border = {
              left: { style: BorderStyle.SINGLE, size: 12, color: '999999' }
            };
            para.spacing = { ...para.spacing, before: 100, after: 100, inside: 100 };
            para.indent = { left: 432, right: 0 }; // Indent from left
          }
        });
        results.push(...blockquoteChildren);
        break;

      case 'table':
        const rows = [];
        const tableRows = el.querySelectorAll('tr');
        tableRows.forEach((tr) => {
          const cells = [];
          const tds = tr.querySelectorAll('td, th');
          tds.forEach((td) => {
            cells.push(new TableCell({
              children: [new Paragraph({
                children: TextFormatter.extractTextRuns(td).length > 0
                  ? TextFormatter.extractTextRuns(td)
                  : [new TextRun(td.textContent)],
                font: 'Arial'
              })],
              shading: td.tagName === 'TH' ? { fill: 'D3D3D3' } : {}
            }));
          });
          rows.push(new TableRow({ children: cells }));
        });
        results.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: rows,
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
            left: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: 'EEEEEE' },
            insideVertical: { style: BorderStyle.SINGLE, size: 6, color: 'EEEEEE' }
          }
        }));
        break;

      case 'ul':
      case 'ol':
        const listItems = ListProcessor.processList(el, tagName === 'ol');
        results.push(...listItems);
        break;

      case 'a':
        const href = el.getAttribute('href');
        if (href) {
          results.push(new Paragraph({
            children: [new TextRun({
              text: el.textContent,
              color: '0563C1',
              underline: {},
              font: 'Arial'
            })],
            spacing: { line: 360, after: 200 }
          }));
        }
        break;

      case 'canvas':
        try {
          const imageData = el.toDataURL('image/png');
          const base64Data = imageData.split(',')[1];
          results.push(new Paragraph({
            children: [new ImageRun({
              data: base64Data,
              transformation: { width: 600, height: 380 },
              type: 'png'
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }));
        } catch (e) {
          console.error('Error converting canvas to image:', e);
        }
        break;

      case 'img':
        try {
          const src = el.src;
          if (src.startsWith('data:')) {
            const base64Data = src.split(',')[1];
            results.push(new Paragraph({
              children: [new ImageRun({
                data: base64Data,
                transformation: { width: 600, height: 380 },
                type: 'png'
              })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }));
          }
        } catch (e) {
          console.error('Error adding image:', e);
        }
        break;

      case 'br':
        results.push(new Paragraph({ text: '', font: 'Arial' }));
        break;

      case 'strong':
      case 'b':
      case 'em':
      case 'i':
      case 'u':
        results.push(new Paragraph({
          children: TextFormatter.extractTextRuns(el),
          font: 'Arial'
        }));
        break;

      case 'div':
      case 'section':
      case 'article':
        el.childNodes.forEach(child => {
          results.push(...processElement(child, headings));
        });
        break;

      default:
        el.childNodes.forEach(child => {
          results.push(...processElement(child, headings));
        });
    }

    return results;
  }

  return {
    processElement
  };
})();

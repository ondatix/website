/**
 * Document Builder Module
 * Handles assembly of DOCX documents with TOC and formatting
 */

const DocumentBuilder = (() => {
  /**
   * Build a DOCX document from HTML preview content
   * @param {HTMLElement} preview - The preview element containing HTML content
   * @returns {Promise<Document>} The built DOCX document
   */
  async function buildDocument(preview) {
    const { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } = docx;

    const children = [];
    const headings = [];
    const elements = preview.childNodes;

    // Process all elements in the preview
    elements.forEach(el => {
      const converted = ElementProcessor.processElement(el, headings);
      children.push(...converted);
    });

    // Extract and remove title from children (first h1)
    let titleParagraph = null;
    let contentChildren = children;
    if (children.length > 0 && children[0].heading === HeadingLevel.HEADING_1) {
      titleParagraph = children[0];
      contentChildren = children.slice(1);
    }

    // Create title section if found
    const titleChildren = titleParagraph ? [titleParagraph, new Paragraph({ text: '' })] : [];

    // TOC disabled for now
    const tocChildren = [];

    // Get charts metadata for appendix
    const chartsMetadata = ChartProcessor.getChartsMetadata();
    const appendixChildren = createAppendix(chartsMetadata, { Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType });

    // Combine title + content + appendix
    const allChildren = [...titleChildren, ...contentChildren, ...appendixChildren];

    // Create document with proper styling
    const doc = new Document({
      sections: [{
        properties: {},
        children: allChildren.length > 0
          ? allChildren
          : [new Paragraph({ text: "No content to export", font: 'Arial' })]
      }]
    });

    return doc;
  }

  /**
   * Create appendix with figure list and data tables
   * @param {Array} chartsMetadata - Chart metadata from ChartProcessor
   * @param {Object} docxClasses - DOCX library classes
   * @returns {Array} Array of Paragraph/Table objects for appendix
   */
  function createAppendix(chartsMetadata, docxClasses) {
    const { Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } = docxClasses;
    const appendix = [];

    if (chartsMetadata.length === 0) return appendix;

    // Page break before appendix
    appendix.push(new Paragraph({
      text: '',
      font: 'Arial',
      pageBreakBefore: true,
      spacing: { after: 200 }
    }));

    // Figure List
    appendix.push(new Paragraph({
      text: 'Tabellenverzeichnis',
      heading: HeadingLevel.HEADING_1,
      bold: true,
      size: 32,
      font: 'Arial',
      spacing: { before: 240, after: 240 }
    }));

    chartsMetadata.forEach((chart, idx) => {
      const figNum = idx + 1;
      appendix.push(new Paragraph({
        children: [new TextRun({
          text: `Abbildung ${figNum}: ${chart.title}`,
          font: 'Arial'
        })],
        spacing: { line: 240, after: 120 }
      }));
    });

    appendix.push(new Paragraph({
      text: '',
      font: 'Arial',
      spacing: { after: 400 }
    }));

    // Data Tables
    appendix.push(new Paragraph({
      text: 'Anhang: Rohdaten der Grafiken',
      heading: HeadingLevel.HEADING_1,
      bold: true,
      size: 32,
      font: 'Arial',
      spacing: { before: 240, after: 240 }
    }));

    chartsMetadata.forEach((chart, idx) => {
      const figNum = idx + 1;
      appendix.push(new Paragraph({
        text: `Tabelle ${figNum}: ${chart.title}`,
        heading: HeadingLevel.HEADING_2,
        bold: true,
        font: 'Arial',
        spacing: { before: 200, after: 120 }
      }));

      if (chart.description) {
        appendix.push(new Paragraph({
          text: chart.description,
          font: 'Arial',
          spacing: { after: 120 }
        }));
      }

      // Create data table
      const tableRows = [];
      
      // Header row
      tableRows.push(new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: chart.groupBy, bold: true, font: 'Arial' })],
            shading: { fill: 'b6a6f6' },
            borders: { all: { style: BorderStyle.SINGLE, size: 1, color: '000000' } }
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Anzahl', bold: true, font: 'Arial' })],
            shading: { fill: 'b6a6f6' },
            borders: { all: { style: BorderStyle.SINGLE, size: 1, color: '000000' } }
          })
        ]
      }));

      // Data rows
      chart.data.forEach(row => {
        tableRows.push(new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: String(row._label), font: 'Arial' })],
              borders: { all: { style: BorderStyle.SINGLE, size: 1, color: '000000' } }
            }),
            new TableCell({
              children: [new Paragraph({ text: String(row._value), font: 'Arial' })],
              borders: { all: { style: BorderStyle.SINGLE, size: 1, color: '000000' } }
            })
          ]
        }));
      });

      appendix.push(new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE }
      }));

      appendix.push(new Paragraph({
        text: '',
        font: 'Arial',
        spacing: { after: 300 }
      }));
    });

    return appendix;
  }

  /**
   * Create table of contents from headings
   * @param {Array} headings - Array of heading objects with text and level
   * @returns {Array} Array of Paragraph objects for TOC
   */
  function createTableOfContents(headings) {
    const { Paragraph, HeadingLevel, TextRun } = docx;
    const tocChildren = [];

    if (headings.length === 0) return tocChildren;

    tocChildren.push(new Paragraph({
      text: 'Inhaltsverzeichnis',
      heading: HeadingLevel.HEADING_1,
      bold: true,
      size: 32,
      font: 'Arial',
      spacing: { before: 240, after: 240 }
    }));

    headings.forEach((heading) => {
      const indent = (heading.level - 1) * 360;
      tocChildren.push(new Paragraph({
        children: [new TextRun({
          text: heading.text,
          font: 'Arial'
        })],
        indent: { left: indent, hanging: 0 },
        spacing: { line: 240, after: 120 }
      }));
    });

    tocChildren.push(new Paragraph({
      text: '',
      font: 'Arial',
      spacing: { after: 400 },
      pageBreakBefore: true
    }));

    return tocChildren;
  }

  /**
   * Export document to DOCX file
   * @param {Document} doc - The DOCX document to export
   * @param {string} filename - The filename for the exported file
   */
  async function exportToDocx(doc, filename = 'report.docx') {
    const { Packer } = docx;
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    buildDocument,
    createTableOfContents,
    exportToDocx
  };
})();

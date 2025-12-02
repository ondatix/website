# ADA Gleichstellungskonzepte - Modular Project Structure

This project has been refactored into a modular architecture for better maintainability, reusability, and testability.

## Project Structure

```
Musterkonzept/
├── Vorlage_js.html          # Main HTML file with UI
├── Vorlage.qmd              # Quarto document template
├── Vorlage.md               # Markdown template
├── Daten/                   # Data folder
│   ├── Stichtag_dummy_2020.csv
│   └── Stichtag_dummy.csv
└── js/                      # JavaScript modules
    ├── textFormatter.js      # Text styling extraction
    ├── listProcessor.js      # List processing (ul, ol)
    ├── elementProcessor.js   # HTML to DOCX element conversion
    ├── documentBuilder.js    # Document assembly and export
    └── uiController.js       # UI event management
```

## Module Descriptions

### 1. `textFormatter.js`
**Purpose**: Handles extraction and preservation of text formatting from HTML elements.

**Exports**:
- `getTextRunOptions(el)` - Extracts styling options (bold, italic, underline, color)
- `extractTextRuns(el)` - Creates TextRun objects with formatting

**Usage**:
```javascript
const runs = TextFormatter.extractTextRuns(htmlElement);
```

---

### 2. `listProcessor.js`
**Purpose**: Recursively processes HTML list elements with proper nesting support.

**Exports**:
- `processList(el, isOrdered)` - Converts UL/OL elements to Paragraph list items

**Features**:
- Nested list support (multi-level bullets)
- Handles both ordered and unordered lists
- Proper indentation for nested items

**Usage**:
```javascript
const items = ListProcessor.processList(ulElement, false);
```

---

### 3. `elementProcessor.js`
**Purpose**: Converts HTML elements to DOCX format elements.

**Exports**:
- `processElement(el, headings)` - Main processor for all HTML elements

**Supported Elements**:
- Headings (H1-H6) with TOC tracking
- Paragraphs with formatting
- Tables with header styling
- Lists (nested support)
- Images and Canvas elements (converted to PNG)
- Links (blue, underlined)
- Inline formatting (bold, italic, underline)

**Usage**:
```javascript
const docxElements = ElementProcessor.processElement(htmlElement, headings);
```

---

### 4. `documentBuilder.js`
**Purpose**: Assembles DOCX documents and handles export functionality.

**Exports**:
- `buildDocument(preview)` - Builds complete DOCX document from HTML
- `createTableOfContents(headings)` - Generates TOC from headings
- `exportToDocx(doc, filename)` - Exports document to file

**Features**:
- Automatic TOC generation
- Page break after TOC
- Professional document structure
- Error handling and cleanup

**Usage**:
```javascript
const doc = await DocumentBuilder.buildDocument(previewElement);
await DocumentBuilder.exportToDocx(doc, 'report.docx');
```

---

### 5. `uiController.js`
**Purpose**: Manages all user interface interactions and event handling.

**Exports**:
- `init()` - Initialize all UI listeners
- `getFormParams()` - Get form parameters

**Event Handlers**:
- Export button click
- Submit button click
- Preview button click
- Chart rendering (YAML-based)

**Usage**:
```javascript
UIController.init(); // Called automatically on DOMContentLoaded
```

---

## How It Works

### Export Flow

```
User clicks "Export" button
    ↓
UIController.handleExport()
    ↓
DocumentBuilder.buildDocument(preview)
    ├→ ElementProcessor.processElement() - converts each HTML element
    │   ├→ TextFormatter.extractTextRuns() - preserves formatting
    │   ├→ ListProcessor.processList() - handles nested lists
    │   └→ Creates DOCX elements (Tables, Images, etc.)
    ├→ Collects headings for TOC
    └→ DocumentBuilder.createTableOfContents()
    ↓
DocumentBuilder.exportToDocx()
    ↓
Downloads report.docx
```

### Preview Flow

```
User clicks "Preview" button
    ↓
UIController.handlePreview()
    ├→ Reads Markdown file
    ├→ Converts Markdown to HTML (using marked.js)
    ├→ Renders HTML in preview div
    └→ Processes chart code blocks
       └→ Converts YAML to Chart.js
```

---

## Adding New Features

### Add Support for New HTML Element

1. **Option 1**: Add case to `ElementProcessor.processElement()`
2. **Option 2**: Add helper method to relevant module (TextFormatter, ListProcessor, etc.)

### Example - Add Support for `<blockquote>`

```javascript
// In elementProcessor.js
case 'blockquote':
  results.push(new Paragraph({
    children: TextFormatter.extractTextRuns(el),
    border: { left: { color: '0000FF', space: 1, style: 'single', size: 6 } },
    indent: { left: 720 },
    font: 'Arial'
  }));
  break;
```

### Add New Text Styling

1. Modify `TextFormatter.getTextRunOptions()`
2. Add styling detection logic

---

## Benefits of Modular Architecture

✅ **Separation of Concerns** - Each module has single responsibility  
✅ **Reusability** - Modules can be used independently  
✅ **Maintainability** - Changes isolated to specific modules  
✅ **Testability** - Each module can be tested in isolation  
✅ **Scalability** - Easy to add new features or modify existing ones  
✅ **Readability** - Clean, organized code structure  

---

## Dependencies

### External Libraries
- `marked.js` - Markdown parsing
- `docx.js` - DOCX document generation
- `chart.js` - Chart rendering
- `js-yaml` - YAML parsing

### Browser APIs
- `FileReader` - File reading
- `Blob` - File creation
- `Canvas` - Chart conversion to images
- `URL.createObjectURL()` - File download

---

## Error Handling

Each module includes error handling:
- Try-catch blocks for image/canvas conversion
- Validation before processing elements
- Console logging for debugging
- User alerts for critical errors

---

## Future Improvements

- [ ] Add unit tests for each module
- [ ] Add configuration options (fonts, colors, margins)
- [ ] Support for PDF export
- [ ] Add support for custom templates
- [ ] Implement undo/redo functionality
- [ ] Add support for embedded media (audio, video metadata)

---

## License

Part of the ADA Bayern stmas_materials project

# ADA Gleichstellungskonzept - Web Application

A complete system for creating professional Gleichstellungskonzepte (equality concepts) with charts directly from CSV data.

**Status:** ✅ Production Ready | **Version:** 1.0 | **Last Updated:** November 19, 2025

## 🎯 Quick Start (2 Minutes)

```
1. Open Vorlage_js.html in any modern browser
2. Click file input → Select CSV (e.g., Daten/Stichtag_dummy.csv)
3. Set parameters (year, privacy threshold, institution name)
4. Click file input → Upload Vorlage.md template
5. Click "Vorschau erzeugen" → See charts render
6. Click "Als DOCX exportieren" → Download professional report
```

## 📚 Documentation Guide

### 🚀 **First Time Users** (Start Here)
| Document | Purpose | Read Time |
|----------|---------|-----------|
| **INDEX.md** | Navigation guide to all docs | 3 min |
| **QUICK_REFERENCE.md** | Command syntax & common tasks | 5 min |
| **GUIDE.md** | Complete user guide with examples | 20 min |

### 🔄 **Understanding the Transition**
| Document | Purpose | Read Time |
|----------|---------|-----------|
| **TRANSLATION_SUMMARY.md** | What changed from R to JavaScript | 10 min |
| **TRANSLATION_GUIDE.md** | Detailed migration documentation | 20 min |

### 🔧 **Technical Details**
| Document | Purpose | Read Time |
|----------|---------|-----------|
| **ARCHITECTURE.md** | System design & module structure | 15 min |
| **DATAPROCESSOR_REFERENCE.md** | JavaScript function reference | 15 min |

### 📋 **Project Information**
| Document | Purpose | Read Time |
|----------|---------|-----------|
| **Vorlage.md** | Main template for reports | - |
| **Vorlage.qmd** | Original R/Quarto template (reference) | - |

---

## 🌟 What's New (November 2025)

### ✨ Major Update: R → JavaScript Migration
The system has been successfully translated from R/Quarto to JavaScript/Markdown:

- ✅ **dataProcessor.js** - New JavaScript module with all R functions
- ✅ **Vorlage.md** - Complete markdown template with 18 chart configurations
- ✅ **Privacy Protection** - Automatic "Datenschutz" applied to all data
- ✅ **Accessibility** - German alt text for all charts (Barrierefreiheit)
- ✅ **No Server Needed** - All processing happens in the browser
- ✅ **Full Documentation** - 7 comprehensive guides + this README

### Key Functions Now in JavaScript
| R Function | JavaScript Location | Purpose |
|---|---|---|
| `tabellen_datenschutz()` | DataProcessor.tabellen_datenschutz() | Table privacy |
| `grafik_datenschutz()` | DataProcessor.grafik_datenschutz() | Chart privacy |
| `datenvorbereitung()` | DataProcessor.datenvorbereitung() | Data prep |
| `alttexterstellung()` | DataProcessor.alttexterstellung() | Alt text |
| `barrierefreies_balkendiagramm()` | YAML chart blocks | Bar charts |

---

## 📂 Project Structure

```
Musterkonzept/
├── 📄 Vorlage_js.html                    ← Main app (open in browser)
├── 📄 Vorlage.md                         ← Main template (upload to app)
├── 📄 Vorlage.qmd                        ← Original R template (reference)
│
├── 📚 INDEX.md                           ← Documentation navigation
├── 📚 QUICK_REFERENCE.md                 ← Quick syntax guide
├── 📚 GUIDE.md                           ← Complete user guide
├── � TRANSLATION_SUMMARY.md             ← What changed
├── 📚 TRANSLATION_GUIDE.md               ← Migration details
├── 📚 ARCHITECTURE.md                    ← System design
├── 📚 DATAPROCESSOR_REFERENCE.md         ← Function reference
├── 📚 README.md                          ← This file
│
├── 📁 js/
│   ├── dataProcessor.js          ✨ NEW: R functions in JS
│   ├── dataManager.js            CSV loading & aggregation
│   ├── chartProcessor.js         Chart rendering (YAML→Chart.js)
│   ├── documentBuilder.js        DOCX export
│   ├── textFormatter.js          Text formatting
│   ├── elementProcessor.js       HTML to DOCX
│   ├── listProcessor.js          List handling
│   ├── uiController.js           UI event management
│   └── external/                 Chart.js, marked, docx libs
│
└── 📁 Daten/
    ├── Stichtag_dummy.csv        Sample data
    └── Stichtag_dummy_2020.csv   Historical data
```

---

## 🔄 How It Works

### Data Flow
```
CSV File
    ↓
DataManager.loadCSV()  (Parse & store in memory)
    ↓
Vorlage.md (Markdown with ```chart blocks)
    ↓
ChartProcessor (Parse YAML → Find matching data)
    ↓
DataProcessor (Apply privacy, create alt text)
    ↓
DataManager.aggregate() (Group, filter, count/sum)
    ↓
Chart.js (Render charts)
    ↓
HTML Preview (Display with text & tables)
    ↓
DocumentBuilder (Export to DOCX)
```

### Privacy Protection (Datenschutz)
- **Automatic** - Applied by DataProcessor functions
- **Configurable** - Set privacy threshold in HTML form (default: 3)
- **For Tables** - Shows `< 3` for values below threshold
- **For Charts** - Omits data points below threshold

### Accessibility (Barrierefreiheit)
- **Alt Text** - Generated automatically for all charts (German)
- **Screen Readers** - Full support with semantic HTML
- **Color Palettes** - WCAG 2.1 AA compliant, color-blind friendly
- **Keyboard** - All controls fully keyboard accessible  

---

## ⚡ Features

### Core Functionality
✅ Load any CSV data (browser-side, no upload to server)
✅ Define charts in simple YAML format
✅ Filter data with multiple conditions
✅ Group data by multiple columns
✅ Generate charts: bar, pie, line, doughnut, radar
✅ Export professional DOCX documents
✅ No coding required - configuration-based

### Data Protection
✅ Privacy thresholds (Datenschutz)
✅ Automatic data filtering
✅ Local processing only (no server)
✅ DSGVO compliant

### Accessibility
✅ German alt text for charts
✅ WCAG 2.1 AA compliant
✅ Color-blind friendly palettes
✅ Screen reader support
✅ Keyboard navigation

### User Experience
✅ No dependencies to install
✅ Runs in any modern browser
✅ Real-time preview
✅ Professional output
✅ Comprehensive documentation

---

## 💡 Common Tasks

### Create a Simple Chart
See **QUICK_REFERENCE.md** → "Common Chart Configurations"

### Filter Data by Gender
```yaml
data:
  groupBy: Führungsebene
  filters:
    Geschlechtsschluessel: weiblich
```

### Apply Privacy Protection
Set "Kleinste N" parameter to 3 (or desired threshold)

### Customize Colors
Change `palette: palette1` to `palette2` or `palette3`

### Add Multiple Breakdowns
Use `groupFill` for legend/color grouping:
```yaml
data:
  groupBy: Führungsebene
  groupFill: Geschlechtsschluessel  ← Creates color groups
```

---

## ❓ Find What You Need

| Question | Answer |
|----------|--------|
| How do I use this? | See GUIDE.md |
| What's the syntax? | See QUICK_REFERENCE.md |
| What changed from R? | See TRANSLATION_SUMMARY.md |
| How does it work technically? | See ARCHITECTURE.md |
| Where's the function reference? | See DATAPROCESSOR_REFERENCE.md |
| Which doc should I read? | See INDEX.md |

---

## 🚀 Usage Steps

### Step 1: Prepare Data
- Have CSV with columns: `Geschlechtsschluessel`, `Qualifikationsebene`, `Führungsebene`, etc.

### Step 2: Run Application
```bash
# Just open in browser - no installation needed!
Vorlage_js.html
```

### Step 3: Load Data
1. Click "Parameter 1: Pfad zur CSV-Datei"
2. Select your CSV file
3. Wait for: "✓ Dataset loaded"

### Step 4: Configure
1. Set "Erhebungsjahr" (year)
2. Select "Farbpalette" (color scheme)
3. Set "Kleinste N" (privacy threshold)
4. Enter "Name der Institution"

### Step 5: Upload Template
1. Click "Markdown-Report-Vorlage hochladen"
2. Select `Vorlage.md`

### Step 6: Preview
1. Click "Vorschau erzeugen"
2. Review charts and content

### Step 7: Export
1. Click "Als DOCX exportieren"
2. Save the document

---

## 📊 Example Chart Configurations

### Simple Bar Chart
```yaml
```chart
type: bar
title: Personalverteilung
data:
  groupBy: Qualifikationsebene
  operation: count
```
```

### Gender Comparison
```yaml
```chart
type: bar
title: Geschlechterverteilung nach Ebene
data:
  groupBy: Führungsebene
  groupFill: Geschlechtsschluessel
  operation: count
```
```

### Filtered Pie Chart
```yaml
```chart
type: pie
title: Frauen in Führung
data:
  groupBy: Führungsebene
  filters:
    Geschlechtsschluessel: weiblich
  operation: count
```
```

See **GUIDE.md** for 20+ more examples.

---

## �� Privacy & Security

- ✅ **No server required** - All processing in browser
- ✅ **Data stays local** - Never sent to any server
- ✅ **Privacy protection** - Automatic threshold filtering
- ✅ **DSGVO compliant** - No personal data processing
- ✅ **Secure export** - DOCX created locally, then downloaded

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| IE11 | ❌ Not supported |

**Recommendation:** Use latest version of Chrome, Firefox, or Safari for best experience.

---

## 🔧 Technical Details

### Modules (JavaScript)
- **dataManager.js** - CSV loading & data aggregation
- **dataProcessor.js** - Privacy & formatting (NEW)
- **chartProcessor.js** - YAML → Chart.js rendering
- **documentBuilder.js** - HTML → DOCX export
- **Others** - Text, list, element processing

### Dependencies (External Libraries)
- **Chart.js** - Chart rendering
- **marked.js** - Markdown parsing
- **js-yaml** - YAML parsing
- **docx** - DOCX document generation

### Data Format (CSV)
Required columns: `Geschlechtsschluessel`, `Qualifikationsebene`, `Führungsebene`, `Teilzeitgrundschluessel`, `Arbeitszeitanteil`, `Anwesenheitsart`

### Output Format
- **Preview:** Interactive HTML with Chart.js
- **Export:** Professional DOCX document with embedded images

---

## �� Full Documentation

```
START HERE → INDEX.md (3 min navigation guide)
   ↓
Choose your path:

FOR USERS:
   QUICK_REFERENCE.md → GUIDE.md → Use the app

FOR DEVELOPERS:
   TRANSLATION_SUMMARY.md → ARCHITECTURE.md → DATAPROCESSOR_REFERENCE.md

FOR MIGRATION:
   TRANSLATION_GUIDE.md → Details about R→JS conversion
```

---

## ✅ Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 19, 2025 | 🎉 Complete R→JS migration, new dataProcessor.js, comprehensive docs |
| 0.9 | Nov 18, 2025 | Earlier version with R template |

---

## 📞 Support Resources

- **INDEX.md** - Navigation to all documentation
- **QUICK_REFERENCE.md** - Syntax & common tasks
- **GUIDE.md** - Complete user guide with examples
- **TRANSLATION_GUIDE.md** - Technical migration details
- **ARCHITECTURE.md** - System design details

---

## 🎉 Ready to Start?

1. **New to the system?** → Read INDEX.md (3 min)
2. **Want quick syntax?** → See QUICK_REFERENCE.md (5 min)
3. **Need full guide?** → See GUIDE.md (20 min)
4. **Ready to use?** → Open Vorlage_js.html in your browser! 🚀

---

**Created by:** ADA Bayern  
**Status:** ✅ Production Ready  
**License:** Internal Use  
**Last Updated:** November 19, 2025

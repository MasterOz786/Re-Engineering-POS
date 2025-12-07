# PDF Conversion Guide

This guide explains how to convert all the reengineering documentation into a single PDF file.

## Option 1: Using Pandoc (Recommended)

### Prerequisites

1. **Install Pandoc:**
   ```bash
   # macOS
   brew install pandoc
   
   # Ubuntu/Debian
   sudo apt-get install pandoc
   
   # Windows
   # Download from: https://pandoc.org/installing.html
   ```

2. **Install LaTeX (for PDF generation):**
   ```bash
   # macOS
   brew install --cask mactex
   # Or smaller version:
   brew install --cask basictex
   
   # Ubuntu/Debian
   sudo apt-get install texlive-full
   # Or smaller version:
   sudo apt-get install texlive-latex-base texlive-latex-extra
   ```

### Method 1A: Using the Script

```bash
cd legacy/
chmod +x convert_to_pdf.sh
./convert_to_pdf.sh
```

This will create `COMPLETE_REENGINEERING_REPORT.pdf` in the `legacy/` directory.

### Method 1B: Manual Pandoc Command

```bash
cd legacy/

pandoc \
    --from=markdown \
    --to=pdf \
    --output=COMPLETE_REENGINEERING_REPORT.pdf \
    --pdf-engine=xelatex \
    --variable=geometry:margin=1in \
    --variable=fontsize:11pt \
    --variable=documentclass:article \
    --toc \
    --toc-depth=3 \
    --number-sections \
    --highlight-style=tango \
    --metadata=title:"Complete Software Reengineering Report" \
    --metadata=author:"Your Team Name" \
    --metadata=date:"December 2025" \
    REENGINEERING_REPORT.md \
    A_LEGACY_SYSTEM_DOCUMENTATION.md \
    B_REENGINEERED_SYSTEM_DOCUMENTATION.md \
    C_REFACTORING_DOCUMENTATION.md \
    D_RISK_ANALYSIS_AND_TESTING.md \
    E_WORK_DISTRIBUTION.md \
    DIAGRAMS_SUMMARY.md
```

---

## Option 2: Using Online Tools

### Markdown to PDF Converters

1. **Dillinger.io**
   - Go to https://dillinger.io/
   - Copy and paste markdown content
   - Export as PDF

2. **StackEdit**
   - Go to https://stackedit.io/
   - Import markdown files
   - Export as PDF

3. **Markdown to PDF**
   - Go to https://www.markdowntopdf.com/
   - Upload markdown files
   - Download PDF

**Note:** These tools may not handle multiple files well. You may need to combine files first.

---

## Option 3: Using VS Code Extension

1. **Install "Markdown PDF" extension** in VS Code
2. Open the master document (`COMPLETE_REENGINEERING_REPORT.md`)
3. Right-click → "Markdown PDF: Export (pdf)"
4. Or use Command Palette: `Markdown PDF: Export (pdf)`

---

## Option 4: Using wkhtmltopdf (Alternative)

### Prerequisites

```bash
# macOS
brew install wkhtmltopdf

# Ubuntu/Debian
sudo apt-get install wkhtmltopdf
```

### Convert via HTML

```bash
cd legacy/

# Convert markdown to HTML
pandoc \
    --from=markdown \
    --to=html \
    --standalone \
    --toc \
    --toc-depth=3 \
    --number-sections \
    --highlight-style=tango \
    REENGINEERING_REPORT.md \
    A_LEGACY_SYSTEM_DOCUMENTATION.md \
    B_REENGINEERED_SYSTEM_DOCUMENTATION.md \
    C_REFACTORING_DOCUMENTATION.md \
    D_RISK_ANALYSIS_AND_TESTING.md \
    E_WORK_DISTRIBUTION.md \
    DIAGRAMS_SUMMARY.md \
    -o combined.html

# Convert HTML to PDF
wkhtmltopdf \
    --page-size A4 \
    --margin-top 20mm \
    --margin-bottom 20mm \
    --margin-left 15mm \
    --margin-right 15mm \
    --encoding UTF-8 \
    --enable-local-file-access \
    combined.html COMPLETE_REENGINEERING_REPORT.pdf

# Clean up
rm combined.html
```

---

## Option 5: Using Python (markdown-pdf)

### Install

```bash
pip install markdown-pdf
```

### Convert

```bash
cd legacy/

# Create a combined markdown file first
cat REENGINEERING_REPORT.md \
    A_LEGACY_SYSTEM_DOCUMENTATION.md \
    B_REENGINEERED_SYSTEM_DOCUMENTATION.md \
    C_REFACTORING_DOCUMENTATION.md \
    D_RISK_ANALYSIS_AND_TESTING.md \
    E_WORK_DISTRIBUTION.md \
    DIAGRAMS_SUMMARY.md > combined.md

# Convert to PDF
markdown-pdf combined.md -o COMPLETE_REENGINEERING_REPORT.pdf

# Clean up
rm combined.md
```

---

## Handling Mermaid Diagrams

The `DIAGRAMS.md` file contains Mermaid diagrams that may not render directly in PDF. Options:

### Option A: Convert Mermaid to Images

1. Use online tool: https://mermaid.live/
2. Export each diagram as PNG/SVG
3. Replace Mermaid code blocks with image references:
   ```markdown
   ![Diagram Name](path/to/diagram.png)
   ```

### Option B: Use Pandoc with Mermaid Filter

```bash
# Install mermaid filter
npm install -g @mermaid-js/mermaid-cli

# Use pandoc with filter
pandoc --filter mermaid-filter ...
```

### Option C: Include Diagrams as Separate Section

You can manually convert diagrams or include them as a separate appendix in the PDF.

---

## Recommended Workflow

1. **Combine all markdown files** into one master document (or use the script)
2. **Review the combined document** for formatting issues
3. **Convert Mermaid diagrams** to images if needed
4. **Use Pandoc** to generate PDF (best quality)
5. **Review the PDF** and adjust formatting if needed

---

## Troubleshooting

### Pandoc LaTeX Errors

If you get LaTeX errors, try:
```bash
# Use pdflatex instead of xelatex
--pdf-engine=pdflatex
```

### Missing Fonts

Install additional fonts:
```bash
# macOS
brew install font-hack

# Or use system fonts
--variable=mainfont:"Arial"
```

### Large File Size

If PDF is too large:
- Reduce image quality
- Use compression
- Split into multiple PDFs

### Table of Contents Issues

Ensure `--toc` flag is included and LaTeX is properly installed.

---

## Quick Start (macOS)

```bash
# Install dependencies
brew install pandoc
brew install --cask basictex

# Run conversion
cd legacy/
chmod +x convert_to_pdf.sh
./convert_to_pdf.sh
```

---

## Output File

The final PDF will be saved as:
- `legacy/COMPLETE_REENGINEERING_REPORT.pdf`

This PDF contains all documentation sections in a single, professionally formatted document with:
- Table of Contents
- Numbered Sections
- Proper Formatting
- Code Syntax Highlighting
- All Diagrams (if converted to images)

---

**Need Help?** If you encounter issues, check:
1. All dependencies are installed
2. File paths are correct
3. Markdown syntax is valid
4. LaTeX/PDF engine is working


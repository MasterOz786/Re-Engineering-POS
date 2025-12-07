#!/bin/bash

# Script to convert all markdown documentation to a single PDF
# Requires: pandoc and a LaTeX distribution (or wkhtmltopdf)

echo "📄 Converting Reengineering Documentation to PDF..."
echo ""

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Error: pandoc is not installed"
    echo "Install it with:"
    echo "  macOS: brew install pandoc"
    echo "  Ubuntu: sudo apt-get install pandoc"
    echo "  Or download from: https://pandoc.org/installing.html"
    exit 1
fi

# Check if wkhtmltopdf is installed (alternative method)
if ! command -v wkhtmltopdf &> /dev/null; then
    echo "⚠️  Note: wkhtmltopdf not found. Using pandoc with LaTeX."
    echo "   For better HTML rendering, install wkhtmltopdf:"
    echo "   macOS: brew install wkhtmltopdf"
    echo ""
fi

# Output file
OUTPUT_FILE="COMPLETE_REENGINEERING_REPORT.pdf"

# Method 1: Using pandoc with LaTeX (recommended for best quality)
echo "🔄 Method 1: Using pandoc with LaTeX..."
pandoc \
    --from=markdown \
    --to=pdf \
    --output="$OUTPUT_FILE" \
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
    --metadata=date:"$(date +'%B %Y')" \
    REENGINEERING_REPORT.md \
    A_LEGACY_SYSTEM_DOCUMENTATION.md \
    B_REENGINEERED_SYSTEM_DOCUMENTATION.md \
    C_REFACTORING_DOCUMENTATION.md \
    D_RISK_ANALYSIS_AND_TESTING.md \
    E_WORK_DISTRIBUTION.md \
    DIAGRAMS_SUMMARY.md

if [ $? -eq 0 ]; then
    echo "✅ PDF created successfully: $OUTPUT_FILE"
    echo "📊 File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
else
    echo "❌ Error creating PDF with pandoc"
    echo ""
    echo "🔄 Trying alternative method..."
    
    # Method 2: Convert to HTML first, then to PDF
    if command -v wkhtmltopdf &> /dev/null; then
        echo "Using wkhtmltopdf..."
        pandoc \
            --from=markdown \
            --to=html \
            --standalone \
            --toc \
            --toc-depth=3 \
            --number-sections \
            --highlight-style=tango \
            --metadata=title:"Complete Software Reengineering Report" \
            REENGINEERING_REPORT.md \
            A_LEGACY_SYSTEM_DOCUMENTATION.md \
            B_REENGINEERED_SYSTEM_DOCUMENTATION.md \
            C_REFACTORING_DOCUMENTATION.md \
            D_RISK_ANALYSIS_AND_TESTING.md \
            E_WORK_DISTRIBUTION.md \
            DIAGRAMS_SUMMARY.md \
            -o temp.html
        
        wkhtmltopdf \
            --page-size A4 \
            --margin-top 20mm \
            --margin-bottom 20mm \
            --margin-left 15mm \
            --margin-right 15mm \
            --encoding UTF-8 \
            --enable-local-file-access \
            temp.html "$OUTPUT_FILE"
        
        rm temp.html
        
        if [ $? -eq 0 ]; then
            echo "✅ PDF created successfully: $OUTPUT_FILE"
        else
            echo "❌ Error creating PDF"
        fi
    else
        echo "❌ Both methods failed. Please install pandoc with LaTeX or wkhtmltopdf"
    fi
fi

echo ""
echo "📝 Note: If you need to include DIAGRAMS.md, you may need to:"
echo "   1. Convert Mermaid diagrams to images first"
echo "   2. Or use an online Mermaid to image converter"
echo "   3. Then include the images in the markdown files"


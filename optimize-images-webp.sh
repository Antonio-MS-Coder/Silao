#!/bin/bash

# Image Optimization Script for Plaza Real Silao
# Converts PNG/JPG images to WebP format with optimal compression

echo "🖼️  Plaza Real Silao - Image Optimization Script"
echo "=================================================="

# Configuration
INPUT_DIR="./images/stores"
OUTPUT_DIR="./images/stores"
QUALITY=80
WIDTH=400
HEIGHT=300

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Please install WebP tools:"
    echo "   macOS: brew install webp"
    echo "   Ubuntu: sudo apt-get install webp"
    exit 1
fi

echo "📁 Processing images in: $INPUT_DIR"
echo "🎯 Target dimensions: ${WIDTH}x${HEIGHT}"
echo "📊 Quality: ${QUALITY}%"
echo ""

# Process PNG files
png_count=0
png_size_before=0
png_size_after=0

for file in "$INPUT_DIR"/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .png)
        output_file="$OUTPUT_DIR/${filename}.webp"
        
        # Get file size before
        size_before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        png_size_before=$((png_size_before + size_before))
        
        echo "🔄 Converting: $filename.png"
        
        # Convert to WebP
        cwebp -q "$QUALITY" -resize "$WIDTH" "$HEIGHT" "$file" -o "$output_file" -quiet
        
        if [ $? -eq 0 ]; then
            # Get file size after
            size_after=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
            png_size_after=$((png_size_after + size_after))
            
            reduction=$(echo "scale=1; (1 - $size_after/$size_before) * 100" | bc)
            echo "   ✅ $filename.webp (${reduction}% reduction)"
            
            png_count=$((png_count + 1))
        else
            echo "   ❌ Failed to convert $filename.png"
        fi
    fi
done

# Process JPG files
jpg_count=0
jpg_size_before=0
jpg_size_after=0

for file in "$INPUT_DIR"/*.jpg "$INPUT_DIR"/*.jpeg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" | sed 's/\.[^.]*$//')
        output_file="$OUTPUT_DIR/${filename}.webp"
        
        # Get file size before
        size_before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        jpg_size_before=$((jpg_size_before + size_before))
        
        echo "🔄 Converting: $filename.jpg"
        
        # Convert to WebP
        cwebp -q "$QUALITY" -resize "$WIDTH" "$HEIGHT" "$file" -o "$output_file" -quiet
        
        if [ $? -eq 0 ]; then
            # Get file size after
            size_after=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
            jpg_size_after=$((jpg_size_after + size_after))
            
            reduction=$(echo "scale=1; (1 - $size_after/$size_before) * 100" | bc)
            echo "   ✅ $filename.webp (${reduction}% reduction)"
            
            jpg_count=$((jpg_count + 1))
        else
            echo "   ❌ Failed to convert $filename"
        fi
    fi
done

# Summary
echo ""
echo "📈 OPTIMIZATION SUMMARY"
echo "======================"
echo "PNG files processed: $png_count"
if [ $png_count -gt 0 ]; then
    total_png_reduction=$(echo "scale=1; (1 - $png_size_after/$png_size_before) * 100" | bc)
    echo "PNG size reduction: ${total_png_reduction}%"
    echo "PNG before: $(numfmt --to=iec $png_size_before)B"
    echo "PNG after:  $(numfmt --to=iec $png_size_after)B"
fi

echo ""
echo "JPG files processed: $jpg_count"
if [ $jpg_count -gt 0 ]; then
    total_jpg_reduction=$(echo "scale=1; (1 - $jpg_size_after/$jpg_size_before) * 100" | bc)
    echo "JPG size reduction: ${total_jpg_reduction}%"
    echo "JPG before: $(numfmt --to=iec $jpg_size_before)B"
    echo "JPG after:  $(numfmt --to=iec $jpg_size_after)B"
fi

total_before=$((png_size_before + jpg_size_before))
total_after=$((png_size_after + jpg_size_after))

if [ $total_before -gt 0 ]; then
    total_reduction=$(echo "scale=1; (1 - $total_after/$total_before) * 100" | bc)
    echo ""
    echo "🎉 TOTAL SAVINGS"
    echo "================"
    echo "Total reduction: ${total_reduction}%"
    echo "Total before: $(numfmt --to=iec $total_before)B"
    echo "Total after:  $(numfmt --to=iec $total_after)B"
    echo "Bytes saved:  $(numfmt --to=iec $((total_before - total_after)))B"
fi

echo ""
echo "✅ Optimization complete!"
echo "💡 Don't forget to update your JSON files to use .webp extensions"
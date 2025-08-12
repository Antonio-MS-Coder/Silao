#!/bin/bash

# Script para optimizar imágenes
# Requiere: imagemagick (brew install imagemagick)
# Para WebP: brew install webp

echo "🖼️ Iniciando optimización de imágenes..."

# Crear directorio de respaldo
BACKUP_DIR="images_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Función para optimizar PNG
optimize_png() {
    local file=$1
    local dir=$(dirname "$file")
    local filename=$(basename "$file")
    
    # Hacer respaldo
    cp "$file" "$BACKUP_DIR/$filename"
    
    # Optimizar PNG (reducir calidad a 85% y redimensionar si es muy grande)
    convert "$file" \
        -quality 85 \
        -resize '1200x1200>' \
        -strip \
        "$file.tmp"
    
    mv "$file.tmp" "$file"
    
    # Crear versión WebP
    cwebp -q 80 "$file" -o "${file%.png}.webp" 2>/dev/null
    
    echo "✓ Optimizado: $file"
}

# Función para optimizar JPG
optimize_jpg() {
    local file=$1
    local dir=$(dirname "$file")
    local filename=$(basename "$file")
    
    # Hacer respaldo
    cp "$file" "$BACKUP_DIR/$filename"
    
    # Optimizar JPG
    convert "$file" \
        -quality 85 \
        -resize '1200x1200>' \
        -strip \
        -interlace Plane \
        -gaussian-blur 0.05 \
        "$file.tmp"
    
    mv "$file.tmp" "$file"
    
    # Crear versión WebP
    cwebp -q 80 "$file" -o "${file%.jpg}.webp" 2>/dev/null
    
    echo "✓ Optimizado: $file"
}

# Buscar y optimizar imágenes PNG
echo "Optimizando archivos PNG..."
find images/stores -name "*.png" -type f | while read file; do
    optimize_png "$file"
done

# Buscar y optimizar imágenes JPG
echo "Optimizando archivos JPG..."
find images/stores -name "*.jpg" -type f | while read file; do
    optimize_jpg "$file"
done

echo "✅ Optimización completada!"
echo "📁 Respaldo guardado en: $BACKUP_DIR"
echo ""
echo "Tamaños antes y después:"
echo "------------------------"
du -sh "$BACKUP_DIR" | awk '{print "Antes: " $1}'
du -sh images/stores | awk '{print "Después: " $1}'
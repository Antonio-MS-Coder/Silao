#!/bin/bash

echo "🚀 Optimización completa de TODAS las imágenes..."

# Crear directorio de respaldo
BACKUP_DIR="images_backup_complete_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Función para crear versión WebP optimizada usando sips (macOS nativo)
create_webp_with_sips() {
    local input="$1"
    local output="${input%.*}.webp"
    local temp_jpg="${input%.*}_temp.jpg"
    
    # Primero convertir y redimensionar a JPG temporal
    sips -s format jpeg -s formatOptions 85 -Z 800 "$input" --out "$temp_jpg" 2>/dev/null
    
    # Si sips puede crear WebP directamente (macOS 11+)
    if sips -s format webp "$temp_jpg" --out "$output" 2>/dev/null; then
        rm "$temp_jpg"
        echo "✅ Creado: $output"
    else
        # Fallback: mantener JPG optimizado
        mv "$temp_jpg" "${input%.*}.jpg"
        echo "✅ Optimizado como JPG: ${input%.*}.jpg"
    fi
}

# Optimizar imágenes en images/plaza/
echo ""
echo "📁 Optimizando imágenes en /images/plaza/..."
for img in images/plaza/*.png; do
    if [ -f "$img" ]; then
        cp "$img" "$BACKUP_DIR/$(basename "$img")"
        create_webp_with_sips "$img"
    fi
done

# Asegurar que TODAS las imágenes de stores tengan WebP
echo ""
echo "📁 Verificando imágenes en /images/stores/..."
for img in images/stores/*.png images/stores/*.jpg; do
    if [ -f "$img" ]; then
        webp_file="${img%.*}.webp"
        if [ ! -f "$webp_file" ]; then
            echo "⚠️  Falta WebP para: $img"
            cp "$img" "$BACKUP_DIR/$(basename "$img")"
            create_webp_with_sips "$img"
        fi
    fi
done

# Optimizar el mapa principal si es muy grande
echo ""
echo "🗺️  Optimizando mapa principal..."
if [ -f "images/mapa-tiendas-silao.webp" ]; then
    size=$(du -k "images/mapa-tiendas-silao.webp" | cut -f1)
    if [ "$size" -gt 100 ]; then
        echo "Mapa actual: ${size}KB - Optimizando..."
        cp "images/mapa-tiendas-silao.webp" "$BACKUP_DIR/"
        # Reoptimizar el mapa
        sips -s format jpeg -s formatOptions 85 -Z 1200 "images/mapa-tiendas-silao.webp" --out "images/mapa-temp.jpg" 2>/dev/null
        sips -s format webp "images/mapa-temp.jpg" --out "images/mapa-tiendas-silao-optimized.webp" 2>/dev/null
        if [ -f "images/mapa-tiendas-silao-optimized.webp" ]; then
            mv "images/mapa-tiendas-silao-optimized.webp" "images/mapa-tiendas-silao.webp"
            rm "images/mapa-temp.jpg"
            echo "✅ Mapa optimizado"
        fi
    fi
fi

echo ""
echo "📊 Resumen de optimización:"
echo "================================"
echo "Respaldo guardado en: $BACKUP_DIR"
echo ""
echo "Imágenes WebP creadas:"
find images -name "*.webp" -newer "$BACKUP_DIR" 2>/dev/null | wc -l
echo ""
echo "✅ Optimización completada!"
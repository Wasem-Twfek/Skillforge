# Convert SVG to PNG using Inkscape
# This script requires Inkscape to be installed and added to PATH

# Configuration
$iconsDir = Join-Path $PSScriptRoot "..\public\icons"
$sizes = @(192, 512)
$inkscapePath = "C:\Program Files\Inkscape\bin\inkscape.exe"

# Check if Inkscape exists
if (-not (Test-Path $inkscapePath)) {
    Write-Error "❌ Inkscape not found at $inkscapePath"
    exit 1
}

# Create icons directory if it doesn't exist
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
    Write-Host "✅ Created icons directory: $iconsDir"
}

# Base SVG path
$svgPath = Join-Path $iconsDir "icon.svg"
if (-not (Test-Path $svgPath)) {
    Write-Error "❌ Base SVG icon not found: $svgPath"
    exit 1
}

# Generate icons in different sizes
foreach ($size in $sizes) {
    $pngPath = Join-Path $iconsDir "icon-${size}x${size}.png"
    & $inkscapePath --export-filename="$pngPath" --export-width=$size --export-height=$size "$svgPath"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Generated: $pngPath"
    } else {
        Write-Error "❌ Failed to generate: $pngPath"
    }
}

# Generate apple touch icon
$appleTouchPath = Join-Path $iconsDir "apple-touch-icon.png"
& $inkscapePath --export-filename="$appleTouchPath" --export-width=180 --export-height=180 "$svgPath"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Generated apple touch icon"
} else {
    Write-Error "❌ Failed to generate apple touch icon"
}

Write-Host "`n✅ Icon generation complete" 
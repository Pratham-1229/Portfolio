Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\prath\.gemini\antigravity-ide\brain\7355eb8f-41f4-4e1a-b476-07bdbaf841c9\.user_uploaded\media_1790619535913.png"
$publicDir = "e:\Porfolio\chanhdai.com\public"
$appDir = "e:\Porfolio\chanhdai.com\src\app"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$src = [System.Drawing.Image]::FromFile($srcPath)

function Resize-And-Save-Png($source, $width, $height, $destPath) {
    $dest = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($source, 0, 0, $width, $height)
    $g.Dispose()
    
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Created: $destPath ($width x $height)"
}

# 1. Generate PNGs in public/
Resize-And-Save-Png $src 16 16 "$publicDir\favicon-16x16.png"
Resize-And-Save-Png $src 32 32 "$publicDir\favicon-32x32.png"
Resize-And-Save-Png $src 48 48 "$publicDir\favicon-48x48.png"
Resize-And-Save-Png $src 180 180 "$publicDir\apple-touch-icon.png"
Resize-And-Save-Png $src 192 192 "$publicDir\icon-192.png"
Resize-And-Save-Png $src 512 512 "$publicDir\icon-512.png"

# 2. Generate PNGs in src/app for Next.js App Router metadata conventions
Resize-And-Save-Png $src 32 32 "$appDir\icon.png"
Resize-And-Save-Png $src 180 180 "$appDir\apple-icon.png"

# 3. Generate multi-resolution .ico file
function Build-Ico($source, [int[]]$sizes, $destPath) {
    $pngBuffers = @()
    foreach ($sz in $sizes) {
        $dest = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($dest)
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($source, 0, 0, $sz, $sz)
        $g.Dispose()
        
        $ms = New-Object System.IO.MemoryStream
        $dest.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $dest.Dispose()
        $pngBuffers += ,@($sz, $ms.ToArray())
        $ms.Dispose()
    }
    
    $fs = New-Object System.IO.FileStream($destPath, [System.IO.FileMode]::Create)
    $bw = New-Object System.IO.BinaryWriter($fs)
    
    # ICO Header: Reserved (2), Type (2), Count (2)
    $bw.Write([uint16]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]$pngBuffers.Count)
    
    $offset = 6 + 16 * $pngBuffers.Count
    foreach ($item in $pngBuffers) {
        $sz = $item[0]
        $bytes = $item[1]
        $w = if ($sz -ge 256) { [byte]0 } else { [byte]$sz }
        $h = if ($sz -ge 256) { [byte]0 } else { [byte]$sz }
        $bw.Write($w)
        $bw.Write($h)
        $bw.Write([byte]0) # colors
        $bw.Write([byte]0) # reserved
        $bw.Write([uint16]1) # planes
        $bw.Write([uint16]32) # bpp
        $bw.Write([uint32]$bytes.Length)
        $bw.Write([uint32]$offset)
        $offset += $bytes.Length
    }
    
    foreach ($item in $pngBuffers) {
        $bytes = $item[1]
        $bw.Write($bytes)
    }
    
    $bw.Close()
    $fs.Close()
    Write-Output "Created ICO: $destPath"
}

Build-Ico $src @(16, 32, 48) "$publicDir\favicon.ico"
Build-Ico $src @(16, 32, 48) "$appDir\favicon.ico"

$src.Dispose()
Write-Output "All icons generated successfully!"

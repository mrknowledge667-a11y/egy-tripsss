# Download 30 high-quality Egypt travel images from Unsplash in WebP format
# Images are saved with SEO-friendly names to /public/assets/images/

$outputDir = Join-Path $PSScriptRoot "..\public\assets\images"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$images = @(
    # Hero & Pyramids (1-3)
    @{ name = "pyramids-giza-golden-hour.webp"; url = "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1400&q=85&fm=webp&fit=crop" },
    @{ name = "sphinx-pyramids-panorama.webp"; url = "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1400&q=85&fm=webp&fit=crop" },
    @{ name = "cairo-skyline-nile-river.webp"; url = "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1400&q=85&fm=webp&fit=crop" },

    # Cultural Heritage (4-9)
    @{ name = "karnak-temple-columns-luxor.webp"; url = "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "valley-of-kings-luxor.webp"; url = "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "abu-simbel-temple-ramesses.webp"; url = "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "luxor-temple-night-lights.webp"; url = "https://images.unsplash.com/photo-1608156639585-b3a776f1f3e0?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "egyptian-museum-cairo-artifacts.webp"; url = "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "hatshepsut-temple-deir-el-bahari.webp"; url = "https://images.unsplash.com/photo-1590319643037-71f1e4c045e5?w=1200&q=85&fm=webp&fit=crop" },

    # Nile Cruises (10-12)
    @{ name = "nile-cruise-ship-sunset.webp"; url = "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "felucca-sailing-nile-aswan.webp"; url = "https://images.unsplash.com/photo-1585811922760-4865de388c30?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "nile-river-aerial-view-luxor.webp"; url = "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=85&fm=webp&fit=crop" },

    # Red Sea & Beach (13-15)
    @{ name = "red-sea-coral-reef-diving.webp"; url = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "hurghada-beach-resort-red-sea.webp"; url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "sharm-el-sheikh-underwater.webp"; url = "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=1200&q=85&fm=webp&fit=crop" },

    # Desert Adventures (16-18)
    @{ name = "white-desert-chalk-formations.webp"; url = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "sahara-camel-caravan-sunset.webp"; url = "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "siwa-oasis-palm-trees.webp"; url = "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85&fm=webp&fit=crop" },

    # Alexandria (19-20)
    @{ name = "alexandria-citadel-qaitbay.webp"; url = "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "bibliotheca-alexandrina-modern.webp"; url = "https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=1200&q=85&fm=webp&fit=crop" },

    # Gallery & Lifestyle (21-26)
    @{ name = "khan-el-khalili-bazaar-cairo.webp"; url = "https://images.unsplash.com/photo-1553522991-71439aa53f5e?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "egyptian-cuisine-traditional-food.webp"; url = "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "nubian-village-colorful-aswan.webp"; url = "https://images.unsplash.com/photo-1600693583595-b09db1e06b3c?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "hot-air-balloon-luxor-sunrise.webp"; url = "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "cairo-islamic-quarter-mosque.webp"; url = "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=1200&q=85&fm=webp&fit=crop" },
    @{ name = "philae-temple-island-aswan.webp"; url = "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200&q=85&fm=webp&fit=crop&crop=bottom" },

    # Banners & Extra (27-30)
    @{ name = "egypt-luxury-resort-pool.webp"; url = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=85&fm=webp&fit=crop" },
    @{ name = "red-sea-sunset-panorama.webp"; url = "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1400&q=85&fm=webp&fit=crop" },
    @{ name = "pyramids-night-sound-light.webp"; url = "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1400&q=85&fm=webp&fit=crop&crop=bottom" },
    @{ name = "nile-felucca-golden-hour.webp"; url = "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1400&q=85&fm=webp&fit=crop&crop=center" }
)

$total = $images.Count
$current = 0

foreach ($img in $images) {
    $current++
    $filePath = Join-Path $outputDir $img.name
    Write-Host "[$current/$total] Downloading $($img.name)..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $img.url -OutFile $filePath -UseBasicParsing
        Write-Host "  OK - Saved to $filePath" -ForegroundColor Green
    } catch {
        Write-Host "  FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nDone! Downloaded $total images to $outputDir" -ForegroundColor Yellow
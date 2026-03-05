import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heritageSites from '../data/egypt-sites-global-display.json';
import coastalDestinations from '../data/egypt-coastal-destinations.json';

/**
 * WorldWindGlobe Component
 * Renders a NASA WebWorldWind 3D interactive Earth globe with Egyptian sites.
 * Features animated placemarks with pulsing effects and smooth camera transitions.
 * Displays 50 heritage sites distributed globally + 10 coastal destinations in Egypt.
 */

// CDN URL for the bundled WorldWind UMD build
const WORLDWIND_CDN = 'https://cdn.jsdelivr.net/npm/worldwindjs@1.5.90/build/dist/worldwind.min.js';
const WORLDWIND_BASE = 'https://cdn.jsdelivr.net/npm/worldwindjs@1.5.90/build/dist/';

// Precompute heritage placemark data with animation phase offsets
// Using artificial_latitude and artificial_longitude for global distribution
const heritagePlacemarkData = heritageSites.map((site, index) => ({
  id: `heritage-${index}`,
  name: site.name,
  arabicName: site.arabic_name,
  governorate: site.governorate,
  nearestCity: site.nearest_city,
  latitude: site.artificial_latitude,
  longitude: site.artificial_longitude,
  siteType: site.site_type,
  historicalPeriod: site.historical_period,
  unesco: site.unesco_status === 'Yes',
  description: site.short_description,
  thumbnailUrl: site.thumbnail_image_url,
  pulsePhase: (index / heritageSites.length) * Math.PI * 2,
  isCoastal: false,
}));

// Precompute coastal placemark data with animation phase offsets
// Using actual latitude and longitude for Egypt coastal destinations
const coastalPlacemarkData = coastalDestinations.map((site, index) => ({
  id: `coastal-${index}`,
  name: site.name,
  arabicName: site.arabic_name,
  governorate: site.governorate,
  nearestCity: site.nearest_city,
  latitude: site.latitude,
  longitude: site.longitude,
  siteType: site.site_type,
  historicalPeriod: site.historical_period,
  unesco: site.unesco_status === 'Yes',
  description: site.short_description,
  thumbnailUrl: site.thumbnail_image_url,
  pulsePhase: (index / coastalDestinations.length) * Math.PI * 2,
  isCoastal: true,
}));

// Combined data for all sites
const allPlacemarkData = [...heritagePlacemarkData, ...coastalPlacemarkData];
const totalSites = heritageSites.length + coastalDestinations.length;

const WorldWindGlobe = () => {
  const canvasRef = useRef(null);
  const wwdRef = useRef(null);
  const animFrameRef = useRef(null);
  const placemarkLayerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredSite, setHoveredSite] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  const initGlobe = useCallback(() => {
    try {
      const WorldWind = window.WorldWind;
      if (!WorldWind || !canvasRef.current) {
        setError('WorldWind not available');
        return;
      }

      // Set base URL so WorldWind can find its imagery resources
      WorldWind.configuration.baseUrl = WORLDWIND_BASE;

      // Create the WorldWindow attached to our canvas
      const wwd = new WorldWind.WorldWindow(canvasRef.current);
      wwdRef.current = wwd;

      // Add layers for a rich Earth visualization
      wwd.addLayer(new WorldWind.BMNGOneImageLayer());       // Blue Marble base image
      wwd.addLayer(new WorldWind.BMNGLandsatLayer());        // Higher-res Landsat overlay
      wwd.addLayer(new WorldWind.AtmosphereLayer());         // Atmospheric glow
      wwd.addLayer(new WorldWind.StarFieldLayer());          // Star background

      // Create layer for all site markers
      const placemarkLayer = new WorldWind.RenderableLayer('Egyptian Sites');
      placemarkLayerRef.current = placemarkLayer;

      // Base placemark attributes for heritage sites (red pins)
      const heritageAttributes = new WorldWind.PlacemarkAttributes(null);
      heritageAttributes.imageSource = WorldWind.configuration.baseUrl + 'images/pushpins/plain-red.png';
      heritageAttributes.imageScale = 0.6;
      heritageAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 0.0
      );
      
      // Label attributes for heritage site name display
      heritageAttributes.labelAttributes = new WorldWind.TextAttributes(null);
      heritageAttributes.labelAttributes.color = WorldWind.Color.WHITE;
      heritageAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1.2
      );
      heritageAttributes.labelAttributes.font = new WorldWind.Font(12, 'bold', false, 'sans-serif');
      heritageAttributes.labelAttributes.depthTest = false;
      heritageAttributes.labelAttributes.enableOutline = true;
      heritageAttributes.labelAttributes.outlineColor = WorldWind.Color.BLACK;
      heritageAttributes.labelAttributes.outlineWidth = 3;

      // Highlight attributes for heritage hover/selection
      const heritageHighlightAttributes = new WorldWind.PlacemarkAttributes(heritageAttributes);
      heritageHighlightAttributes.imageScale = 1.0;
      heritageHighlightAttributes.labelAttributes = new WorldWind.TextAttributes(heritageAttributes.labelAttributes);
      heritageHighlightAttributes.labelAttributes.color = new WorldWind.Color(1, 0.8, 0.2, 1); // Gold color on hover
      heritageHighlightAttributes.labelAttributes.font = new WorldWind.Font(14, 'bold', false, 'sans-serif');

      // Base placemark attributes for coastal destinations (blue pins)
      const coastalAttributes = new WorldWind.PlacemarkAttributes(null);
      coastalAttributes.imageSource = WorldWind.configuration.baseUrl + 'images/pushpins/plain-blue.png';
      coastalAttributes.imageScale = 0.7;
      coastalAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 0.0
      );
      
      // Label attributes for coastal site name display
      coastalAttributes.labelAttributes = new WorldWind.TextAttributes(null);
      coastalAttributes.labelAttributes.color = new WorldWind.Color(0.6, 0.9, 1, 1); // Light blue
      coastalAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1.2
      );
      coastalAttributes.labelAttributes.font = new WorldWind.Font(12, 'bold', false, 'sans-serif');
      coastalAttributes.labelAttributes.depthTest = false;
      coastalAttributes.labelAttributes.enableOutline = true;
      coastalAttributes.labelAttributes.outlineColor = WorldWind.Color.BLACK;
      coastalAttributes.labelAttributes.outlineWidth = 3;

      // Highlight attributes for coastal hover/selection
      const coastalHighlightAttributes = new WorldWind.PlacemarkAttributes(coastalAttributes);
      coastalHighlightAttributes.imageScale = 1.1;
      coastalHighlightAttributes.labelAttributes = new WorldWind.TextAttributes(coastalAttributes.labelAttributes);
      coastalHighlightAttributes.labelAttributes.color = new WorldWind.Color(0, 1, 1, 1); // Cyan on hover
      coastalHighlightAttributes.labelAttributes.font = new WorldWind.Font(14, 'bold', false, 'sans-serif');

      // Add all sites as placemarks with labels
      allPlacemarkData.forEach((site) => {
        const altitude = site.isCoastal ? 5e4 : 8e4; // 50km for coastal, 80km for heritage
        const position = new WorldWind.Position(site.latitude, site.longitude, altitude);
        const attributes = site.isCoastal ? coastalAttributes : heritageAttributes;
        const highlightAttrs = site.isCoastal ? coastalHighlightAttributes : heritageHighlightAttributes;
        
        const placemark = new WorldWind.Placemark(position, true, attributes);
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        placemark.highlightAttributes = highlightAttrs;
        placemark.alwaysOnTop = true;
        
        // Set the label text to show site name
        placemark.label = site.name;

        // Store site data for interaction
        placemark.userProperties = {
          ...site,
          baseScale: site.isCoastal ? 0.7 : (site.unesco ? 0.7 : 0.5),
        };

        placemarkLayer.addRenderable(placemark);
      });

      wwd.addLayer(placemarkLayer);

      // Position camera over Egypt
      wwd.navigator.lookAtLocation.latitude = 26.8;
      wwd.navigator.lookAtLocation.longitude = 30.8;
      wwd.navigator.range = 3e6; // ~3000 km altitude for Egypt view
      wwd.navigator.tilt = 25;

      wwd.redraw();
      setIsLoaded(true);

      // Animation loop: rotation + pulsing markers
      let lastTime = Date.now();
      const animate = () => {
        if (!wwdRef.current) return;
        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        // Slow rotation (0.8 degrees per second)
        wwd.navigator.lookAtLocation.longitude += dt * 0.8;

        // Pulsing animation for heritage markers
        const layer = placemarkLayerRef.current;
        if (layer && layer.renderables) {
          const t = now / 1000;
          layer.renderables.forEach(pm => {
            if (!pm || !pm.attributes || !pm.userProperties) return;
            const baseScale = pm.userProperties.baseScale || 0.6;
            const pulse = 0.15 * Math.sin(t * 2.5 + pm.userProperties.pulsePhase);
            pm.attributes.imageScale = baseScale + pulse;
          });
        }

        wwd.redraw();
        animFrameRef.current = requestAnimationFrame(animate);
      };

      // Start animation after initial load
      setTimeout(() => {
        animFrameRef.current = requestAnimationFrame(animate);
      }, 2000);

      // Mouse move handler for hover detection
      const handleMouseMove = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const pickList = wwd.pick(wwd.canvasCoordinates(event.clientX, event.clientY));
        
        let foundSite = null;
        if (pickList.objects.length > 0) {
          for (let i = 0; i < pickList.objects.length; i++) {
            const pickedObject = pickList.objects[i];
            if (pickedObject.userObject && pickedObject.userObject.userProperties) {
              foundSite = pickedObject.userObject.userProperties;
              pickedObject.userObject.highlighted = true;
            }
          }
        }

        // Reset highlights
        const placemarkLayer = placemarkLayerRef.current;
        if (placemarkLayer && placemarkLayer.renderables) {
          placemarkLayer.renderables.forEach(pm => {
            if (pm.userProperties !== foundSite) {
              pm.highlighted = false;
            }
          });
        }

        setHoveredSite(foundSite);
      };

      // Click handler for selection
      const handleClick = (event) => {
        const pickList = wwd.pick(wwd.canvasCoordinates(event.clientX, event.clientY));
        
        if (pickList.objects.length > 0) {
          for (let i = 0; i < pickList.objects.length; i++) {
            const pickedObject = pickList.objects[i];
            if (pickedObject.userObject && pickedObject.userObject.userProperties) {
              const site = pickedObject.userObject.userProperties;
              setSelectedSite(site);
              
              // Animate camera to selected site
              const targetLat = site.latitude;
              const targetLng = site.longitude;
              const startLat = wwd.navigator.lookAtLocation.latitude;
              const startLng = wwd.navigator.lookAtLocation.longitude;
              const startRange = wwd.navigator.range;
              const targetRange = 5e5;
              const startTime = Date.now();
              const duration = 1500;

              const animateCamera = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                wwd.navigator.lookAtLocation.latitude = startLat + (targetLat - startLat) * eased;
                wwd.navigator.lookAtLocation.longitude = startLng + (targetLng - startLng) * eased;
                wwd.navigator.range = startRange + (targetRange - startRange) * eased;
                wwd.redraw();

                if (progress < 1) {
                  requestAnimationFrame(animateCamera);
                }
              };

              animateCamera();
              return;
            }
          }
        }
        setSelectedSite(null);
      };

      canvasRef.current.addEventListener('mousemove', handleMouseMove);
      canvasRef.current.addEventListener('click', handleClick);

    } catch (err) {
      console.error('WorldWind initialization error:', err);
      setError(err.message || 'Failed to initialize globe');
    }
  }, []);

  useEffect(() => {
    if (window.WorldWind) {
      initGlobe();
      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        wwdRef.current = null;
      };
    }

    const script = document.createElement('script');
    script.src = WORLDWIND_CDN;
    script.async = true;
    script.onload = () => setTimeout(initGlobe, 100);
    script.onerror = () => {
      const fallback = document.createElement('script');
      fallback.src = 'https://files.worldwind.arc.nasa.gov/artifactory/web/0.9.0/worldwind.min.js';
      fallback.async = true;
      fallback.onload = () => setTimeout(initGlobe, 100);
      fallback.onerror = () => setError('Could not load NASA WorldWind library');
      document.head.appendChild(fallback);
    };
    document.head.appendChild(script);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      wwdRef.current = null;
    };
  }, [initGlobe]);

  return (
    <div className="relative w-full h-full" style={{ background: '#030812' }}>
      {/* Loading State */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ background: '#030812' }}>
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-2xl">🌍</span>
            </div>
            <p className="text-white/70 text-sm tracking-wider mb-2">Loading Globe...</p>
            <p className="text-white/40 text-xs">{totalSites} Egyptian Sites ({heritageSites.length} Heritage + {coastalDestinations.length} Coastal)</p>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-[2]"
          style={{ background: 'radial-gradient(ellipse at center, #0a1628 0%, #030812 70%)' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="text-7xl inline-block opacity-30"
          >
            🌍
          </motion.div>
        </div>
      )}

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        style={{ width: '100%', height: '100%' }}
      >
        Your browser does not support HTML5 Canvas.
      </canvas>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredSite && !selectedSite && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 z-10 max-w-xs"
          >
            <p className="text-white font-semibold text-sm">{hoveredSite.name}</p>
            <p className="text-white/60 text-xs">{hoveredSite.arabicName}</p>
            <p className="text-primary-400 text-xs mt-1">
              {hoveredSite.siteType} • {hoveredSite.governorate}
              {hoveredSite.isCoastal && <span className="ml-2 text-cyan-400">🏖️ Coastal</span>}
            </p>
            {hoveredSite.unesco && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded">
                UNESCO World Heritage
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Site Panel */}
      <AnimatePresence>
        {selectedSite && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 bg-black/90 backdrop-blur-md rounded-xl p-4 z-10 max-w-sm"
          >
            <button
              onClick={() => setSelectedSite(null)}
              className="absolute top-2 right-2 text-white/50 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-white font-bold text-lg pr-6">{selectedSite.name}</h3>
            <p className="text-white/60 text-sm mb-2">{selectedSite.arabicName}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded">
                {selectedSite.siteType}
              </span>
              <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded">
                {selectedSite.historicalPeriod}
              </span>
              {selectedSite.unesco && (
                <span className="px-2 py-1 bg-primary-500/30 text-primary-400 text-xs rounded">
                  UNESCO
                </span>
              )}
            </div>
            <p className="text-white/70 text-sm mb-2">{selectedSite.description}</p>
            <p className="text-white/50 text-xs">
              📍 {selectedSite.nearestCity}, {selectedSite.governorate}
            </p>
            <p className="text-white/40 text-xs mt-1">
              {selectedSite.latitude.toFixed(4)}°, {selectedSite.longitude.toFixed(4)}°
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sites Counter */}
      {isLoaded && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 z-10">
          <p className="text-white/80 text-xs">
            <span className="text-primary-400 font-bold">{heritageSites.length}</span> Heritage Sites
            <span className="mx-2">•</span>
            <span className="text-cyan-400 font-bold">{coastalDestinations.length}</span> Coastal Destinations
          </p>
        </div>
      )}
    </div>
  );
};

export default WorldWindGlobe;
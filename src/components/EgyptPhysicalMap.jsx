import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMap, Polyline, useMapEvents, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import egyptLocationsData from '../data/egyptLocations.json';
import 'leaflet/dist/leaflet.css';

// Egypt bounds for the physical map overlay (Mercator projection) - Extended for full coverage
const EGYPT_BOUNDS = [
  [21.5, 24.5],  // Southwest corner [lat, lng]
  [32.0, 37.0]   // Northeast corner [lat, lng]
];

const MAP_CENTER = [26.5, 30.5];
const DEFAULT_ZOOM = 6;

// Category colors - distinct colors as specified
const CATEGORY_COLORS = {
  ancient: '#FFD700',   // Yellow - Historical/Ancient sites
  museum: '#8B4513',    // Brown - Museums & Cultural
  modern: '#2563EB',    // Blue - Tourist attractions
  beach: '#06B6D4',     // Turquoise - Beaches & Resorts
  nature: '#16A34A'     // Green - Nature & Desert
};

const CATEGORY_ICONS = {
  ancient: '🏛️',
  museum: '🏺',
  modern: '🌆',
  beach: '🏖️',
  nature: '🌿'
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Format distance for display
const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
};

// Create custom marker icons based on category with cleaner design
const createCategoryIcon = (category, isActive = false, name = '') => {
  const color = CATEGORY_COLORS[category] || '#6B7280';
  const icon = CATEGORY_ICONS[category] || '📍';
  const size = isActive ? 32 : 24;

  return L.divIcon({
    className: 'custom-marker-wrapper',
    html: `
      <div class="marker-container ${isActive ? 'active' : ''}">
        <div class="marker-pin" style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3)${isActive ? `, 0 0 12px ${color}` : ''};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="font-size: ${isActive ? '14px' : '11px'};">${icon}</span>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Map controller for cinematic animations (disabled zoom to keep all places visible)
const MapController = ({ selectedPlace, onMapClick }) => {
  const map = useMap();

  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    }
  });

  // Keep all places visible - no zoom on selection
  return null;
};

// Distance lines component
const DistanceLines = ({ selectedPlace, locations, hoveredPlace }) => {
  if (!selectedPlace) return null;

  const lines = locations
    .filter(loc => loc.id !== selectedPlace.id)
    .slice(0, 5) // Show lines to 5 nearest places
    .sort((a, b) => {
      const distA = calculateDistance(
        selectedPlace.coordinates.lat, selectedPlace.coordinates.lng,
        a.coordinates.lat, a.coordinates.lng
      );
      const distB = calculateDistance(
        selectedPlace.coordinates.lat, selectedPlace.coordinates.lng,
        b.coordinates.lat, b.coordinates.lng
      );
      return distA - distB;
    });

  return (
    <>
      {lines.map(loc => {
        const distance = calculateDistance(
          selectedPlace.coordinates.lat, selectedPlace.coordinates.lng,
          loc.coordinates.lat, loc.coordinates.lng
        );
        const isHovered = hoveredPlace?.id === loc.id;
        
        return (
          <Polyline
            key={loc.id}
            positions={[
              [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
              [loc.coordinates.lat, loc.coordinates.lng]
            ]}
            pathOptions={{
              color: isHovered ? '#D4AF37' : '#ffffff',
              weight: isHovered ? 3 : 2,
              opacity: isHovered ? 0.9 : 0.5,
              dashArray: '10, 10'
            }}
          />
        );
      })}
    </>
  );
};

// Detailed popup component
const DetailedPopup = ({ place, categories, allLocations, onClose, onNavigate }) => {
  const category = categories.find(c => c.id === place.category);
  
  // Find nearby places (within 100km)
  const nearbyPlaces = useMemo(() => {
    return allLocations
      .filter(loc => loc.id !== place.id)
      .map(loc => ({
        ...loc,
        distance: calculateDistance(
          place.coordinates.lat, place.coordinates.lng,
          loc.coordinates.lat, loc.coordinates.lng
        )
      }))
      .filter(loc => loc.distance < 100)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [place, allLocations]);

  return (
    <div className="detailed-popup">
      {/* Header */}
      <div className="popup-header" style={{ borderColor: category?.color }}>
        <div className="popup-category" style={{ background: category?.color }}>
          <span className="category-icon">{category?.icon}</span>
          <span className="category-name">{category?.nameEn}</span>
        </div>
        <h3 className="popup-title">{place.nameEn}</h3>
        <p className="popup-title-ar">{place.nameAr}</p>
      </div>

      {/* Image */}
      <div className="popup-image-container">
        <img 
          src={place.image} 
          alt={place.nameEn}
          className="popup-image"
          onError={(e) => { e.target.src = '/Untitled17.png'; }}
        />
        <div className="popup-rating">
          <span className="star">⭐</span>
          <span>{place.rating}</span>
        </div>
      </div>

      {/* Description */}
      <div className="popup-description">
        <p>{place.description}</p>
      </div>

      {/* Highlights */}
      {place.highlights && place.highlights.length > 0 && (
        <div className="popup-highlights">
          <h4>✨ Highlights</h4>
          <div className="highlights-list">
            {place.highlights.map((highlight, idx) => (
              <span key={idx} className="highlight-tag">{highlight}</span>
            ))}
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="popup-info-grid">
        <div className="info-item">
          <span className="info-icon">📅</span>
          <span className="info-label">Best Time</span>
          <span className="info-value">{place.bestTime}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🎫</span>
          <span className="info-label">Entry Fee</span>
          <span className="info-value">{place.entryFee}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">📍</span>
          <span className="info-label">Coordinates</span>
          <span className="info-value">{place.coordinates.lat.toFixed(4)}°N, {place.coordinates.lng.toFixed(4)}°E</span>
        </div>
      </div>

      {/* Nearby Places */}
      {nearbyPlaces.length > 0 && (
        <div className="popup-nearby">
          <h4>🗺️ Nearby Attractions</h4>
          <div className="nearby-list">
            {nearbyPlaces.map(nearby => (
              <button 
                key={nearby.id}
                className="nearby-item"
                onClick={() => onNavigate(nearby)}
              >
                <span className="nearby-icon">
                  {categories.find(c => c.id === nearby.category)?.icon || '📍'}
                </span>
                <span className="nearby-name">{nearby.nameEn}</span>
                <span className="nearby-distance">{formatDistance(nearby.distance)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Side panel for place details
const SidePanel = ({ place, categories, allLocations, onClose, onNavigate }) => {
  if (!place) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="side-panel"
      >
        <button className="close-btn" onClick={onClose}>×</button>
        <DetailedPopup 
          place={place}
          categories={categories}
          allLocations={allLocations}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Distance calculator panel
const DistanceCalculator = ({ locations, selectedPlace }) => {
  const [fromPlace, setFromPlace] = useState(null);
  const [toPlace, setToPlace] = useState(null);

  useEffect(() => {
    if (selectedPlace) {
      setFromPlace(selectedPlace);
    }
  }, [selectedPlace]);

  const distance = useMemo(() => {
    if (fromPlace && toPlace) {
      return calculateDistance(
        fromPlace.coordinates.lat, fromPlace.coordinates.lng,
        toPlace.coordinates.lat, toPlace.coordinates.lng
      );
    }
    return null;
  }, [fromPlace, toPlace]);

  return (
    <div className="distance-calculator">
      <h4>📏 Distance Calculator</h4>
      <div className="calculator-inputs">
        <select 
          value={fromPlace?.id || ''} 
          onChange={(e) => setFromPlace(locations.find(l => l.id === e.target.value))}
        >
          <option value="">From...</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.nameEn}</option>
          ))}
        </select>
        <span className="arrow">→</span>
        <select 
          value={toPlace?.id || ''} 
          onChange={(e) => setToPlace(locations.find(l => l.id === e.target.value))}
        >
          <option value="">To...</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.nameEn}</option>
          ))}
        </select>
      </div>
      {distance !== null && (
        <motion.div 
          className="distance-result"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="distance-value">{formatDistance(distance)}</span>
          <span className="distance-label">approx. {Math.round(distance / 60)} hr drive</span>
        </motion.div>
      )}
    </div>
  );
};

// Category filter with updated colors
const CategoryFilter = ({ categories, activeCategories, onToggle }) => {
  return (
    <div className="category-filter">
      <h4>🏷️ Filter by Category</h4>
      <div className="filter-buttons">
        {categories.map(cat => {
          const color = CATEGORY_COLORS[cat.id] || cat.color;
          return (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategories.includes(cat.id) ? 'active' : ''}`}
              style={{
                '--cat-color': color,
                borderColor: activeCategories.includes(cat.id) ? color : 'transparent',
                background: activeCategories.includes(cat.id) ? `${color}22` : 'transparent'
              }}
              onClick={() => onToggle(cat.id)}
            >
              <span className="filter-color-dot" style={{ background: color }}></span>
              <span>{CATEGORY_ICONS[cat.id] || cat.icon}</span>
              <span>{cat.nameEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Main Map Component
const EgyptPhysicalMap = () => {
  const { locations, categories } = egyptLocationsData;
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [activeCategories, setActiveCategories] = useState(categories.map(c => c.id));
  const [showDistanceCalc, setShowDistanceCalc] = useState(false);
  const mapRef = useRef(null);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => activeCategories.includes(loc.category));
  }, [locations, activeCategories]);

  const handleCategoryToggle = (categoryId) => {
    setActiveCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
  };

  const handleNavigate = (place) => {
    setSelectedPlace(place);
  };

  const handleMapClick = () => {
    // Optional: close panel on map click
  };

  return (
    <section className="egypt-map-section">
      {/* Map Container - Full Section Size (takes all space) */}
      <div className="map-wrapper">
        {/* Floating Header */}
        <div className="map-header">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="map-title"
          >
            🌊 Explore Egypt's Wonders
          </motion.h2>
        </div>

        {/* Floating Controls */}
        <div className="map-controls">
          <CategoryFilter
            categories={categories}
            activeCategories={activeCategories}
            onToggle={handleCategoryToggle}
          />
          <button
            className={`calc-toggle ${showDistanceCalc ? 'active' : ''}`}
            onClick={() => setShowDistanceCalc(!showDistanceCalc)}
          >
            📏 Calculator
          </button>
        </div>

        {/* Floating Distance Calculator */}
        <AnimatePresence>
          {showDistanceCalc && (
            <motion.div
              className="distance-calc-wrapper"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DistanceCalculator
                locations={locations}
                selectedPlace={selectedPlace}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <MapContainer
          center={MAP_CENTER}
          zoom={DEFAULT_ZOOM}
          minZoom={5}
          maxZoom={12}
          maxBounds={[[20, 22], [34, 39]]}
          maxBoundsViscosity={1.0}
          ref={mapRef}
          className="leaflet-map"
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          tap={true}
        >
          {/* Physical Map Image Overlay */}
          <ImageOverlay
            url="/eg-physical-map-egypt-mercator-14.jpg"
            bounds={EGYPT_BOUNDS}
            opacity={1}
            zIndex={1}
          />

          {/* Map Controller for animations */}
          <MapController
            selectedPlace={selectedPlace}
            onMapClick={handleMapClick}
          />

          {/* Distance Lines */}
          <DistanceLines
            selectedPlace={selectedPlace}
            locations={filteredLocations}
            hoveredPlace={hoveredPlace}
          />

          {/* Location Markers with Labels */}
          {filteredLocations.map(place => (
            <Marker
              key={place.id}
              position={[place.coordinates.lat, place.coordinates.lng]}
              icon={createCategoryIcon(place.category, selectedPlace?.id === place.id, place.nameEn)}
              eventHandlers={{
                click: () => handlePlaceClick(place),
                mouseover: () => setHoveredPlace(place),
                mouseout: () => setHoveredPlace(null)
              }}
            >
              {/* Permanent Label */}
              <Tooltip
                permanent
                direction="bottom"
                offset={[0, 8]}
                className="location-label"
              >
                <span className="label-text" style={{
                  color: CATEGORY_COLORS[place.category],
                  textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white'
                }}>
                  {place.nameEn}
                </span>
              </Tooltip>
              <Popup className="leaflet-popup-custom">
                <div className="quick-popup">
                  <h4>{place.nameEn}</h4>
                  <p className="arabic-name">{place.nameAr}</p>
                  <div className="quick-info">
                    <span>⭐ {place.rating}</span>
                    <span>📅 {place.bestTime}</span>
                  </div>
                  <button
                    className="view-details-btn"
                    onClick={() => handlePlaceClick(place)}
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Side Panel */}
        <SidePanel
          place={selectedPlace}
          categories={categories}
          allLocations={locations}
          onClose={() => setSelectedPlace(null)}
          onNavigate={handleNavigate}
        />

        {/* Legend with updated colors */}
        <div className="map-legend">
          <h4>Legend</h4>
          {categories.map(cat => (
            <div key={cat.id} className="legend-item">
              <span className="legend-icon" style={{ background: CATEGORY_COLORS[cat.id] || cat.color }}>
                {CATEGORY_ICONS[cat.id] || cat.icon}
              </span>
              <span className="legend-label">{cat.nameEn}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="map-stats">
          <div className="stat">
            <span className="stat-value">{filteredLocations.length}</span>
            <span className="stat-label">Places</span>
          </div>
          <div className="stat">
            <span className="stat-value">{categories.length}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        .egypt-map-section {
          position: relative;
          width: 100%;
          max-width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #f5e9d1;
          box-sizing: border-box;
        }

        .map-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          height: 90%;
          z-index: 1;
          border-radius: 12px;
          overflow: hidden;
          pointer-events: auto;
        }

        .leaflet-map {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #f5e9d1;
          border: none;
          border-radius: 0;
        }

        .leaflet-container {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0;
        }

        .map-header {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          text-align: center;
          pointer-events: none;
        }

        .map-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          margin: 0;
          padding: 0.5rem 1rem;
          background: rgba(30, 58, 95, 0.9);
          backdrop-filter: blur(8px);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .map-controls {
          position: absolute;
          top: 3.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          align-items: flex-start;
          max-width: calc(100% - 2rem);
        }

        .category-filter {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(30, 58, 95, 0.3);
        }

        .category-filter h4 {
          font-size: 0.625rem;
          color: #1e3a5f;
          margin-bottom: 0.375rem;
          text-transform: uppercase;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.25rem 0.5rem;
          border: 2px solid transparent;
          border-radius: 4px;
          background: #e0f2fe;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.625rem;
        }

        .filter-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);
        }

        .filter-btn.active {
          background: var(--cat-color, #06b6d4)22;
          border-color: var(--cat-color, #06b6d4);
        }

        .filter-color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .calc-toggle {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(30, 58, 95, 0.3);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: #1e3a5f;
          font-size: 0.75rem;
        }

        .calc-toggle.active {
          background: #e0f2fe;
          border-color: #1e3a5f;
          color: #1e3a5f;
        }

        .distance-calc-wrapper {
          position: absolute;
          top: 6.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          width: 90%;
          max-width: 500px;
        }

        .distance-calculator {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(30, 58, 95, 0.3);
        }

        .distance-calculator h4 {
          margin-bottom: 0.75rem;
          color: #1e3a5f;
          font-size: 0.875rem;
        }

        .calculator-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .calculator-inputs select {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #c7d2fe;
          border-radius: 6px;
          font-size: 0.75rem;
          background: white;
        }

        .calculator-inputs .arrow {
          font-size: 1rem;
          color: #1e3a5f;
        }

        .distance-result {
          text-align: center;
          padding: 0.75rem;
          background: linear-gradient(135deg, #e0f2fe, #c7d2fe);
          border-radius: 6px;
        }

        .distance-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e3a5f;
        }

        .distance-label {
          font-size: 0.75rem;
          color: #1a3250;
        }

        .custom-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }

        .marker-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .marker-container.active .marker-pin {
          animation: markerPulse 1.5s infinite;
        }

        @keyframes markerPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* Location Labels */
        .location-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          white-space: nowrap;
        }

        .location-label::before {
          display: none !important;
        }

        .label-text {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.02em;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          text-align: center;
        }

        .leaflet-tooltip-bottom {
          margin-top: 2px !important;
        }

        .side-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 380px;
          max-width: 90vw;
          height: 100%;
          background: white;
          z-index: 1000;
          overflow-y: auto;
          box-shadow: 4px 0 20px rgba(0,0,0,0.15);
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          border: none;
          background: #f5f5f4;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e7e5e4;
          transform: scale(1.1);
        }

        .detailed-popup {
          padding: 1rem;
        }

        .popup-header {
          border-left: 4px solid;
          padding-left: 1rem;
          margin-bottom: 1rem;
        }

        .popup-category {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          color: white;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .popup-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1c1917;
          margin: 0;
        }

        .popup-title-ar {
          font-size: 1.125rem;
          color: #78716c;
          font-family: 'Cairo', 'Noto Sans Arabic', sans-serif;
          margin: 0.25rem 0 0;
        }

        .popup-image-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .popup-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .popup-rating {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .popup-description {
          color: #57534e;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .popup-highlights h4 {
          font-size: 0.875rem;
          color: #44403c;
          margin-bottom: 0.5rem;
        }

        .highlights-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-bottom: 1rem;
        }

        .highlight-tag {
          background: #fef3c7;
          color: #92400e;
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
          font-size: 0.75rem;
        }

        .popup-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .info-item {
          background: #f5f5f4;
          padding: 0.75rem;
          border-radius: 8px;
        }

        .info-icon {
          display: block;
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .info-label {
          display: block;
          font-size: 0.625rem;
          color: #78716c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1c1917;
        }

        .popup-nearby h4 {
          font-size: 0.875rem;
          color: #44403c;
          margin-bottom: 0.75rem;
        }

        .nearby-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nearby-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #fafaf9;
          border: 1px solid #e7e5e4;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
        }

        .nearby-item:hover {
          background: #f5f5f4;
          border-color: #d6d3d1;
          transform: translateX(4px);
        }

        .nearby-icon {
          font-size: 1.25rem;
        }

        .nearby-name {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 500;
          color: #1c1917;
        }

        .nearby-distance {
          font-size: 0.75rem;
          color: #d97706;
          font-weight: 600;
        }

        .map-legend {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 0.5rem 0.625rem;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(30, 58, 95, 0.3);
          z-index: 1000;
          max-width: 150px;
        }

        .map-legend h4 {
          font-size: 0.5rem;
          color: #1e3a5f;
          margin-bottom: 0.375rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .legend-item:last-child {
          margin-bottom: 0;
        }

        .legend-icon {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.5rem;
          flex-shrink: 0;
        }

        .legend-label {
          font-size: 0.5rem;
          color: #374151;
          font-weight: 500;
        }

        .map-stats {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          display: flex;
          gap: 0.375rem;
          z-index: 1000;
        }

        .stat {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 0.375rem 0.5rem;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(30, 58, 95, 0.3);
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: #1e3a5f;
        }

        .stat-label {
          font-size: 0.5rem;
          color: #1e3a5f;
          text-transform: uppercase;
        }

        .quick-popup {
          padding: 0.5rem;
          min-width: 180px;
        }

        .quick-popup h4 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
          color: #1c1917;
        }

        .quick-popup .arabic-name {
          font-size: 0.875rem;
          color: #78716c;
          margin: 0 0 0.5rem;
          font-family: 'Cairo', 'Noto Sans Arabic', sans-serif;
        }

        .quick-info {
          display: flex;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: #57534e;
          margin-bottom: 0.75rem;
        }

        .view-details-btn {
          width: 100%;
          padding: 0.5rem;
          background: linear-gradient(135deg, #1e3a5f, #152a43);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .view-details-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(30, 58, 95, 0.4);
        }

        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .leaflet-popup-tip {
          background: white;
        }

        /* Hide labels on lower zoom levels */
        .leaflet-zoom-animated .location-label {
          transition: opacity 0.2s;
        }

        @media (max-width: 768px) {
          .egypt-map-section {
            width: 100%;
            max-width: 100vw;
            height: 100vh;
            overflow-x: hidden;
          }

          .map-wrapper {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 94%;
            height: 90%;
            border-radius: 12px;
            pointer-events: auto;
          }

          /* Enable touch interactions on mobile */
          .leaflet-container {
            touch-action: manipulation;
          }

          .leaflet-marker-icon {
            pointer-events: auto !important;
            cursor: pointer !important;
          }

          /* Make popups more touch-friendly */
          .leaflet-popup-content-wrapper {
            min-width: 200px;
            max-width: 280px;
          }

          .quick-popup {
            padding: 0.75rem;
          }

          .view-details-btn {
            padding: 0.75rem;
            font-size: 1rem;
            min-height: 44px;
          }

          .map-title {
            font-size: 1rem;
            padding: 0.375rem 0.75rem;
          }

          .map-header {
            top: 0.375rem;
          }

          .map-controls {
            top: 2.5rem;
          }

          .distance-calc-wrapper {
            top: 5rem;
          }

          .side-panel {
            width: 100%;
            max-width: 100%;
          }

          .map-legend {
            right: 0.375rem;
            bottom: 0.375rem;
            padding: 0.375rem 0.5rem;
            max-width: 120px;
          }

          .map-stats {
            left: 0.375rem;
            bottom: 0.375rem;
          }

          .stat {
            padding: 0.25rem 0.375rem;
          }

          .stat-value {
            font-size: 0.875rem;
          }

          .calculator-inputs {
            flex-direction: column;
            gap: 0.375rem;
          }

          .calculator-inputs select {
            width: 100%;
          }

          .calculator-inputs .arrow {
            transform: rotate(90deg);
          }

          .label-text {
            font-size: 7px;
            max-width: 55px;
          }

          .filter-btn {
            padding: 0.2rem 0.375rem;
            font-size: 0.5rem;
          }

          .filter-color-dot {
            width: 6px;
            height: 6px;
          }

          .category-filter {
            padding: 0.375rem 0.5rem;
          }

          .category-filter h4 {
            font-size: 0.5rem;
            margin-bottom: 0.25rem;
          }

          .calc-toggle {
            padding: 0.375rem 0.5rem;
            font-size: 0.625rem;
          }
        }
      `}</style>
    </section>
  );
};

export default EgyptPhysicalMap;
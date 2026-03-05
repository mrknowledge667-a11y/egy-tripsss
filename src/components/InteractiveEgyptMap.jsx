import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import egyptLocationsData from '../data/egyptLocations.json';

const MAP_WIDTH = 900;
const MAP_HEIGHT = 750;

// Calculate min/max lat/lng for normalization (Egypt's bounding box)
const BOUNDS = {
  minLat: 22.0,
  maxLat: 31.7,
  minLng: 24.7,
  maxLng: 36.9,
};

// Utility: Convert lat/lng to SVG x/y for Egypt's bounding box
function latLngToXY(lat, lng) {
  // Invert y axis (SVG y=0 is top, lat increases south-to-north)
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * MAP_WIDTH;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * MAP_HEIGHT;
  return { x, y };
}

const AnimatedMarker = ({ x, y, icon, color, onHover, onLeave, isActive }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.22 }}
    transition={{ duration: 0.5, type: 'spring' }}
    style={{ cursor: 'pointer' }}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    tabIndex={0}
    aria-label="Place marker"
  >
    {/* Pulse effect */}
    <motion.circle
      cx={x}
      cy={y}
      r={isActive ? 14 : 10}
      fill={color}
      opacity={0.2}
      animate={{
        scale: isActive ? [1, 1.3, 1] : [1, 1.15, 1],
        opacity: isActive ? [0.15, 0.5, 0.15] : [0.12, 0.3, 0.12],
      }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Main marker */}
    <circle
      cx={x}
      cy={y}
      r={isActive ? 8 : 6.5}
      fill={color}
      stroke="#fff"
      strokeWidth="2"
      filter="url(#markerShadow)"
    />
    {/* Emoji icon */}
    <text
      x={x}
      y={y + 2}
      textAnchor="middle"
      fontSize={isActive ? "15" : "13"}
      style={{ pointerEvents: 'none' }}
      alignmentBaseline="middle"
    >
      {icon}
    </text>
  </motion.g>
);

const PlacePopup = ({ place, x, y, categories, onClose }) => {
  const category = categories.find(c => c.id === place.category);
  return (
    <foreignObject
      x={x + 12}
      y={y - 10}
      width="260"
      height="135"
      style={{ pointerEvents: 'none' }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          className="absolute z-10"
        >
          <div className="rounded-xl shadow-2xl border border-amber-200 bg-white/95 p-3 w-64">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg" style={{ color: category?.color }}>{category?.icon}</span>
              <span className="font-bold text-gray-700">{place.nameEn}</span>
            </div>
            <div className="text-xs text-amber-600 mb-2 font-arabic">{place.nameAr}</div>
            <img
              src={place.image}
              alt={place.nameEn}
              className="rounded-md w-full h-20 object-cover mb-2"
              style={{ background: '#f8f5ef' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="text-xs text-gray-600 mb-2 line-clamp-2">{place.description}</div>
            <div className="flex gap-2 flex-wrap text-xs mb-2">
              {(place.highlights || []).slice(0, 2).map((h, i) => (
                <span key={i} className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{h}</span>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>⭐ {place.rating}</span>
              <span>{place.bestTime}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </foreignObject>
  );
};

const InteractiveEgyptMap = () => {
  const [hovered, setHovered] = useState(null);
  const { locations, categories } = egyptLocationsData;

  // Map colors for categories
  const catColor = c => {
    switch (c) {
      case 'ancient': return '#D4AF37';
      case 'museum': return '#8B4513';
      case 'modern': return '#4169E1';
      case 'beach': return '#00CED1';
      case 'nature': return '#DAA520';
      default: return '#B0B0B0';
    }
  };
  const catIcon = c => {
    switch (c) {
      case 'ancient': return '🏺';
      case 'museum': return '🏛️';
      case 'modern': return '🌆';
      case 'beach': return '🏖️';
      case 'nature': return '🏜️';
      default: return '📍';
    }
  };

  // SVG Egypt outline (simple, not detailed)
  const egyptOutline = `M 80,690 L 80,90 Q 450,50 850,90 L 850,690 Q 450,730 80,690 Z`;

  return (
    <section className="py-14 bg-gradient-to-b from-[#fffbe7] to-white min-h-[820px]">
      <div className="max-w-5xl mx-auto px-2 flex flex-col items-center">
        <motion.h2
          className="text-4xl md:text-5xl font-black text-center text-amber-700 tracking-tight mb-3"
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Egypt's Wonders at a Glance
        </motion.h2>
        <p className="text-gray-600 text-center max-w-2xl mb-8">
          Move your mouse over any point for info about ancient and tourism places. All markers are real locations, grouped by type. Minimal, clean, and animated.
        </p>
        <div className="relative w-full flex justify-center">
          <svg
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            style={{ background: 'none', width: '100%', maxWidth: '900px', height: 'auto', aspectRatio: '6/5' }}
            tabIndex={0}
          >
            {/* Subtle Egypt shape outline */}
            <motion.path
              d={egyptOutline}
              fill="#fff9ec"
              stroke="#eab308"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, ease: 'easeInOut' }}
              filter="url(#outlineShadow)"
            />
            {/* SVG filter for marker drop shadow */}
            <defs>
              <filter id="markerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#444" floodOpacity="0.12" />
              </filter>
              <filter id="outlineShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#eab308" floodOpacity="0.28" />
              </filter>
            </defs>
            {/* All place markers */}
            {locations.map(place => {
              const { x, y } = latLngToXY(place.coordinates.lat, place.coordinates.lng);
              return (
                <React.Fragment key={place.id}>
                  <AnimatedMarker
                    x={x}
                    y={y}
                    icon={catIcon(place.category)}
                    color={catColor(place.category)}
                    onHover={() => setHovered(place.id)}
                    onLeave={() => setHovered(null)}
                    isActive={hovered === place.id}
                  />
                  {/* Popup on hover */}
                  <AnimatePresence>
                    {hovered === place.id && (
                      <PlacePopup
                        place={place}
                        x={x}
                        y={y}
                        categories={categories}
                        onClose={() => setHovered(null)}
                      />
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </svg>
        </div>
        <div className="flex gap-4 mt-8 flex-wrap justify-center">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2 text-sm">
              <span style={{ color: cat.color, fontSize: '1.2em' }}>{cat.icon}</span>
              <span className="text-gray-700">{cat.nameEn}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .font-arabic { font-family: 'Cairo', 'Noto Sans Arabic', sans-serif; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @media (max-width: 700px) {
          svg { max-width: 98vw !important; }
        }
      `}</style>
    </section>
  );
};

export default InteractiveEgyptMap;
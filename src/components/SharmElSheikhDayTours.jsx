import { useState } from 'react';
import sharmTours from '../data/sharmElSheikh.json';

const SharmElSheikhDayTours = () => {
  const [favorites, setFavorites] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-gradient-to-b from-white to-blue-50">
      {/* ── SHARM EL-SHEIKH HIGHLIGHT BANNER ─────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">🏖️ Sharm El-Sheikh Red Sea Paradise</h2>
              <p className="text-blue-100 text-lg">Discover world-class diving, snorkeling, and beach resorts</p>
            </div>
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
              Explore Now
            </button>
          </div>
        </div>
      </div>

      <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🏖️ Coastal Adventures
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sharm El-Sheikh Day Tours
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover world-class diving, pristine beaches, and thrilling water sports in Egypt's premier Red Sea destination
          </p>
        </div>

        {/* Day Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sharmTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              onMouseEnter={() => setHoveredCard(tour.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 hover:opacity-20 transition-opacity duration-300" />

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(tour.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors duration-200 z-10 text-xl"
                >
                  {favorites.includes(tour.id) ? '❤️' : '🤍'}
                </button>

                {/* Duration Badge */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {tour.duration.split('(')[1]?.replace(')', '') || 'Full Day'}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-5 md:p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {tour.name}
                </h3>

                {/* Location */}
                <p className="text-sm text-blue-600 font-semibold mb-2">
                  📍 {tour.location}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {tour.rating} ({tour.reviews} reviews)
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                  {tour.description}
                </p>

                {/* Departure & Return Times */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
                  <p className="text-gray-700"><span className="font-semibold">🕐 Departs:</span> {tour.departureTime}</p>
                  <p className="text-gray-700"><span className="font-semibold">🕑 Returns:</span> {tour.returnTime}</p>
                </div>

                {/* Includes */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">✓ Includes:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {tour.includes.slice(0, 3).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                    {tour.includes.length > 3 && (
                      <li className="text-blue-600 font-semibold">+ {tour.includes.length - 3} more</li>
                    )}
                  </ul>
                </div>

                {/* Highlights */}
                <div className="mb-4 flex flex-wrap gap-1">
                  {tour.highlights.slice(0, 2).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500">Per Person</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {tour.price}
                    </p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All & Info */}
        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-lg p-6 inline-block">
            <p className="text-gray-700 mb-4">
              ✨ All tours include hotel pickup/drop-off, professional English-speaking guides, and meals as specified
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg">
              View All {sharmTours.length} Day Tours
            </button>
          </div>
        </div>
      </div>
    </section>
    </section>
  );
};

export default SharmElSheikhDayTours;

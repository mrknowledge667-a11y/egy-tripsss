import { useState } from 'react';
import tours from '../data/tours.json';

const ToursGrid = () => {
  const [favorites, setFavorites] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Egypt Tours
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover unforgettable experiences across ancient Egypt, luxurious beaches, and vibrant cities
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
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

                {/* Quick Badge */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {tour.duration.split(' ')[0]}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-5 md:p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {tour.name}
                </h3>

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

                {/* Duration & Description */}
                <p className="text-sm text-gray-500 mb-2 font-medium">
                  📅 {tour.duration}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4 flex-grow">
                  {tour.description}
                </p>

                {/* Highlights */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Highlights:</p>
                  <div className="flex flex-wrap gap-1">
                    {tour.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500">Start from</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {tour.price}
                    </p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg">
            View All Tours ({tours.length})
          </button>
        </div>
      </div>
    </section>
  );
};

export default ToursGrid;

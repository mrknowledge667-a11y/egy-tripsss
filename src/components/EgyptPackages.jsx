import React from "react";

const trips = [
  {
    img: "trip1.jpg",
    name: "6 Days Cairo & Hurghada",
    duration: "6 Days",
    description: "Experience the magic of Cairo and relax on the Red Sea coast in Hurghada. Includes pyramids, museum, and beach activities.",
    price: "$670",
    url: "trip1-url"
  },
  {
    img: "trip2.jpg",
    name: "8 Days Cairo & Nile Cruise",
    duration: "8 Days",
    description: "Discover ancient Egypt from Cairo to Aswan with a Nile cruise. Visit pyramids, temples, and enjoy luxury accommodations.",
    price: "$1,460",
    url: "trip2-url"
  },
  {
    img: "trip3.jpg",
    name: "12 Days Pyramids, Nile & Hurghada",
    duration: "12 Days",
    description: "Sail the Nile, explore tombs and temples, and unwind on Hurghada’s beaches. Perfect for a complete Egyptian adventure.",
    price: "$1,540",
    url: "trip3-url"
  },
  {
    img: "trip4.jpg",
    name: "7 Days Cairo & Nile Cruise",
    duration: "7 Days",
    description: "Visit the pyramids, Saqqara, Memphis, and cruise the Nile between Luxor and Aswan. Enjoy guided tours and authentic experiences.",
    price: "$1,190",
    url: "trip4-url"
  },
  {
    img: "trip5.jpg",
    name: "9 Days Cairo, Alexandria & Nile Cruise",
    duration: "9 Days",
    description: "Explore Cairo, Alexandria, and cruise the Nile. Includes pyramids, museums, and the best sights along the river.",
    price: "$1,410",
    url: "trip5-url"
  },
  {
    img: "trip6.jpg",
    name: "8 Days Cairo, Luxor & Hurghada",
    duration: "8 Days",
    description: "Discover Cairo's wonders, Luxor's ancient sites, and relax in Hurghada. Perfect blend of history and leisure.",
    price: "$1,060",
    url: "trip6-url"
  }
];

const EgyptPackagesGrid = () => (
  <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', backgroundColor: '#f9f9f9' }}>
    <section style={{ padding: '2rem 1rem', width: '100%' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>Egypt Packages</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {trips.map((trip, idx) => (
          <div key={idx} style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '16px',
            textAlign: 'center'
          }}>
            <img src={trip.img} alt={trip.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{trip.name}</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{trip.duration}</p>
            <p style={{ fontSize: '14px', color: '#777', marginBottom: '12px' }}>{trip.description}</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginBottom: '12px' }}>Start From {trip.price}</p>
            <a href={trip.url} style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: '#007bff',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>View Details</a>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default EgyptPackagesGrid;

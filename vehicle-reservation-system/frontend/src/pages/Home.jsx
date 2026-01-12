import React, { useEffect, useState } from 'react';
import { fetchVehicles } from '../lib/firestore';
import VehicleCard from '../components/VehicleCard';
import { useNavigate } from 'react-router-dom';

import { DESTINATIONS } from '../constants/destinations';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await fetchVehicles();
      // Sort by price ascending
      data.sort((a, b) => a.pricePerDay - b.pricePerDay);
      setVehicles(data);
    } catch {
      // Keep UI calm; fleet section already handles loading state.
    } finally {
      setLoading(false);
    }
  };

  const featuredVehicles = vehicles.slice(0, 3);

  // Show only first 3 destinations on home
  const homeDestinations = DESTINATIONS.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="hero-modern">
        <div className="container">
          <div className="hero-content-centered">
            <div className="hero-text-content-center">
              <h1>Explore the Pearl of the Indian Ocean with <span className="highlight">Your Freedom</span></h1>
              <p className="hero-description">Reliable and comfortable rental cars for your unforgettable journey across Sri Lanka. Choose from our premium fleet and experience the island like never before.</p>
              
              <div className="hero-cta-buttons">
                <button className="btn-hero-primary" onClick={() => navigate('/fleet#book-journey')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Check Availability
                </button>
              </div>
              
              <div className="hero-features-horizontal">
                <div className="feature-item-inline">
                  <div className="feature-icon-inline">✓</div>
                  <span>24/7 Support</span>
                </div>
                <div className="feature-item-inline">
                  <div className="feature-icon-inline">✓</div>
                  <span>Island-Wide Service</span>
                </div>
                <div className="feature-item-inline">
                  <div className="feature-icon-inline">✓</div>
                  <span>Flexible Policies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="section fleet-section" id="featured-fleet">
        <div className="container">
          <div className="section-header">
            <h2>Our Premium Fleet</h2>
            <p className="section-subtitle">Choose from our carefully selected range of well-maintained vehicles for your Sri Lankan adventure</p>
          </div>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading vehicles...</p>
            </div>
          ) : (
            <div className="vehicle-grid">
              {featuredVehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features - Why Choose Us */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Paranamanna Travels?</h2>
            <p className="section-subtitle">Experience the difference with our premium service and local expertise</p>
          </div>
          <div className="features-grid-modern">
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h4>Professional Drivers</h4>
              <p>Friendly, licensed drivers who know the local routes and hidden gems of Sri Lanka.</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <h4>Flexible Policies</h4>
              <p>Transparent pricing and flexible pick-up/drop-off options to suit your travel plan.</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <h4>Scenic Routes</h4>
              <p>We help you plan stops at the most Instagram-worthy and memorable locations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section destinations-section" id="destinations">
        <div className="container">
          <div className="section-header">
            <h2>Discover Beautiful Sri Lanka</h2>
            <p className="section-subtitle">Explore breathtaking destinations across the Pearl of the Indian Ocean</p>
          </div>
          <div className="destination-grid-modern">
            {homeDestinations.map(dest => (
              <div 
                key={dest.title} 
                className="destination-card-modern"
                onClick={() => setSelectedDestination(dest)}
              >
                <div className="destination-image-wrapper">
                  <img src={dest.image} alt={dest.title} />
                </div>
                <div className="destination-info">
                  <h5>{dest.title}</h5>
                  <button className="btn-explore">
                    Explore
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{marginTop:'3rem'}}>
            <button className="btn-secondary" onClick={() => navigate('/destinations')}>
              View All Destinations
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft: '0.5rem'}}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Destination Modal */}
      {selectedDestination && (
        <div className="modal-overlay" onClick={() => setSelectedDestination(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setSelectedDestination(null)}>&times;</span>
            <img src={selectedDestination.image} alt={selectedDestination.title} style={{width:'100%', height:'250px', objectFit:'cover', borderRadius:'8px'}} />
            <h3 style={{margin:'1.5rem 0 1rem', color:'var(--primary)'}}>{selectedDestination.title}</h3>
            <p style={{lineHeight: '1.7', color: 'var(--text-light)'}}>{selectedDestination.desc}</p>
            <button className="btn-primary" style={{marginTop:'1.5rem', width: '100%'}} onClick={() => setSelectedDestination(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-container">
            <div className="newsletter-content">
              <div className="newsletter-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="newsletter-text">
                <h3>Get Travel Tips & Exclusive Deals</h3>
                <p>Subscribe to our newsletter for special offers and travel inspiration</p>
              </div>
            </div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}

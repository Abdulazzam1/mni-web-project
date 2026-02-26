import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './BannerSlider.css'; // <-- PENTING: Import file CSS Anda di sini

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil Data dari API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/banner/active');
        setBanners(response.data);
      } catch (error) {
        console.error('Gagal memuat banner:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-play Slider
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  if (isLoading || banners.length === 0) return null;

  return (
    <section className="banner-wrapper banner-aspect">
      
      {/* ─── KONTEN SLIDE GAMBAR ─── */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img
            src={`http://localhost:5001${banner.image_url}`}
            alt={banner.title || 'Promo MNI'}
            className="banner-img"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1920x600?text=Gambar+Promo+Tidak+Ditemukan';
            }}
          />
          <div className="banner-gradient-bottom"></div>
        </div>
      ))}

      {/* ─── KONTROL NAVIGASI (PANAH & TITIK) ─── */}
      {banners.length > 1 && (
        <>
          <button onClick={prevSlide} className="banner-nav-btn banner-btn-left" aria-label="Previous Slide">
            <ChevronLeft size={28} />
          </button>
          
          <button onClick={nextSlide} className="banner-nav-btn banner-btn-right" aria-label="Next Slide">
            <ChevronRight size={28} />
          </button>

          <div className="banner-dots-wrapper">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`banner-dot ${idx === currentSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
import React, { useState, useEffect } from 'react';
import { HomeBanner, Event } from '../../types';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { THEME } from '../styles/designSystem';

interface HeroCarrosselProps {
  banners: HomeBanner[];
  events: Event[];
  onSelectEvent: (eventId: string) => void;
}

export default function HeroCarrossel({ banners, events, onSelectEvent }: HeroCarrosselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeBanners = banners.filter(b => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    return (
      <div className={THEME.heroCarrossel.emptyState}></div>
    );
  }

  const currentBanner = activeBanners[currentIndex];
  const linkedEvent = currentBanner.linkToEventId 
    ? events.find(e => e.id === currentBanner.linkToEventId) 
    : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  return (
    <div className={THEME.heroCarrossel.section}>
      <div 
        onClick={() => {
          if (currentBanner.linkToEventId) {
            onSelectEvent(currentBanner.linkToEventId);
          }
        }}
        className={THEME.heroCarrossel.card}
      >
        
        <div className={THEME.heroCarrossel.mediaWrap}>
          <img 
            src={currentBanner.imageUrl} 
            alt={currentBanner.title} 
            referrerPolicy="no-referrer"
            className={THEME.heroCarrossel.mediaImage}
          />
          
          <div className={THEME.heroCarrossel.mediaOverlay}></div>
        </div>

        
        <div className={THEME.heroCarrossel.contentWrap}>
          
          
          {linkedEvent && (
            <div className={THEME.heroCarrossel.eventMeta}>
              <span className={THEME.heroCarrossel.eventCategory}>
                {linkedEvent.category}
              </span>
              <div className={THEME.heroCarrossel.eventMetaItem}>
                <Calendar className={THEME.heroCarrossel.eventMetaIcon} />
                <span>{linkedEvent.startDate.split('-').reverse().join('/')}</span>
              </div>
              <div className={THEME.heroCarrossel.eventMetaLocation}>
                <MapPin className={THEME.heroCarrossel.eventMetaIcon} />
                <span>{linkedEvent.location}</span>
              </div>
            </div>
          )}

          
          <h1 className={THEME.heroCarrossel.title}>
            {currentBanner.title.split(' ').map((word, idx) => {
              const isHighlight = ['EVENTOS', 'ADMINISTRAÇÃO', 'TECNOLÓGICA', 'INTEGRAÇÃO', 'AQUI'].includes(word.toUpperCase());
              return (
                <span key={idx} className={isHighlight ? THEME.heroCarrossel.titleHighlight : THEME.heroCarrossel.titleDefault}>
                  {word}{' '}
                </span>
              );
            })}
          </h1>

          
          <p className={THEME.heroCarrossel.subtitle}>
            {currentBanner.subtitle}
          </p>

          
          {currentBanner.linkToEventId && (
            <div className={THEME.heroCarrossel.cta}>
              <span>Saiba mais e inscreva-se</span>
              <span className={THEME.heroCarrossel.ctaArrow}>→</span>
            </div>
          )}

        </div>

        
        {activeBanners.length > 1 && (
          <>
            
            <button 
              onClick={handlePrev}
              className={`${THEME.heroCarrossel.navBtn} ${THEME.heroCarrossel.navPrev}`}
              aria-label="Anterior"
            >
              <ChevronLeft className={THEME.heroCarrossel.navIcon} />
            </button>
            
            <button 
              onClick={handleNext}
              className={`${THEME.heroCarrossel.navBtn} ${THEME.heroCarrossel.navNext}`}
              aria-label="Próximo"
            >
              <ChevronRight className={THEME.heroCarrossel.navIcon} />
            </button>
          </>
        )}

        
        {activeBanners.length > 1 && (
          <div className={THEME.heroCarrossel.dotsWrap}>
            {activeBanners.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`${THEME.heroCarrossel.dotBase} ${idx === currentIndex ? THEME.heroCarrossel.dotActive : THEME.heroCarrossel.dotInactive}`}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

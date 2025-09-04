import { Button } from '@/components/ui/button';
import { useFadeInOnScroll } from '@/hooks/useFadeInOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  onReservationClick?: () => void;
}

const HeroSection = ({ onReservationClick }: HeroSectionProps) => {
  const { ref: heroRef, isVisible } = useFadeInOnScroll();
  const { t } = useLanguage();


  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={heroRef}>
      {/* Vidéo de fond */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2 scale-110"
        >
          <source src="https://gcuacylbpxzhabpflruf.supabase.co/storage/v1/object/public/video/showreel.mp4" type="video/mp4" />
        </video>
        {/* Filtre sombre transparent */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Contenu centré */}
      <div className={`relative z-10 text-center text-white px-4 transition-all duration-2000 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
        <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {t('hero.goodbye')} <span className="text-primary">{t('hero.goodbye_word')}</span> {t('hero.to_dirt')}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
          {t('hero.services_list')}
        </p>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-6 py-3 text-base lg:px-8 lg:text-lg font-bold"
            onClick={() => window.open('https://wa.me/message/CJKXPUTDPLG6D1', '_blank')}
          >
            {t('hero.contact_us_btn')}
          </Button>
          <Button 
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 px-6 py-3 text-base lg:px-8 lg:text-lg font-bold"
            onClick={onReservationClick}
          >
            {t('hero.reservation_btn')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
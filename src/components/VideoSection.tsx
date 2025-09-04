import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const VideoSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const { t, language } = useLanguage();

  const getVideos = () => {
    const baseVideos = [
      {
        id: 'jcDVe0c9vlo',
        titleKey: 'video1'
      },
      {
        id: '0tcnLE9sYrM', 
        titleKey: 'video2'
      },
      {
        id: 'TAnVNnrMqfQ',
        titleKey: 'video3'
      },
      {
        id: 's8GtRKmu0UQ',
        titleKey: 'video4'
      }
    ];

    const titles = {
      fr: {
        video1: 'Nettoyage professionnel - Vidéo 1',
        video2: 'Nettoyage professionnel - Vidéo 2',
        video3: 'Nettoyage professionnel - Vidéo 3',
        video4: 'Nettoyage professionnel - Vidéo 4'
      },
      de: {
        video1: 'Professionelle Reinigung - Video 1',
        video2: 'Professionelle Reinigung - Video 2',
        video3: 'Professionelle Reinigung - Video 3',
        video4: 'Professionelle Reinigung - Video 4'
      },
      en: {
        video1: 'Professional Cleaning - Video 1',
        video2: 'Professional Cleaning - Video 2',
        video3: 'Professional Cleaning - Video 3',
        video4: 'Professional Cleaning - Video 4'
      }
    };

    return baseVideos.map(video => ({
      ...video,
      title: titles[language][video.titleKey] || titles.fr[video.titleKey]
    }));
  };

  const videos = getVideos();

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextVideo();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      prevVideo();
    }
  };

  const currentVideo = videos[currentVideoIndex];

  const getQualityText = () => {
    switch(language) {
      case 'de':
        return 'Professionelle Qualität garantiert';
      case 'en':
        return 'Professional quality guaranteed';
      default:
        return 'Qualité professionnelle garantie';
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 whitespace-nowrap sm:whitespace-normal">
            {t('video.title')}
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto line-clamp-2 md:line-clamp-none">
            {t('video.subtitle')}
          </p>
        </div>

        <div className="flex items-center justify-center max-w-4xl mx-auto">
          {/* Conteneur vidéo avec flèches */}
          <div 
            className="relative w-full max-w-sm mx-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] bg-black">
              {/* Vidéo principale */}
              <iframe
                key={`video-${currentVideo.id}`}
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&mute=1&loop=1&playlist=${currentVideo.id}&controls=1&showinfo=1&rel=0&modestbranding=1&fs=1`}
                title={currentVideo.title}
                className="absolute inset-0 w-full h-full rounded-3xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="eager"
              />
              
              {/* Flèches superposées sur la vidéo */}
              {videos.length > 1 && (
                <>
                  {/* Flèche gauche */}
                  <button
                    onClick={prevVideo}
                    className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10 shadow-lg border border-white/20"
                    aria-label={language === 'de' ? 'Vorheriges Video' : language === 'en' ? 'Previous video' : 'Vidéo précédente'}
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  {/* Flèche droite */}
                  <button
                    onClick={nextVideo}
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10 shadow-lg border border-white/20"
                    aria-label={language === 'de' ? 'Nächstes Video' : language === 'en' ? 'Next video' : 'Vidéo suivante'}
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Effet de bordure décorative */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-400 to-primary rounded-3xl opacity-20 blur-lg -z-10 transition-opacity duration-500 hover:opacity-40"></div>
          </div>
        </div>

        {/* Video indicators */}
        {videos.length > 1 && (
          <div className="flex justify-center mt-6 space-x-3">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-150 ${
                  index === currentVideoIndex 
                    ? 'bg-primary scale-125 shadow-lg' 
                    : 'bg-gray-400 hover:bg-gray-600 hover:shadow-md'
                }`}
                aria-label={`${language === 'de' ? 'Gehe zu Video' : language === 'en' ? 'Go to video' : 'Aller à la vidéo'} ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default VideoSection;
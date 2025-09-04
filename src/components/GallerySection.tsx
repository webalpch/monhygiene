import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

const GallerySection = () => {
  const { t, language } = useLanguage();
  const [showAfterById, setShowAfterById] = useState<{ [id: number]: boolean }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Labels traduits selon la langue
  const getGalleryItems = () => {
    const baseItems = [
      {
        id: 1,
        before: '/lovable-uploads/69e7a746-4c0a-4605-9c20-50cc0c9bdb3f.png',
        after: '/lovable-uploads/23080285-1297-41b9-a4f5-37ba7467d360.png',
        labelKey: 'sofa'
      },
      {
        id: 2,
        before: '/lovable-uploads/4c079aa3-a801-47b6-a548-a4e2d4a81b42.png',
        after: '/lovable-uploads/71f074bf-3036-4655-982d-7259cb22ae82.png',
        labelKey: 'mattress'
      },
      {
        id: 3,
        before: '/lovable-uploads/88a9f63b-0856-43ab-add5-d503e192908f.png',
        after: '/lovable-uploads/c384df25-86cf-490b-8eb8-37e20e2a0284.png',
        labelKey: 'roof'
      },
      {
        id: 4,
        before: '/lovable-uploads/c5d7634e-4522-4eac-822d-63790e474f87.png',
        after: '/lovable-uploads/58cdd915-668f-45bf-89d2-7ceeb2a60fa4.png',
        labelKey: 'house'
      },
      {
        id: 5,
        before: '/lovable-uploads/48d9dbe3-79ee-4bd2-8065-f66a1412759d.png',
        after: '/lovable-uploads/5078bbd6-0eb6-45da-a624-130c47da07bb.png',
        labelKey: 'sofa2'
      },
      {
        id: 6,
        before: '/lovable-uploads/22252061-beba-4424-9ec5-d61e0ec7ec03.png',
        after: '/lovable-uploads/bfa1a159-4879-44f9-a097-666135ea0516.png',
        labelKey: 'car'
      },
      {
        id: 7,
        before: '/lovable-uploads/0b73dc7f-bfd2-4d75-81a1-437168403c3d.png',
        after: '/lovable-uploads/4445e057-8cea-4d0f-b060-7eca18f32dd4.png',
        labelKey: 'car2'
      },
      {
        id: 8,
        before: '/lovable-uploads/03e75212-06f3-42a0-ad77-7ab004264606.png',
        after: '/lovable-uploads/3f77a101-59dd-4ef5-a1c0-8e29163aaca9.png',
        labelKey: 'billiard'
      },
      {
        id: 9,
        before: '/lovable-uploads/56fa2352-7849-43d8-94f8-994c7121cecb.png',
        after: '/lovable-uploads/82024edf-801e-4635-8598-d0813c7b3fe3.png',
        labelKey: 'terrace'
      },
      {
        id: 10,
        before: '/lovable-uploads/77015bd1-76dd-4a14-9bc5-56de831161a4.png',
        after: '/lovable-uploads/5caf556a-14e5-4691-a20a-7be9379603dc.png',
        labelKey: 'trunk'
      },
      {
        id: 11,
        before: '/lovable-uploads/260707f6-2db4-4558-8d4d-4cd3f6a008c8.png',
        after: '/lovable-uploads/f0d7f7aa-f6a4-4723-9dd5-c06a57286832.png',
        labelKey: 'mattress2'
      }
    ];

    const labels = {
      fr: {
        sofa: 'Canapé',
        mattress: 'Matelas',
        roof: 'Toiture',
        house: 'Maison',
        sofa2: 'Canapé 2',
        car: 'Voiture',
        car2: 'Voiture 2',
        billiard: 'Billard',
        terrace: 'Terrasse',
        trunk: 'Coffre voiture',
        mattress2: 'Matelas 2'
      },
      de: {
        sofa: 'Sofa',
        mattress: 'Matratze',
        roof: 'Dach',
        house: 'Haus',
        sofa2: 'Sofa 2',
        car: 'Auto',
        car2: 'Auto 2',
        billiard: 'Billard',
        terrace: 'Terrasse',
        trunk: 'Kofferraum',
        mattress2: 'Matratze 2'
      },
      en: {
        sofa: 'Sofa',
        mattress: 'Mattress',
        roof: 'Roof',
        house: 'House',
        sofa2: 'Sofa 2',
        car: 'Car',
        car2: 'Car 2',
        billiard: 'Billiard',
        terrace: 'Terrace',
        trunk: 'Car trunk',
        mattress2: 'Mattress 2'
      }
    };

    return baseItems.map(item => ({
      ...item,
      label: labels[language][item.labelKey] || labels.fr[item.labelKey]
    }));
  };

  const galleryItems = getGalleryItems();

  // Précharger toutes les images avant/après au montage
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = galleryItems.flatMap(item => [
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = item.before;
        }),
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = item.after;
        })
      ]);

      try {
        await Promise.all(imagePromises);
        setImagesPreloaded(true);
      } catch (error) {
        console.warn('Erreur lors du préchargement des images:', error);
        setImagesPreloaded(true);
      }
    };

    preloadImages();
  }, [galleryItems]);

  // Quand on clique sur l'image, on bascule Avant/Après
  const handleToggle = (id: number) => {
    setShowAfterById((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Quand le slide change, réinitialiser le mode à Avant pour cette image
  useEffect(() => {
    if (!carouselApi) return;

    setCurrentIndex(carouselApi.selectedScrollSnap());

    function onSelect() {
      const newIndex = carouselApi.selectedScrollSnap();
      setCurrentIndex(newIndex);
      setShowAfterById((prev) => ({
        ...prev,
        [galleryItems[newIndex].id]: false
      }));
    }

    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, galleryItems]);

  return (
    <section id="gallery" className="section-padding bg-gradient-to-br from-primary/5 to-blue-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            {t('gallery.title')} <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">{t('gallery.before')}/{t('gallery.after')}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{t('gallery.click_image')}</p>
        </div>
        <Carousel
          className="relative w-full max-w-2xl mx-auto px-2"
          opts={{ loop: true }}
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {galleryItems.map((item) => (
              <CarouselItem key={item.id} className="flex flex-col items-center">
                 <div
                   className="relative w-full max-w-[270px] md:max-w-sm h-[405px] md:h-[500px] rounded-3xl overflow-hidden bg-white cursor-pointer transition-all duration-300 mx-auto touch-manipulation"
                  style={{ aspectRatio: '9/20' }}
                  onClick={() => handleToggle(item.id)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleToggle(item.id);
                  }}
                  tabIndex={0}
                  aria-label={`${t('gallery.view_more')} ${showAfterById[item.id] ? t('gallery.before') : t('gallery.after')} ${item.label}`}
                >
                  {/* Images cachées pour le préchargement */}
                  <img
                    src={item.before}
                    alt=""
                    className="absolute opacity-0 pointer-events-none -z-10"
                    style={{ display: 'none' }}
                  />
                  <img
                    src={item.after}
                    alt=""
                    className="absolute opacity-0 pointer-events-none -z-10"
                    style={{ display: 'none' }}
                  />
                  
                  {/* Image visible */}
                  <img
                    key={`${item.id}-${showAfterById[item.id] ? 'after' : 'before'}`}
                    src={showAfterById[item.id] ? item.after : item.before}
                    alt={`${item.label} ${showAfterById[item.id] ? t('gallery.after') : t('gallery.before')}`}
                    className="w-full h-full object-cover transition-all duration-150 select-none rounded-3xl"
                    draggable={false}
                    loading="eager"
                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  />
                  <div className="absolute top-4 left-4">
                    {!showAfterById[item.id] ? (
                      /* Cercle AVANT - noir avec texte blanc */
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AVANT</span>
                      </div>
                    ) : (
                      /* Cercle APRÈS - blanc avec texte noir */
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-black text-xs font-bold">APRÈS</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-white/90 text-primary text-xs rounded-xl px-3 py-1 pointer-events-none">
                    {showAfterById[item.id] ? t('gallery.before') : t('gallery.after')}
                  </div>
                </div>
                <div className="font-semibold text-lg text-primary mt-4">{item.label}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Flèches superposées sur le carousel */}
          <button
            onClick={() => carouselApi?.scrollPrev()}
            className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10 shadow-lg border border-white/20"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={() => carouselApi?.scrollNext()}
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10 shadow-lg border border-white/20"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </Carousel>
      </div>
    </section>
  );
};

export default GallerySection;
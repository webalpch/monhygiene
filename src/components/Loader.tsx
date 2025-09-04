
import { useState, useEffect } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    // Empêcher le scroll et préparer la transition
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Précharger les images critiques et vidéos
    const imagesToPreload = [
      // Images principales
      '/lovable-uploads/fc002718-2637-4c7d-9414-f385a3587d0f.png', // Image de la voiture Hero
      '/lovable-uploads/69417120-680d-4758-83e3-20c0b4733da8.png', // Logo
      
      // Images de la page Index (statistiques)
      '/lovable-uploads/5fa1fb9e-199c-42f2-86b5-b7c475090786.png',
      '/lovable-uploads/945b9427-0d94-4ecc-b9ce-ff85fb371a52.png',
      '/lovable-uploads/017acf0f-6028-45b8-a03e-812c2483675d.png',
      
      // Images de galerie les plus importantes (before/after)
      '/lovable-uploads/69e7a746-4c0a-4605-9c20-50cc0c9bdb3f.png',
      '/lovable-uploads/23080285-1297-41b9-a4f5-37ba7467d360.png',
      '/lovable-uploads/4c079aa3-a801-47b6-a548-a4e2d4a81b42.png',
      '/lovable-uploads/71f074bf-3036-4655-982d-7259cb22ae82.png',
      '/lovable-uploads/88a9f63b-0856-43ab-add5-d503e192908f.png',
      '/lovable-uploads/c384df25-86cf-490b-8eb8-37e20e2a0284.png',
      
      // Images des services détails les plus consultés
      '/lovable-uploads/ee0397e7-2584-40a7-ab20-36870dd4feae.png', // Domicile avant
      '/lovable-uploads/f0d7f7aa-f6a4-4723-9dd5-c06a57286832.png', // Domicile après
      
      // Toutes les autres images de galerie pour éviter le loading pendant navigation
      '/lovable-uploads/03e75212-06f3-42a0-ad77-7ab004264606.png',
      '/lovable-uploads/0b73dc7f-bfd2-4d75-81a1-437168403c3d.png',
      '/lovable-uploads/1d3d6264-bbfb-4595-9b30-3ca93c0c5fd7.png',
      '/lovable-uploads/22252061-beba-4424-9ec5-d61e0ec7ec03.png',
      '/lovable-uploads/260707f6-2db4-4558-8d4d-4cd3f6a008c8.png',
      '/lovable-uploads/3f77a101-59dd-4ef5-a1c0-8e29163aaca9.png',
      '/lovable-uploads/4445e057-8cea-4d0f-b060-7eca18f32dd4.png',
      '/lovable-uploads/44c5fe03-0dcb-4052-a277-84d8bf3c940c.png',
      '/lovable-uploads/48d9dbe3-79ee-4bd2-8065-f66a1412759d.png',
      '/lovable-uploads/5078bbd6-0eb6-45da-a624-130c47da07bb.png',
      '/lovable-uploads/512eab47-361b-47c3-ae78-c4d9471e02fb.png',
      '/lovable-uploads/56fa2352-7849-43d8-94f8-994c7121cecb.png',
      '/lovable-uploads/58cdd915-668f-45bf-89d2-7ceeb2a60fa4.png',
      '/lovable-uploads/5caf556a-14e5-4691-a20a-7be9379603dc.png',
      '/lovable-uploads/722ffef9-5437-4012-8943-74fa7354f12c.png',
      '/lovable-uploads/77015bd1-76dd-4a14-9bc5-56de831161a4.png',
      '/lovable-uploads/7fdc8fcf-c68d-4a1b-9d1e-13d5adf0176e.png',
      '/lovable-uploads/82024edf-801e-4635-8598-d0813c7b3fe3.png',
      '/lovable-uploads/83644970-ea1a-4641-aece-8e119c884d9e.png',
      '/lovable-uploads/a7ddf1ec-b6cb-44c8-a174-1b3a61aeda15.png',
      '/lovable-uploads/ae348970-e7c0-4c34-8912-fb9eee892a41.png',
      '/lovable-uploads/bb7994a2-533e-4310-b09b-1de7b45ceb4a.png',
      '/lovable-uploads/bfa1a159-4879-44f9-a097-666135ea0516.png',
      '/lovable-uploads/c5d7634e-4522-4eac-822d-63790e474f87.png',
      '/lovable-uploads/d1545239-0bcb-4f32-ae0c-aae710f4aeca.png',
      '/lovable-uploads/fc85afb2-50d9-4218-8f7b-774ecb315bbe.png'
    ];

    // Précharger les miniatures vidéo YouTube
    const videoIds = ['jcDVe0c9vlo', '0tcnLE9sYrM', 'TAnVNnrMqfQ', 's8GtRKmu0UQ'];
    const videoThumbnails = videoIds.map(id => `https://img.youtube.com/vi/${id}/hqdefault.jpg`);

    const preloadImages = async () => {
      try {
        // Combiner images et miniatures vidéo
        const allAssets = [...imagesToPreload, ...videoThumbnails];
        
        const promises = allAssets.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = () => {
              console.log(`Erreur de préchargement pour: ${src}`);
              resolve(null); // Continue même si une image fail
            };
            img.src = src;
          });
        });

        await Promise.all(promises);
        console.log('Préchargement terminé:', allAssets.length, 'assets');
        setImagesPreloaded(true);
      } catch (error) {
        console.log('Erreur lors du préchargement, mais on continue');
        setImagesPreloaded(true);
      }
    };

    preloadImages();

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        // Restaurer le scroll de manière fluide
        document.body.style.overflow = 'unset';
        document.body.style.position = 'unset';
        document.body.style.width = 'unset';
        onComplete();
      }, 1000);
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black" style={{ willChange: 'transform' }}>
      {/* Panneau gauche */}
      <div 
        className={`absolute inset-y-0 left-0 w-1/2 bg-black transition-transform duration-1000 ease-in-out ${
          isAnimating ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ willChange: 'transform' }}
      />
      
      {/* Panneau droit */}
      <div 
        className={`absolute inset-y-0 right-0 w-1/2 bg-black transition-transform duration-1000 ease-in-out ${
          isAnimating ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ willChange: 'transform' }}
      />
      
      {/* Logo au centre */}
      <div 
        className={`relative z-10 transition-all duration-700 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{ willChange: 'opacity, transform' }}
      >
        <img 
          src="/lovable-uploads/69417120-680d-4758-83e3-20c0b4733da8.png" 
          alt="MonHygiène" 
          className="w-48 h-48 object-contain animate-pulse-heart"
          loading="eager"
          decoding="sync"
        />
      </div>

      {/* Préchargement invisible des images critiques */}
      <div className="absolute -top-full opacity-0 pointer-events-none">
        <img 
          src="/lovable-uploads/fc002718-2637-4c7d-9414-f385a3587d0f.png" 
          alt="Preload car" 
          loading="eager"
          decoding="sync"
        />
      </div>
    </div>
  );
};

export default Loader;

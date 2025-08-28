import { useLanguage } from '@/contexts/LanguageContext';

const TrustSection = () => {
  const { t } = useLanguage();

  const partners = [
    {
      id: 1,
      name: "État du Valais",
      logo: "/public/clients/valais.png",
      alt: "Logo Canton du Valais"
    },
    {
      id: 2,
      name: "Car Center – Ardon",
      logo: "/public/clients/carcenter.png",
      alt: "Car Center Ardon"
    },
    {
      id: 3,
      name: "Alexprod – Sierre",
      logo: "/public/clients/alexprod.png",
      alt: "Logo Alexprod Sierre"
    },
    {
      id: 4,
      name: "Hadid Hairstyle – Brig",
      logo: "/lovable-uploads/bb7994a2-533e-4310-b09b-1de7b45ceb4a.png",
      alt: "Logo Hadid Hairstyling"
    }
  ];

  // Dupliquer les partenaires pour un défilement continu
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="section-padding bg-gradient-to-r from-white to-blue-50 border-t border-gray-200 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">
          {t('trust.title')}
        </h2>
      </div>
      
      <div className="relative w-full">
        <div className="flex animate-scroll-right">
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`}
              className="flex flex-col items-center justify-center min-w-[200px] mx-8"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain mb-3"
                  draggable={false}
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center mb-3">
                  <span className="text-xs text-gray-400 text-center">
                    {t('trust.logo_coming')}
                  </span>
                </div>
              )}
              <span className="text-sm font-semibold text-gray-700 text-center">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
import { useState, useEffect, useRef } from 'react';
import { Users, Building, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ clients: 0, partners: 0, smiles: 0 });
  const sectionRef = useRef(null);
  const { t, language } = useLanguage();

  const finalCounts = { clients: 200, partners: 10, smiles: 500 };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        clients: Math.floor(finalCounts.clients * progress),
        partners: Math.floor(finalCounts.partners * progress),
        smiles: Math.floor(finalCounts.smiles * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(finalCounts);
      }
    }, stepDuration);
  };

  const getStats = () => {
    const labels = {
      fr: {
        clients: 'Clients satisfaits',
        partners: 'Entreprises partenaires', 
        smiles: 'Sourires'
      },
      de: {
        clients: 'Zufriedene Kunden',
        partners: 'Partner-Unternehmen',
        smiles: 'Lächeln'
      },
      en: {
        clients: 'Satisfied clients',
        partners: 'Partner companies',
        smiles: 'Smiles'
      }
    };

    return [
      {
        number: counts.clients,
        suffix: '+',
        label: labels[language].clients,
        icon: Users,
        bgPattern: 'radial-gradient(circle at 30% 40%, rgba(0,150,214,0.15), transparent 70%)'
      },
      {
        number: counts.partners,
        suffix: '+',
        label: labels[language].partners,
        icon: Building,
        bgPattern: 'conic-gradient(from 45deg, rgba(0,150,214,0.1), transparent, rgba(59,130,246,0.15))'
      },
      {
        number: counts.smiles,
        suffix: '+',
        label: labels[language].smiles,
        icon: Heart,
        bgPattern: 'linear-gradient(135deg, rgba(0,150,214,0.12), transparent 50%, rgba(96,165,250,0.08))'
      }
    ];
  };

  const stats = getStats();

  return (
    <section 
      ref={sectionRef}
      className="py-12 lg:py-16 bg-gradient-to-br from-primary/5 to-blue-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {t('stats.title')} <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">{t('stats.word')}</span>
          </h2>
        </div>

        <div className="flex flex-row justify-center items-center space-x-6 lg:space-x-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center relative"
            >
              {/* Fond avec tâche stylée uniquement - rectangle supprimé */}
              <div className="absolute inset-0 -m-4">
                <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto relative">
                  {/* Tâche stylée en arrière-plan */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-60"
                    style={{ background: stat.bgPattern }}
                  ></div>
                  
                  {/* Formes géométriques abstraites - gardées */}
                  <div className="absolute top-1 right-1 w-3 h-3 bg-primary/20 rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-6 bg-blue-400/15 rounded-full transform rotate-45"></div>
                  <div className="absolute top-1/2 left-1 w-1 h-4 bg-primary/25 rounded-full transform -rotate-12"></div>
                  
                  {/* Icône en arrière-plan */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <stat.icon className="w-12 h-12 text-primary" />
                  </div>
                </div>
              </div>
              
              {/* Chiffres sans rectangle de fond */}
              <div className="relative z-10 p-3 lg:p-4">
                <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-primary">
                  {stat.number}{stat.suffix}
                </div>
              </div>
              
              <p className="text-xs lg:text-sm text-muted-foreground font-medium mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
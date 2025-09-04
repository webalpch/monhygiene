import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFadeInOnScroll } from '@/hooks/useFadeInOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const [showModal, setShowModal] = useState(false);
  const { ref: sectionRef, isVisible } = useFadeInOnScroll();
  const { t, language } = useLanguage();

  const getAboutContent = () => {
    return {
      description: t('about.description'),
      learnMore: t('about.learn_more'),
      ourStory: t('about.our_story'),
      closeModal: t('about.close_modal'),
      contactUs: t('about.contact_us'),
      content: [
        t('about.content1'),
        t('about.content2'),
        t('about.content3'),
        t('about.content4'),
        t('about.content5')
      ]
    };
  };

  const content = getAboutContent();

  return (
    <section id="about" className="section-padding bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-xl lg:text-5xl font-bold text-foreground mb-12 tracking-tight whitespace-nowrap lg:whitespace-normal">
            {t('about.title_start')} <span className="text-primary">{t('about.brand_name')}</span> {t('about.title_end')}
          </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              {content.description}
            </p>
            
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-10 py-4 text-lg rounded-full shadow-lg"
              onClick={() => setShowModal(true)}
            >
              {content.learnMore}
            </Button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-3xl p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl lg:text-4xl font-bold text-foreground whitespace-nowrap">
                  {content.ourStory}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowModal(false)}
                  className="rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="text-foreground leading-relaxed text-lg space-y-4">
                {content.content.map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="mt-10 flex justify-center">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white px-10 py-4 text-lg rounded-full shadow-lg"
                  onClick={() => {
                    setShowModal(false);
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {content.contactUs}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
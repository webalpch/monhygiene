import { CheckCircle, Phone, Home, ChevronDown, Truck, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFadeInOnScroll } from '@/hooks/useFadeInOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

const HowItWorksSection = () => {
  const { ref: sectionRef, isVisible } = useFadeInOnScroll();
  const { ref: stepsRef, isVisible: stepsVisible } = useFadeInOnScroll();
  const { ref: pricingRef, isVisible: pricingVisible } = useFadeInOnScroll();
  const { t } = useLanguage();
  const [activeSteps, setActiveSteps] = useState<number[]>([]);

  const steps = [
    {
      number: "1",
      title: t('how.step1_title'),
      description: t('how.step1_desc'),
      icon: CheckCircle
    },
    {
      number: "2",
      title: t('how.step2_title'),
      description: t('how.step2_desc'),
      icon: Phone
    },
    {
      number: "3",
      title: t('how.step3_title'),
      description: t('how.step3_desc'),
      icon: Home
    }
  ];

  const toggleStep = (index: number) => {
    setActiveSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="section-padding bg-gradient-to-br from-white to-gray-50 overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground tracking-tight">
              {t('how.title')} ?
            </h2>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('how.subtitle')}
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div ref={stepsRef} className={`relative mb-16 transition-all duration-1000 delay-300 ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="relative max-w-5xl mx-auto">
              {/* Clean connecting lines */}
              <div className="absolute top-20 left-0 right-0 flex justify-between px-16">
                {/* Line 1 to 2 */}
                <div className="flex-1 relative">
                  <div className="absolute top-0 left-20 right-20 h-0.5 bg-gradient-to-r from-primary/60 to-primary/60" style={{
                    animation: 'expandLine 1.5s ease-out 1s forwards',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left'
                  }} />
                  <div className="absolute top-[-2px] left-1/2 w-1 h-1 bg-primary rounded-full" style={{
                    animation: 'fadeIn 0.5s ease-out 2s forwards',
                    opacity: 0
                  }} />
                </div>
                
                {/* Line 2 to 3 */}
                <div className="flex-1 relative">
                  <div className="absolute top-0 left-20 right-20 h-0.5 bg-gradient-to-r from-primary/60 to-primary/60" style={{
                    animation: 'expandLine 1.5s ease-out 1.5s forwards',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left'
                  }} />
                  <div className="absolute top-[-2px] left-1/2 w-1 h-1 bg-primary rounded-full" style={{
                    animation: 'fadeIn 0.5s ease-out 2.5s forwards',
                    opacity: 0
                  }} />
                </div>
              </div>
              
              {/* Steps */}
              <div className="flex justify-between items-start px-8">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  const isActive = activeSteps.includes(index);
                  return (
                    <div key={index} className="flex flex-col items-center max-w-xs">
                      {/* Clickable point */}
                      <div className="relative cursor-pointer group" onClick={() => toggleStep(index)} style={{
                        animation: `scale-in 0.6s ease-out ${0.5 + index * 0.2}s forwards`,
                        opacity: 0,
                        transform: "scale(0.3)"
                      }}>
                        <div className={`w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl ${isActive ? 'scale-110 shadow-xl' : ''}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Hover indicator */}
                        <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${!isActive ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                          <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      
                      {/* Title */}
                      <div className="text-center mt-8 cursor-pointer" onClick={() => toggleStep(index)} style={{
                        animation: `fade-in 0.6s ease-out ${0.7 + index * 0.2}s forwards`,
                        opacity: 0,
                        transform: "translateY(20px)"
                      }}>
                        <h3 className="text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      
                      {/* Expandable description */}
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = activeSteps.includes(index);
                return (
                  <div key={index} className="relative">
                    {/* Connecting line for mobile */}
                    {index < steps.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-16 bg-primary/30"></div>}
                    
                    <div className="flex items-start cursor-pointer" onClick={() => toggleStep(index)}>
                      <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isActive ? 'scale-110 shadow-xl' : ''}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {/* Expandable description */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 mt-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Card ref={pricingRef} className={`border-0 shadow-lg bg-black max-w-md mx-auto transition-all duration-1000 delay-600 ${pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('how.pricing_title')}</h3>
            </div>
            
            <div className="bg-white p-3 rounded-lg">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-black mb-1">{t('how.pricing.offered')}</p>
                  <p className="text-xs text-black">{t('how.pricing.offered_desc')}</p>
                </div>
                
                <div>
                  <p className="text-sm font-bold text-black mb-1">{t('how.pricing.beyond_title')}</p>
                  <p className="text-xs text-black mb-1">{t('how.pricing.beyond_desc')}</p>
                  <p className="text-xs text-black">{t('how.pricing.beyond_example')}</p>
                </div>
                
                <div>
                  <p className="text-sm font-bold text-black mb-1">{t('how.pricing.loyalty')}</p>
                  <p className="text-xs text-black mb-1">{t('how.pricing.loyalty_desc')}</p>
                  <p className="text-xs text-black">{t('how.pricing.loyalty_example')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorksSection;
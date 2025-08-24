import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { ReservationModal } from './ReservationModal';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const TikTokIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="h-5 w-5 text-white hover:text-gray-300 transition-colors" 
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
  </svg>
);

interface HeaderProps {
  onReservationClick?: () => void;
  isReservationModalOpen?: boolean;
  onReservationModalClose?: () => void;
}

const Header = ({ 
  onReservationClick, 
  isReservationModalOpen = false, 
  onReservationModalClose = () => {} 
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/69417120-680d-4758-83e3-20c0b4733da8.png" 
                alt="MonHygiène" 
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex space-x-8">
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.services')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.about')}
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.gallery')}
              </button>
              <button 
                onClick={() => scrollToSection('reviews')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.reviews')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t('nav.contact')}
              </button>
              <Button 
                onClick={onReservationClick}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {t('nav.reservation')}
              </Button>
            </nav>

            {/* Réseaux sociaux et langue desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <LanguageSelector />
              <a
                href="https://web.facebook.com/people/Monhygi%C3%A8ne/61556687450370/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a
                href="https://wa.me/message/CJKXPUTDPLG6D1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/monhygiene.ch/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.tiktok.com/@monhygiene.ch"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>

            {/* Menu mobile button */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Menu mobile overlay */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-black z-50 h-screen w-screen overflow-hidden animate-slide-in-from-top">
              <div className="h-full w-full flex flex-col">
                {/* Header avec logo et bouton fermer */}
                <div className="flex justify-between items-center p-4">
                  <img 
                    src="/lovable-uploads/69417120-680d-4758-83e3-20c0b4733da8.png" 
                    alt="MonHygiène" 
                    className="w-20 h-20 object-contain"
                  />
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-white"
                  >
                    <X className="h-8 w-8" />
                  </button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 flex flex-col justify-center px-8 space-y-6">
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-left text-2xl text-gray-300 hover:text-white transition-colors py-3 menu-item-stagger border-b border-gray-800"
                    style={{ animationDelay: '0.1s' }}
                  >
                    {t('nav.services')}
                  </button>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-left text-2xl text-gray-300 hover:text-white transition-colors py-3 menu-item-stagger border-b border-gray-800"
                    style={{ animationDelay: '0.15s' }}
                  >
                    {t('nav.about')}
                  </button>
                  <button 
                    onClick={() => scrollToSection('gallery')}
                    className="text-left text-2xl text-gray-300 hover:text-white transition-colors py-3 menu-item-stagger border-b border-gray-800"
                    style={{ animationDelay: '0.2s' }}
                  >
                    {t('nav.gallery')}
                  </button>
                  <button 
                    onClick={() => scrollToSection('reviews')}
                    className="text-left text-2xl text-gray-300 hover:text-white transition-colors py-3 menu-item-stagger border-b border-gray-800"
                    style={{ animationDelay: '0.25s' }}
                  >
                    {t('nav.reviews')}
                  </button>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-left text-2xl text-gray-300 hover:text-white transition-colors py-3 menu-item-stagger border-b border-gray-800"
                    style={{ animationDelay: '0.3s' }}
                  >
                    {t('nav.contact')}
                  </button>
                  
                  {/* Bouton réservation */}
                  <Button 
                    onClick={() => {
                      onReservationClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white w-full mt-6 py-4 text-xl menu-item-stagger"
                    style={{ animationDelay: '0.35s' }}
                  >
                    {t('nav.reservation')}
                  </Button>
                </nav>
                
                {/* Footer avec langue et réseaux sociaux - exactement comme desktop */}
                <div className="p-8 space-y-6">
                  {/* Sélecteur de langue */}
                  <div className="flex justify-center menu-item-stagger" style={{ animationDelay: '0.4s' }}>
                    <LanguageSelector />
                  </div>
                  
                  {/* Réseaux sociaux - même disposition que desktop */}
                  <div className="flex justify-center space-x-8 menu-item-stagger" style={{ animationDelay: '0.45s' }}>
                    <a
                      href="https://web.facebook.com/people/Monhygi%C3%A8ne/61556687450370/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="p-2"
                    >
                      <Facebook className="h-7 w-7 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                    </a>
                    <a
                      href="https://wa.me/message/CJKXPUTDPLG6D1"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="p-2"
                    >
                      <MessageCircle className="h-7 w-7 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                    </a>
                    <a
                      href="https://www.instagram.com/monhygiene.ch/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="p-2"
                    >
                      <Instagram className="h-7 w-7 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@monhygiene.ch"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="p-2"
                    >
                      <div className="h-7 w-7">
                        <TikTokIcon />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <ReservationModal 
        isOpen={isReservationModalOpen}
        onClose={onReservationModalClose}
      />
    </>
  );
};

export default Header;
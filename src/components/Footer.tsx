import { useState } from 'react';
import { Facebook, MessageCircle, Instagram, Phone, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const TikTokIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="h-5 w-5" 
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
  </svg>
);

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });
      
      toast({
        title: t('footer.message_sent'),
        description: t('footer.message_response'),
      });
      
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur s\'est produite. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      label: t('footer.phone'),
      value: '+41 078 304 95 93',
      href: 'tel:+41078304959'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+41 078 304 95 93',
      href: 'https://wa.me/message/CJKXPUTDPLG6D1'
    },
    {
      icon: Mail,
      label: t('footer.email'),
      value: 'contact@monhygiene.ch',
      href: 'mailto:contact@monhygiene.ch'
    },
    {
      icon: MapPin,
      label: t('footer.location'),
      value: 'Sion, Suisse',
      href: '#'
    }
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://web.facebook.com/people/Monhygi%C3%A8ne/61556687450370/',
      label: 'Facebook'
    },
    {
      icon: MessageCircle,
      href: 'https://wa.me/message/CJKXPUTDPLG6D1',
      label: 'WhatsApp'
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/monhygiene.ch/',
      label: 'Instagram'
    },
    {
      icon: TikTokIcon,
      href: 'https://www.tiktok.com/@monhygiene.ch',
      label: 'TikTok'
    }
  ];

  return (
    <footer id="contact" className="bg-black text-white">
      {/* Contact et Formulaire */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-16">
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Informations de contact */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-white">{t('footer.contact_info')}</h3>
              
              {/* Desktop/Tablet: 2x2 grid layout with improved spacing */}
              <div className="hidden md:grid grid-cols-1 gap-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-4 text-gray-300 hover:text-primary transition-colors duration-300 group p-4 rounded-xl hover:bg-white/5"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">{item.label}</div>
                      <div className="font-semibold text-base text-white break-words">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Mobile: vertical layout with improved spacing */}
              <div className="md:hidden space-y-4">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-4 text-gray-300 hover:text-primary transition-colors duration-300 group p-3 rounded-xl hover:bg-white/5"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">{item.label}</div>
                      <div className="font-semibold text-white break-words">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-white">{t('footer.send_message')}</h3>
              <form 
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-4"
                data-netlify="true"
                netlify-honeypot="bot-field"
                name="contact"
              >
                {/* Champ caché pour Netlify */}
                <input type="hidden" name="form-name" value="contact" />
                {/* Honeypot pour éviter le spam */}
                <div style={{ display: 'none' }}>
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </div>
                
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder={t('footer.your_name')}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-primary rounded-lg h-12"
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t('footer.your_email')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-primary rounded-lg h-12"
                  />
                </div>
                
                <div>
                  <Textarea
                    name="message"
                    placeholder={t('footer.your_message')}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-primary resize-none rounded-lg"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90 text-white py-3 rounded-lg shadow-lg inline-flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{t('footer.send')}</span>
                </Button>
              </form>
            </div>
          </div>

          {/* Logo et réseaux sociaux */}
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/69417120-680d-4758-83e3-20c0b4733da8.png" 
              alt="MonHygiène Logo" 
              className="h-12 w-auto mx-auto mb-6"
            />
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              {t('footer.description')}
            </p>

            {/* Réseaux sociaux plus compacts */}
            <div className="mb-6">
              <p className="text-xs font-normal mb-4 text-gray-500 uppercase tracking-wider">{t('footer.follow')}</p>
              <div className="flex justify-center space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-gray-800"></div>

      {/* Copyright */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 MonHygiène. {t('footer.rights')}
            </div>
            
            <div className="text-gray-400 text-sm">
              {t('footer.designed_with')}{' '}
              <span className="text-red-500 inline-block animate-pulse-heart">💓</span>
              {' '}{t('footer.by')}{' '}
              <a 
                href="https://webalp.ch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                WebAlp.ch
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
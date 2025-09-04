import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhatsAppButton = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/message/CJKXPUTDPLG6D1"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-black hover:bg-gray-800 text-white rounded-full shadow-2xl hover:shadow-black/25 transition-all duration-300 transform hover:scale-105"
        aria-label={t('whatsapp.message')}
      >
        {/* Consistent design for all screen sizes */}
        <div className="p-4">
          <MessageCircle className="w-6 h-6" />
        </div>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-20" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
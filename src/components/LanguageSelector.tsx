import { useNavigate, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export const LanguageSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Déterminer la langue actuelle basée sur l'URL
  const getCurrentLanguage = () => {
    const pathSegments = location.pathname.split('/');
    const langCode = pathSegments[1];
    return languages.find(lang => lang.code === langCode) || languages[0]; // français par défaut
  };

  const handleLanguageChange = (newLang: string) => {
    const pathSegments = location.pathname.split('/');
    
    // Si on est sur la route racine ou pas de langue dans l'URL
    if (pathSegments.length <= 2 && pathSegments[1] === '') {
      navigate(`/${newLang}`);
    } else {
      // Remplacer la langue actuelle par la nouvelle langue
      pathSegments[1] = newLang;
      navigate(pathSegments.join('/'));
    }
  };

  const currentLanguage = getCurrentLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              currentLanguage.code === language.code 
                ? 'bg-primary/10 text-primary' 
                : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
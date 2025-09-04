import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { MapboxAddress } from '@/types/reservation';
import Map from '@/components/Map';
import { useLanguage } from '@/contexts/LanguageContext';
interface CartAddressStepProps {
  address: MapboxAddress | null;
  onAddressSelect: (address: MapboxAddress) => void;
  onNext: () => void;
  onBack?: () => void;
}
interface MapboxSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
  properties: {
    address?: string;
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}
export const CartAddressStep: React.FC<CartAddressStepProps> = ({
  address,
  onAddressSelect,
  onNext,
  onBack
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const { t } = useLanguage();
  useEffect(() => {
    if (address) {
      setSearchValue(address.place_name || '');
      setShowSuggestions(false);
    }
  }, [address]);
  const searchAddresses = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      const accessToken = 'pk.eyJ1IjoiYmFzdGllbnJ5c2VyIiwiYSI6ImNtN3JnbHQyZzBobW8ycnNlNXVuemtmYmEifQ.7qQos4iZs1ZRpe4hNBmYCw';

      // Recherche avec focus sur la Suisse et priorité au Valais
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` + `access_token=${accessToken}&` + `country=CH&` + `types=address,poi,place&` + `limit=10&` + `language=fr&` + `proximity=7.3603,46.2044&` + `bbox=5.9559,45.8179,10.4921,47.8084`);
      if (response.ok) {
        const data = await response.json();
        console.log('Réponse API Mapbox:', data);
        let features = data.features || [];

        // Si peu de résultats, ajouter des suggestions locales
        if (features.length < 5) {
          const fallbackSuggestions = getFallbackSuggestions(query);
          features = [...features, ...fallbackSuggestions];
        }

        // Éliminer les doublons et limiter les résultats
        const uniqueSuggestions = features.filter((suggestion, index, self) => index === self.findIndex(s => s.place_name === suggestion.place_name)).slice(0, 8);
        setSuggestions(uniqueSuggestions);
        setShowSuggestions(uniqueSuggestions.length > 0);
        console.log('Suggestions filtrées:', uniqueSuggestions);
      } else {
        console.warn('Erreur API Mapbox, utilisation du fallback');
        const fallbackSuggestions = getFallbackSuggestions(query);
        setSuggestions(fallbackSuggestions);
        setShowSuggestions(fallbackSuggestions.length > 0);
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      const fallbackSuggestions = getFallbackSuggestions(query);
      setSuggestions(fallbackSuggestions);
      setShowSuggestions(fallbackSuggestions.length > 0);
    } finally {
      setIsLoading(false);
    }
  };
  const getFallbackSuggestions = (query: string): MapboxSuggestion[] => {
    const cities = [{
      name: 'Sion',
      coords: [7.3603, 46.2044],
      region: 'Valais'
    }, {
      name: 'Sierre',
      coords: [7.5348, 46.2919],
      region: 'Valais'
    }, {
      name: 'Martigny',
      coords: [7.0673, 46.1024],
      region: 'Valais'
    }, {
      name: 'Monthey',
      coords: [6.9581, 46.2508],
      region: 'Valais'
    }, {
      name: 'Brig-Glis',
      coords: [7.9873, 46.3189],
      region: 'Valais'
    }, {
      name: 'Saint-Maurice',
      coords: [7.0034, 46.2187],
      region: 'Valais'
    }, {
      name: 'Visp',
      coords: [7.8847, 46.2929],
      region: 'Valais'
    }, {
      name: 'Lausanne',
      coords: [6.6323, 46.5197],
      region: 'Vaud'
    }, {
      name: 'Genève',
      coords: [6.1432, 46.2044],
      region: 'Genève'
    }, {
      name: 'Montreux',
      coords: [6.9114, 46.4312],
      region: 'Vaud'
    }, {
      name: 'Vevey',
      coords: [6.8434, 46.4601],
      region: 'Vaud'
    }, {
      name: 'Neuchâtel',
      coords: [6.9310, 46.9929],
      region: 'Neuchâtel'
    }, {
      name: 'Fribourg',
      coords: [7.1512, 46.8058],
      region: 'Fribourg'
    }, {
      name: 'Berne',
      coords: [7.4474, 46.9481],
      region: 'Berne'
    }, {
      name: 'Zurich',
      coords: [8.5417, 47.3769],
      region: 'Zurich'
    }, {
      name: 'Bâle',
      coords: [7.5886, 47.5596],
      region: 'Bâle-Ville'
    }];
    const queryLower = query.toLowerCase();
    return cities.filter(city => city.name.toLowerCase().includes(queryLower)).map(city => ({
      id: `fallback_${city.name}`,
      place_name: `${city.name}, ${city.region}, Suisse`,
      center: city.coords as [number, number],
      properties: {
        address: city.name
      },
      context: [{
        id: 'place',
        text: city.name
      }, {
        id: 'region',
        text: city.region
      }, {
        id: 'country',
        text: 'Suisse'
      }]
    }));
  };
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      searchAddresses(value);
    }, 300);
  };
  const handleSuggestionSelect = (suggestion: MapboxSuggestion) => {
    console.log('Sélection de suggestion:', suggestion);
    const newAddress: MapboxAddress = {
      id: suggestion.id,
      place_name: suggestion.place_name,
      center: suggestion.center,
      address: suggestion.properties.address || suggestion.place_name.split(',')[0],
      city: suggestion.context?.find(c => c.id.includes('place') || c.id.includes('region'))?.text || 'Ville',
      postcode: suggestion.context?.find(c => c.id.includes('postcode'))?.text || '1000'
    };
    console.log('Nouvelle adresse créée:', newAddress);

    // Appeler la sélection d'adresse - la map se mettra à jour automatiquement
    onAddressSelect(newAddress);
    setSearchValue(suggestion.place_name);
    setShowSuggestions(false);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionSelect(suggestions[0]);
      // Passer au step suivant après sélection
      setTimeout(() => onNext(), 500);
    } else if (address) {
      // Si une adresse est déjà sélectionnée, passer au step suivant
      onNext();
    }
  };
  return (
    <div className="flex flex-col h-full min-h-screen sm:min-h-[400px]">
      {/* Map Container - Fixed Height */}
      <div className="relative h-64 sm:h-80 flex-shrink-0">
        <Map address={address} height="100%" className="h-full" />
        
        {/* Search overlay */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              {isLoading && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5 animate-spin z-10" />}
              <Input 
                value={searchValue} 
                onChange={e => handleSearchChange(e.target.value)} 
                placeholder={t('enterYourAddress')} 
                className="pl-10 pr-10 bg-white/95 backdrop-blur-sm border-gray-300 shadow-lg text-base h-12 rounded-lg" 
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }} 
              />
              
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-60 overflow-y-auto">
                  {suggestions.map(suggestion => (
                    <div 
                      key={suggestion.id} 
                      onClick={() => handleSuggestionSelect(suggestion)} 
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start space-x-3"
                    >
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.place_name}
                        </p>
                        {suggestion.context && (
                          <p className="text-xs text-gray-500 truncate">
                            {suggestion.context.map(c => c.text).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Click outside to close suggestions */}
        {showSuggestions && <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />}
      </div>

      {/* Bouton Continuer quand adresse sélectionnée */}
      {address && (
        <div className="flex-shrink-0 p-4 border-t bg-white -mt-2">
          <div className="flex gap-3">
            {onBack && (
              <Button 
                onClick={onBack}
                variant="outline"
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 text-base font-medium rounded-lg"
              >
                {t('back')}
              </Button>
            )}
            <Button 
              onClick={onNext} 
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white text-base font-medium rounded-lg"
            >
              {t('continue')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
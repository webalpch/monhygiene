import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { MapboxAddress } from '@/types/reservation';
import Map from '@/components/Map';
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
  return <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-lg md:text-2xl font-bold text-gray-900 mb-2 px-2">Où souhaitez-vous nos services ?</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">Recherchez votre adresse en Suisse</p>
      </div>

      {/* Map with overlay search */}
      <div className="relative w-full max-w-5xl mx-auto">
        <Map address={address} height="250px" className="sm:h-[300px]" />
        
        {/* Search overlay */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20">
          <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-md relative">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                {isLoading && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 animate-spin z-10" />}
                <Input value={searchValue} onChange={e => handleSearchChange(e.target.value)} placeholder="Recherchez une adresse..." className="pl-10 pr-10 bg-white/95 backdrop-blur-sm border-gray-300 shadow-lg text-sm sm:text-base h-10 sm:h-12" onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }} />
                
                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-48 sm:max-h-60 overflow-y-auto">
                    {suggestions.map(suggestion => <div key={suggestion.id} onClick={() => handleSuggestionSelect(suggestion)} className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start space-x-2 sm:space-x-3">
                        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {suggestion.place_name}
                          </p>
                          {suggestion.context && <p className="text-xs text-gray-500 truncate">
                              {suggestion.context.map(c => c.text).join(', ')}
                            </p>}
                        </div>
                      </div>)}
                  </div>}
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 shadow-lg px-3 sm:px-4 text-sm sm:text-base h-10 sm:h-12">
                OK
              </Button>
            </div>
          </form>
        </div>

        {/* Click outside to close suggestions */}
        {showSuggestions && <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />}
      </div>

      {/* Selected Address Display */}
      {address && <div className="max-w-2xl mx-auto px-2 sm:px-0">
          <Card className="bg-green-50 border-green-200 ring-2 ring-green-400 ring-opacity-50 shadow-lg">
            <CardContent className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-start space-x-3 flex-1">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-green-900 text-sm sm:text-base">Adresse sélectionnée</h3>
                    <p className="text-green-700 text-sm mt-1 break-words">{address.place_name}</p>
                  </div>
                </div>
                <Button onClick={onNext} size="sm" className="w-full sm:w-auto sm:min-w-32 text-sm sm:text-base">
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>}
    </div>;
};
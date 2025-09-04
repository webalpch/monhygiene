
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapboxAddress } from '@/types/reservation';
import { MapPin, Search, Loader2 } from 'lucide-react';
import Map from '@/components/Map';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddressStepProps {
  address: MapboxAddress | null;
  onAddressSelect: (address: MapboxAddress) => void;
  onNext: () => void;
}

export const AddressStep = ({ address, onAddressSelect, onNext }: AddressStepProps) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState(address?.place_name || '');
  const [suggestions, setSuggestions] = useState<MapboxAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchVisible, setSearchVisible] = useState(!address);

  const searchAddresses = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    console.log('🔍 Searching for:', searchQuery);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=pk.eyJ1IjoiYmFzdGllbnJ5c2VyIiwiYSI6ImNtN3JnbHQyZzBobW8ycnNlNXVuemtmYmEifQ.7qQos4iZs1ZRpe4hNBmYCw&` +
        `country=CH&` +
        `limit=8&` +
        `types=address&` +
        `autocomplete=true&` +
        `language=fr&` +
        `proximity=7.3603,46.2044`
      );

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw API response:', data);
        console.log('📊 Features count:', data.features?.length || 0);
        
        // Ne plus filtrer par "Switzerland" car l'API retourne déjà les bonnes adresses avec country=CH
        const addresses: MapboxAddress[] = (data.features || []).map((feature: any) => {
          // Extraire l'adresse complète avec numéro de maison
          const addressText = feature.text || '';
          const placeName = feature.place_name || '';
          
          // Extraire le numéro de maison et nom de rue
          let fullAddress = addressText;
          
          // Si le texte contient un numéro au début, c'est probablement l'adresse avec numéro
          if (/^\d+/.test(addressText)) {
            fullAddress = addressText;
          } else {
            // Sinon, essayer d'extraire depuis place_name
            const addressParts = placeName.split(',');
            if (addressParts.length > 0) {
              fullAddress = addressParts[0].trim();
            }
          }
          
          const mappedAddress = {
            id: feature.id,
            place_name: feature.place_name,
            center: feature.center as [number, number],
            address: fullAddress,
            city: feature.context?.find((c: any) => c.id.includes('place'))?.text || '',
            postcode: feature.context?.find((c: any) => c.id.includes('postcode'))?.text || ''
          };
          
          console.log('📍 Mapped address:', mappedAddress);
          return mappedAddress;
        });
        
        console.log('✅ Final addresses array:', addresses);
        setSuggestions(addresses);
        setShowSuggestions(addresses.length > 0);
        console.log('👀 Show suggestions:', addresses.length > 0);
      } else {
        console.error('❌ API Error:', response.status, response.statusText);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('💥 Geocoding error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
      console.log('🔄 Loading finished');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAddresses(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleAddressSelect = (selectedAddress: MapboxAddress) => {
    setQuery(selectedAddress.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchVisible(false); // Masquer la recherche après sélection
    onAddressSelect(selectedAddress);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Carte avec barre de recherche */}
      <div className="relative">
        <Map 
          address={address} 
          height="250px"
          className="rounded-xl sm:h-[300px]"
        />
        
        {/* Barre de recherche sur la carte - masquée si adresse sélectionnée */}
        {searchVisible && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-10">
            <div className="relative bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t('services_details.search_address')}
                  value={query}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="h-10 sm:h-12 text-sm sm:text-base pl-10 sm:pl-12 pr-10 sm:pr-12 border-0 rounded-xl shadow-none focus:ring-2 focus:ring-primary/20"
                />
                <Search className="absolute left-3 sm:left-4 top-2 sm:top-3 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                
                {loading && (
                  <div className="absolute right-3 sm:right-4 top-2 sm:top-3">
                    <Loader2 className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                )}
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 sm:max-h-64 overflow-y-auto z-20">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleAddressSelect(suggestion)}
                      className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group"
                    >
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-2 sm:mr-3 flex-shrink-0 group-hover:text-primary transition-colors" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-primary transition-colors text-xs sm:text-sm">
                            {suggestion.address}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {suggestion.postcode} {suggestion.city}, Suisse
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Adresse sélectionnée affichée proprement */}
        {address && !searchVisible && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-10">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-start flex-1">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-xs sm:text-sm break-words">
                      {address.address}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {address.postcode} {address.city}, Suisse
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchVisible(true)}
                  className="text-xs w-full sm:w-auto"
                >
                  {t('services_details.modify')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton de confirmation */}
      {address && (
        <div className="text-center px-2 sm:px-0">
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
          >
            {t('services_details.confirm_address')}
          </Button>
        </div>
      )}
    </div>
  );
};

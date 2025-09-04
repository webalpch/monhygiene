
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapboxAddress } from '@/types/reservation';

interface MapProps {
  address?: MapboxAddress | null;
  height?: string;
  className?: string;
}

const Map = ({ address, height = '300px', className = '' }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    // Utiliser votre clé API Mapbox
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2ViYWxwIiwiYSI6ImNtZXp3YW8yeTA3cXIybHNiMzBkZW05ZWYifQ.LO0nff0qI8i4AscRn8AdTA';
    
    try {
      console.log('Creating new Mapbox map instance...');
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [7.3603, 46.2044], // Centre du Valais (Sion)
        zoom: 10,
        bearing: 0,
        pitch: 30,
        antialias: true,
        attributionControl: false // Enlever les attributions pour plus de place
      });

      console.log('Map instance created successfully');

      // Ajouter les contrôles de navigation avec un design moderne
      const nav = new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      });
      map.current.addControl(nav, 'top-right');

      // Améliorer l'interaction
      map.current.scrollZoom.setWheelZoomRate(1/200);
      map.current.doubleClickZoom.enable();

      // Ajouter un style personnalisé pour la carte
      map.current.on('style.load', () => {
        // Ajouter une couche de terrain pour plus de relief
        map.current?.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        
        map.current?.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.2 });
        
        // Ajouter une atmosphère
        map.current?.setFog({
          'range': [0.8, 8],
          'color': '#f8f9fa',
          'horizon-blend': 0.5
        });
      });

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Mapbox:', error);
      console.error('Error details:', error);
      
      // Afficher un message d'erreur dans le conteneur
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300" style="min-height: ${height};">
            <div class="text-center text-slate-600 p-8">
              <div class="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <div class="text-lg font-semibold mb-2 text-slate-700">Carte temporairement indisponible</div>
              <div class="text-sm text-slate-500">Erreur de chargement: ${error.message || 'Configuration en cours'}</div>
            </div>
          </div>
        `;
      }
    }

    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Mettre à jour le marqueur quand l'adresse change
  useEffect(() => {
    if (!map.current || !address) return;

    console.log('Mise à jour de la map avec adresse:', address);

    try {
      // Supprimer l'ancien marqueur s'il existe
      if (marker.current) {
        marker.current.remove();
      }

      // Créer un marqueur personnalisé plus visible
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div class="relative">
          <div class="w-10 h-10 bg-red-500 rounded-full shadow-lg border-4 border-white flex items-center justify-center transform hover:scale-110 transition-transform duration-200 animate-bounce">
            <div class="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium text-gray-800 whitespace-nowrap border border-gray-200 max-w-48 text-center">
            ${address.place_name || address.address || 'Adresse sélectionnée'}
          </div>
        </div>
      `;

      marker.current = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'bottom'
      })
        .setLngLat(address.center)
        .addTo(map.current);

      // Attendre que la map soit complètement chargée avant de zoomer
      if (map.current.isStyleLoaded()) {
        performZoom();
      } else {
        map.current.once('style.load', performZoom);
      }

      function performZoom() {
        if (!map.current) return;
        
        console.log('🎯 Zoom vers les coordonnées:', address.center);
        
        // Calculer les bounds pour que l'adresse soit entièrement visible dans la zone
        const padding = 100; // Padding en pixels pour s'assurer que le contenu reste dans la zone blanche
        const bounds = new mapboxgl.LngLatBounds()
          .extend(address.center)
          .extend([address.center[0] + 0.01, address.center[1] + 0.01])
          .extend([address.center[0] - 0.01, address.center[1] - 0.01]);
        
        // Animation fluide avec fitBounds pour garantir que l'adresse reste dans la zone visible
        map.current.fitBounds(bounds, {
          padding: {
            top: padding,
            bottom: padding + 100, // Plus d'espace en bas pour le tooltip du marqueur
            left: padding,
            right: padding
          },
          maxZoom: 15, // Zoom maximal pour éviter d'être trop proche
          bearing: 0,
          pitch: 45,
          essential: true,
          duration: 2000,
          curve: 1.2,
          speed: 0.8,
          easing: (t) => t * (2 - t)
        });
      }

    } catch (error) {
      console.error('Erreur lors de la mise à jour du marqueur:', error);
    }
  }, [address]);

  return (
    <div className="relative group w-full">
      <div 
        ref={mapContainer} 
        className={`w-full rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl ${className}`}
        style={{ 
          height,
          minHeight: height,
          backgroundColor: '#f8f9fa'
        }}
      />
      <div className="absolute inset-0 rounded-xl ring-1 ring-black/5 pointer-events-none"></div>
    </div>
  );
};

export default Map;

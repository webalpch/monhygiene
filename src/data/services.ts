import { Service } from '@/types/reservation';

// Services - utilise maintenant le système de traduction
export const getServices = (t: (key: string) => string): Service[] => [
  {
    id: 'nettoyage-vehicule',
    name: t('services.nettoyage-vehicule.name'),
    icon: 'Car',
    description: t('services.nettoyage-vehicule.description')
  },
  {
    id: 'nettoyage-canape',
    name: t('services.nettoyage-canape.name'),
    icon: 'Armchair',
    description: t('services.nettoyage-canape.description')
  },
  {
    id: 'nettoyage-matelas',
    name: t('services.nettoyage-matelas.name'),
    icon: 'Bed',
    description: t('services.nettoyage-matelas.description')
  },
  {
    id: 'shampooinage-sieges',
    name: t('services.shampooinage-sieges.name'),
    icon: 'Armchair',
    description: t('services.shampooinage-sieges.description')
  },
  {
    id: 'nettoyage-moquette-tapis',
    name: t('services.nettoyage-moquette-tapis.name'),
    icon: 'Layers',
    description: t('services.nettoyage-moquette-tapis.description')
  },
  {
    id: 'nettoyage-vitres',
    name: t('services.nettoyage-vitres.name'),
    icon: 'Droplets',
    description: t('services.nettoyage-vitres.description')
  },
  {
    id: 'nettoyage-billard',
    name: t('services.nettoyage-billard.name'),
    icon: 'CircleDot',
    description: t('services.nettoyage-billard.description')
  },
  {
    id: 'nettoyage-terrasse',
    name: t('services.nettoyage-terrasse.name'),
    icon: 'SquareDot',
    description: t('services.nettoyage-terrasse.description')
  },
  {
    id: 'nettoyage-haute-pression',
    name: t('services.nettoyage-haute-pression.name'),
    icon: 'Droplets',
    description: t('services.nettoyage-haute-pression.description')
  },
  {
    id: 'nettoyage-toiture',
    name: t('services.nettoyage-toiture.name'),
    icon: 'House',
    description: t('services.nettoyage-toiture.description')
  },
  {
    id: 'autres-services',
    name: t('services.autres-services.name'),
    icon: 'Wrench',
    description: t('services.autres-services.description')
  }
];

// Fonction de compatibilité pour les anciens usages
export const SERVICES = getServices(() => '');
import { Service } from '@/types/reservation';

// Services avec texte français fixe
export const SERVICES: Service[] = [
  {
    id: 'nettoyage-vehicule',
    name: 'Nettoyage véhicule',
    icon: 'Car',
    description: 'Nettoyage complet intérieur et extérieur de votre véhicule à domicile'
  },
  {
    id: 'nettoyage-canape',
    name: 'Nettoyage canapé',
    icon: 'Armchair',
    description: 'Nettoyage professionnel de canapé à domicile avec tarifs selon nombre de places'
  },
  {
    id: 'nettoyage-matelas',
    name: 'Nettoyage matelas',
    icon: 'Bed',
    description: 'Nettoyage en profondeur de matelas toutes tailles à domicile'
  },
  {
    id: 'shampooinage-sieges',
    name: 'Shampooinage sièges',
    icon: 'Armchair',
    description: 'Shampooinage professionnel des sièges de véhicule'
  },
  {
    id: 'nettoyage-moquette-tapis',
    name: 'Nettoyage moquettes/tapis',
    icon: 'Layers',
    description: 'Nettoyage professionnel de moquettes et tapis sur devis'
  },
  {
    id: 'nettoyage-vitres',
    name: 'Nettoyage vitres',
    icon: 'Droplets',
    description: 'Lavage professionnel de vitres intérieur et extérieur'
  },
  {
    id: 'nettoyage-billard',
    name: 'Nettoyage tapis billard',
    icon: 'CircleDot',
    description: 'Nettoyage spécialisé du tapis de votre table de billard'
  },
  {
    id: 'nettoyage-terrasse',
    name: 'Nettoyage terrasse',
    icon: 'SquareDot',
    description: 'Nettoyage haute pression de terrasse et surfaces extérieures'
  },
  {
    id: 'nettoyage-haute-pression',
    name: 'Nettoyage haute pression',
    icon: 'Droplets',
    description: 'Nettoyage de façades, terrasses et surfaces extérieures'
  },
  {
    id: 'nettoyage-toiture',
    name: 'Nettoyage toiture',
    icon: 'House',
    description: 'Nettoyage et entretien professionnel de votre toiture'
  },
  {
    id: 'autres-services',
    name: 'Autres services',
    icon: 'Wrench',
    description: 'Services de nettoyage personnalisés selon vos besoins'
  }
];
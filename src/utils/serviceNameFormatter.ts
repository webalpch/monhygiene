export const formatServiceName = (serviceName: string, serviceDetails: any): string => {
  if (!serviceDetails) return serviceName;

  // Pack véhicule
  if (serviceDetails.pack) {
    return `${serviceName} - Pack ${serviceDetails.pack}`;
  }

  // Matelas avec taille
  if (serviceDetails.matressSize) {
    const numberOfMatresses = serviceDetails.numberOfMatresses || 1;
    return `${serviceName} - ${serviceDetails.matressSize}cm (${numberOfMatresses} matelas)`;
  }

  // Canapé avec nombre de places
  if (serviceDetails.numberOfSeats) {
    return `${serviceName} - ${serviceDetails.numberOfSeats} place(s)`;
  }

  // Nettoyage domicile avec nombre de pièces
  if (serviceDetails.numberOfRooms) {
    let name = `${serviceName} - ${serviceDetails.numberOfRooms} pièce(s)`;
    const extras = [];
    if (serviceDetails.hasDeepCleaning) extras.push('Nettoyage profond');
    if (serviceDetails.hasWindowCleaning) extras.push('Vitres');
    if (extras.length > 0) {
      name += ` (+ ${extras.join(', ')})`;
    }
    return name;
  }

  // Nettoyage bureaux avec surface
  if (serviceDetails.surface) {
    let name = `${serviceName} - ${serviceDetails.surface}m²`;
    if (serviceDetails.frequency) {
      const freqText = serviceDetails.frequency === 'weekly' ? 'Hebdomadaire' : 
                      serviceDetails.frequency === 'monthly' ? 'Mensuel' : 'Ponctuel';
      name += ` (${freqText})`;
    }
    return name;
  }

  // Nettoyage terrasse avec type de surface
  if (serviceDetails.surfaceType) {
    return `${serviceName} - ${serviceDetails.surfaceType}`;
  }

  // Tapis/moquette avec taille
  if (serviceDetails.size) {
    return `${serviceName} - ${serviceDetails.size}`;
  }

  return serviceName;
};

// Pour afficher le service principal d'une réservation
export const getMainServiceDisplay = (reservation: any): string => {
  // Si c'est une réservation multi-services, utiliser le premier service
  if (reservation.services && reservation.services.length > 0) {
    const firstService = reservation.services[0];
    return formatServiceName(firstService.service_name, firstService.form_data);
  }
  
  // Sinon utiliser le service_type et service_details de la réservation
  return formatServiceName(reservation.service_type, reservation.service_details);
};
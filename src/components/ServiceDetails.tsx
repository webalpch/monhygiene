
import React from 'react';
import { Service } from '@/types/reservation';
import { icons } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceDetailsProps {
  service: Service;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  const IconComponent = icons[service.icon as keyof typeof icons];

  return (
    <Card className="max-w-2xl mx-auto mt-8 shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          {IconComponent && (
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <IconComponent className="w-10 h-10 text-primary" />
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {service.name}
        </h3>
        
        <p className="text-gray-600 text-lg leading-relaxed">
          {service.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ServiceDetails;

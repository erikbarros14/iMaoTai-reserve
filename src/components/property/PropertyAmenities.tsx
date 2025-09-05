'use client';

import type { Amenity } from '@/types';
import { amenitiesMap } from '@/lib/data';

interface PropertyAmenitiesProps {
  amenities: Amenity[];
}

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {amenities.map((amenity) => {
        const Icon = amenitiesMap[amenity.name];
        return (
          <div key={amenity.name} className="flex items-center gap-3">
            {Icon && <Icon className="w-5 h-5 text-primary" />}
            <span>{amenity.name}</span>
          </div>
        );
      })}
    </div>
  );
}

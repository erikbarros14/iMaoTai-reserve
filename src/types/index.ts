export interface Amenity {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Property {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  type: 'Hotel' | 'Villa' | 'Apartment' | 'Cabin';
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  description: string;
  amenities: Amenity[];
  images: string[];
}

export interface Reservation {
    id: string;
    propertyId: number;
    propertyName: string;
    propertyImage: string;
    location: string;
    checkIn: Date;
    checkOut: Date;
    totalCost: number;
}

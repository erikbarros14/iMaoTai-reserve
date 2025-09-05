import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  BedDouble,
  Bath,
  Users,
  MapPin,
  Star,
} from 'lucide-react';
import { properties } from '@/lib/data';
import BookingWidget from '@/components/property/BookingWidget';
import AIAssistant from '@/components/property/AIAssistant';
import VisualTourGenerator from '@/components/property/VisualTourGenerator';
import { PropertyAmenities } from '@/components/property/PropertyAmenities';

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === parseInt(params.id, 10));

  if (!property) {
    notFound();
  }

  const mainImage = property.images[0];
  const galleryImages = property.images.slice(1, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h1 className="font-headline text-4xl font-bold">{property.name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-medium text-foreground">{property.rating}</span>
            <span>({property.reviews} reviews)</span>
          </div>
          <span className="text-muted-foreground">&middot;</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[50vh] mb-8 relative">
        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-lg">
          <Image src={mainImage} alt={property.name} fill className="object-cover" />
        </div>
        {galleryImages.map((img, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg hidden md:block">
            <Image src={img} alt={`${property.name} gallery image ${index + 1}`} fill className="object-cover" />
          </div>
        ))}
         <div className="absolute bottom-4 right-4 z-10">
            <VisualTourGenerator imageUrls={property.images} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Property Details */}
          <div className="border-b pb-6">
            <h2 className="font-headline text-2xl mb-2">{property.type} in {property.location.split(',')[0]}</h2>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span><Users className="inline-block mr-2" />{property.guests} guests</span>
              <span><BedDouble className="inline-block mr-2" />{property.bedrooms} bedrooms</span>
              <span><Bath className="inline-block mr-2" />{property.baths} baths</span>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b">
            <p className="text-foreground/90 whitespace-pre-wrap">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="py-6 border-b">
            <h3 className="font-headline text-2xl mb-4">What this place offers</h3>
            <PropertyAmenities amenities={property.amenities} />
          </div>

          {/* AI Assistant */}
          <div className="py-6">
            <AIAssistant propertyDescription={property.description} />
          </div>
        </div>

        {/* Booking Widget */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingWidget property={property} />
          </div>
        </aside>
      </div>
    </div>
  );
}

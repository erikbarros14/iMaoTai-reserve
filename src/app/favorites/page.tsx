'use client';

import { useFavorites } from '@/contexts/FavoritesProvider';
import { properties } from '@/lib/data';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const favoriteProperties = properties.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Your Favorite Properties</h1>
        <p className="text-muted-foreground mt-2">The places you love, all in one spot.</p>
      </div>

      {favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {favoriteProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12 min-h-[40vh]">
          <div className="bg-muted rounded-full p-4">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold font-headline">No Favorites Yet</h2>
          <p className="mt-2 text-muted-foreground">
            Click the heart icon on any property to save it here.
          </p>
        </div>
      )}
    </div>
  );
}

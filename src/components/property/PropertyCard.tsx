'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFavorites } from '@/contexts/FavoritesProvider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
    toast({
      title: isFavorite(property.id) ? 'Removed from favorites' : 'Added to favorites',
      description: property.name,
    });
  };

  const favorite = isFavorite(property.id);

  return (
    <Link href={`/property/${property.id}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0 relative">
          <Image
            src={property.images[0]}
            alt={`Image of ${property.name}`}
            data-ai-hint="accommodation exterior"
            width={400}
            height={300}
            className="w-full h-60 object-cover"
          />
          <Button
            size="icon"
            className="absolute top-3 right-3 rounded-full bg-card/70 hover:bg-card"
            onClick={handleFavoriteClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('w-5 h-5 text-primary-foreground/80', favorite && 'fill-red-500 text-red-500')} />
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="font-headline text-xl mb-1 truncate group-hover:text-primary">
            {property.name}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <MapPin className="w-4 h-4" />
            {property.location}
          </CardDescription>
          <div className="flex items-center gap-2 mt-3 text-sm">
            <div className="flex items-center gap-1 font-semibold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{property.rating}</span>
            </div>
            <span className="text-muted-foreground">({property.reviews} reviews)</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-lg font-semibold">
            ${property.pricePerNight}
            <span className="text-sm font-normal text-muted-foreground"> / night</span>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}

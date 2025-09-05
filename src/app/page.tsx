import Image from 'next/image';
import Link from 'next/link';

import { PropertyCard } from '@/components/property/PropertyCard';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/button';
import { properties } from '@/lib/data';

export default function Home() {
  const featuredProperties = properties.slice(0, 6);

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src="https://picsum.photos/seed/teafield/1920/1080"
          alt="A beautiful travel destination"
          data-ai-hint="tea plantation"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight drop-shadow-md">
            Find Your Next Voyage
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 drop-shadow">
            Discover and book unique accommodations with AI-powered insights to enrich your travel experience.
          </p>
          <div className="mt-8 w-full max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-semibold">Featured Stays</h2>
            <p className="mt-2 text-lg text-muted-foreground">Handpicked properties for an unforgettable experience.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/search">Explore More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

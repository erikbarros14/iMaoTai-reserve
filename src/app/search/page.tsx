import { Suspense } from 'react';
import { Filter } from 'lucide-react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { properties } from '@/lib/data';
import type { Property } from '@/types';

interface SearchPageProps {
  searchParams: {
    location?: string;
    guests?: string;
    type?: string;
  };
}

function SearchResults({ searchParams }: SearchPageProps) {
  const filteredProperties = properties.filter((property) => {
    if (searchParams.location && !property.location.toLowerCase().includes(searchParams.location.toLowerCase())) {
      return false;
    }
    if (searchParams.guests && property.guests < parseInt(searchParams.guests)) {
      return false;
    }
    if (searchParams.type && property.type !== searchParams.type) {
      return false;
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {filteredProperties.length > 0 ? (
        filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))
      ) : (
        <div className="md:col-span-2 lg:col-span-3 text-center py-16">
          <h3 className="font-headline text-2xl">No Properties Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
}

function FiltersSidebar() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold font-headline mb-3">Filter by Price</h3>
                <Slider defaultValue={[250]} max={1000} step={10} />
                 <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>$50</span>
                    <span>$1000+</span>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold font-headline mb-3">Property Type</h3>
                <div className="space-y-2">
                    {['Apartment', 'Villa', 'Hotel', 'Cabin'].map(type => (
                         <div key={type} className="flex items-center space-x-2">
                            <Checkbox id={`type-${type}`} />
                            <Label htmlFor={`type-${type}`}>{type}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold font-headline mb-3">Amenities</h3>
                 <div className="space-y-2">
                    {['WiFi', 'Kitchen', 'Pool', 'Pet Friendly'].map(amenity => (
                         <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox id={`amenity-${amenity}`} />
                            <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <Button className="w-full">Apply Filters</Button>
        </div>
    )
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar for desktop */}
        <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
          <div className="sticky top-20">
            <h2 className="font-headline text-2xl mb-4">Filters</h2>
            <FiltersSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 xl:w-4/5">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="font-headline text-3xl">Search Results</h1>
                <p className="text-muted-foreground">
                    {searchParams.location ? `Showing properties in ${searchParams.location}`: 'Showing all properties'}
                </p>
            </div>
            <div className="flex items-center gap-4">
                 <Select defaultValue="rating">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>

                {/* Mobile Filters Trigger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <h2 className="font-headline text-2xl mb-4">Filters</h2>
                        <FiltersSidebar />
                    </SheetContent>
                </Sheet>
            </div>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

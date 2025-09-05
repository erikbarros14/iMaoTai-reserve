'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (dateRange?.from) params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
    params.set('guests', guests.toString());

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-2 items-end bg-card p-3 rounded-lg shadow-lg border w-full"
    >
      <div className="relative col-span-1 lg:col-span-3">
        <Label htmlFor="location" className="block text-xs font-medium text-muted-foreground">Location</Label>
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 mt-2 h-4 w-4 text-muted-foreground" />
        <Input
          id="location"
          type="text"
          placeholder="e.g., Aspen, Colorado"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="col-span-1 lg:col-span-4">
        <Label className="block text-xs font-medium text-muted-foreground">Dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                    {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="relative col-span-1 lg:col-span-2">
        <Label htmlFor="guests" className="block text-xs font-medium text-muted-foreground">Guests</Label>
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 mt-2 h-4 w-4 text-muted-foreground" />
        <Input
          id="guests"
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="pl-9"
        />
      </div>
      
      <div className="col-span-1 lg:col-span-1">
        <Button type="submit" className="w-full">
          Search
        </Button>
      </div>
    </form>
  );
}

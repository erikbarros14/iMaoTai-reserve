'use client';

import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon, Users, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface BookingWidgetProps {
  property: Property;
}

export default function BookingWidget({ property }: BookingWidgetProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 4),
  });
  const [guests, setGuests] = useState(2);

  const nights = date?.from && date?.to ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 3600 * 24)) : 0;
  const pricePerNight = property.pricePerNight;
  const serviceFee = 50;
  const cleaningFee = 75;
  const subtotal = pricePerNight * nights;
  const total = subtotal + serviceFee + cleaningFee;

  const handleReservation = () => {
    toast({
        title: "Booking Successful!",
        description: `You've booked ${property.name}. An email confirmation has been sent.`,
        variant: "default",
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${pricePerNight}</span>
          <span className="text-base font-normal text-muted-foreground">/ night</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="guests">Guests</Label>
             <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                id="guests"
                type="number"
                min="1"
                max={property.guests}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="pl-9"
                />
            </div>
          </div>
          
          <Button size="lg" className="w-full" onClick={handleReservation}>
            Reserve <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            You won't be charged yet
          </div>
          
          {nights > 0 && (
            <div className="space-y-2 text-sm">
                <Separator />
                <div className="flex justify-between">
                    <span>${pricePerNight} x {nights} nights</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className='text-muted-foreground'>Cleaning fee</span>
                    <span>${cleaningFee.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className='text-muted-foreground'>Service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

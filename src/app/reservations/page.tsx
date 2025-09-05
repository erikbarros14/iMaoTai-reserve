import Image from 'next/image';
import { format } from 'date-fns';
import { reservations } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, MapPin, Info } from 'lucide-react';
import Link from 'next/link';

export default function ReservationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Your Reservations</h1>
        <p className="text-muted-foreground mt-2">Manage your upcoming and past trips.</p>
      </div>

      <Alert className="mb-8 bg-primary/10 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertTitle className="font-headline">Cancellation Policy</AlertTitle>
        <AlertDescription>
          You can cancel your reservation for a full refund up to 72 hours before your scheduled check-in time.
        </AlertDescription>
      </Alert>

      {reservations.length > 0 ? (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="flex flex-col md:flex-row overflow-hidden">
              <CardHeader className="p-0 md:w-1/3">
                 <div className="relative aspect-video md:aspect-auto md:h-full">
                    <Image
                        src={reservation.propertyImage}
                        alt={`Image of ${reservation.propertyName}`}
                        fill
                        className="object-cover"
                    />
                 </div>
              </CardHeader>
              <div className="flex flex-col flex-grow">
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-2xl mb-1">{reservation.propertyName}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {reservation.location}
                  </CardDescription>
                  <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <strong>Check-in:</strong> {format(reservation.checkIn, 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <strong>Check-out:</strong> {format(reservation.checkOut, 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <p className="font-semibold text-lg mt-4">Total: ${reservation.totalCost.toLocaleString()}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto">
                    <div className="flex gap-2 w-full">
                        <Button asChild className='flex-1'>
                            <Link href={`/property/${reservation.propertyId}`}>View Property</Link>
                        </Button>
                        <Button variant="outline" className='flex-1'>Modify Reservation</Button>
                        <Button variant="destructive" className='flex-1'>Cancel Reservation</Button>
                    </div>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Reservations Found</h2>
          <p className="text-muted-foreground mt-2">Start exploring to book your first trip!</p>
        </div>
      )}
    </div>
  );
}

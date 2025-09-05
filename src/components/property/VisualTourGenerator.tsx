'use client';

import { useState } from 'react';
import { Film, Loader2 } from 'lucide-react';
import { generateVisualTourAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VisualTourGeneratorProps {
  imageUrls: string[];
}

export default function VisualTourGenerator({ imageUrls }: VisualTourGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateTour = async () => {
    setIsLoading(true);
    setIsDialogOpen(true);

    try {
      const result = await generateVisualTourAction({ imageUrls });
      if (result.tourVideo) {
        setVideoData(result.tourVideo);
      } else {
        throw new Error('No video data returned from the tour generation.');
      }
    } catch (error) {
      console.error('Failed to generate visual tour:', error);
      toast({
        title: 'Tour Generation Failed',
        description: 'We couldn\'t create a visual tour at this time. Please try again later.',
        variant: 'destructive',
      });
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setVideoData(null);
  }

  return (
    <>
      <Button onClick={handleGenerateTour} disabled={isLoading} variant="secondary" size="sm">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Film className="mr-2 h-4 w-4" />
        )}
        Generate Visual Tour
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-headline">
                {videoData ? 'Your Visual Tour is Ready!' : 'Generating Visual Tour'}
            </DialogTitle>
            <DialogDescription>
                {videoData ? 'Enjoy this seamless video tour of the property.' : 'Our AI is crafting a video from the property photos. This may take up to a minute.'}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg mt-4">
            {isLoading && !videoData && (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <span>Processing...</span>
                </div>
            )}
            {videoData && (
              <video
                src={videoData}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

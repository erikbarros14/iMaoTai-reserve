'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { getRecommendationsAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  propertyDescription: string;
}

export default function AIAssistant({ propertyDescription }: AIAssistantProps) {
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRecommendations('');

    try {
      const result = await getRecommendationsAction({
        propertyDescription,
        userPreferences: preferences,
      });
      if (result.recommendations) {
        setRecommendations(result.recommendations);
      } else {
        throw new Error('No recommendations returned.');
      }
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch AI recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Travel Assistant
        </CardTitle>
        <CardDescription>
          Get personalized recommendations for activities and dining near this property.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Tell us your preferences (e.g., 'Looking for family-friendly activities and italian food')..."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Get Recommendations'
            )}
          </Button>
        </form>

        {recommendations && (
          <div className="mt-6 prose prose-sm max-w-none prose-headings:font-headline prose-p:text-foreground/90">
             <h4 className="font-headline text-lg">Here are your personalized recommendations:</h4>
            <div dangerouslySetInnerHTML={{ __html: recommendations.replace(/\n/g, '<br />') }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

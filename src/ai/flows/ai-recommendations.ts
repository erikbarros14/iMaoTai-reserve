'use server';

/**
 * @fileOverview AI-powered recommendations for nearby points of interest, activities, or dining options based on the property.
 *
 * - getRecommendations - A function that handles the recommendation process.
 * - RecommendationsInput - The input type for the getRecommendations function.
 * - RecommendationsOutput - The return type for the getRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendationsInputSchema = z.object({
  propertyDescription: z
    .string()
    .describe('The description of the property for which to generate recommendations.'),
  userPreferences: z
    .string()
    .optional()
    .describe('The user preferences to take into account when generating recommendations.'),
});
export type RecommendationsInput = z.infer<typeof RecommendationsInputSchema>;

const RecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of recommendations for nearby points of interest, activities, or dining options.'),
});
export type RecommendationsOutput = z.infer<typeof RecommendationsOutputSchema>;

export async function getRecommendations(input: RecommendationsInput): Promise<RecommendationsOutput> {
  return recommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendationsPrompt',
  input: {schema: RecommendationsInputSchema},
  output: {schema: RecommendationsOutputSchema},
  prompt: `You are a travel expert. Based on the property description and user preferences, provide a list of recommendations for nearby points of interest, activities, or dining options.

Property Description: {{{propertyDescription}}}
User Preferences: {{{userPreferences}}}

Recommendations:`,
});

const recommendationsFlow = ai.defineFlow(
  {
    name: 'recommendationsFlow',
    inputSchema: RecommendationsInputSchema,
    outputSchema: RecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

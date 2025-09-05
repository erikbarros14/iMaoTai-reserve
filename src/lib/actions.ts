'use server';

import { getRecommendations, RecommendationsInput } from '@/ai/flows/ai-recommendations';
import { generateVisualTour, VisualTourInput } from '@/ai/flows/visual-tour';
import { z } from 'zod';

const recommendationsSchema = z.object({
    propertyDescription: z.string(),
    userPreferences: z.string().optional(),
});

export async function getRecommendationsAction(input: RecommendationsInput) {
    const validatedInput = recommendationsSchema.safeParse(input);
    if(!validatedInput.success) {
        throw new Error("Invalid input for recommendations");
    }
    return await getRecommendations(validatedInput.data);
}

const visualTourSchema = z.object({
    imageUrls: z.array(z.string()),
});

export async function generateVisualTourAction(input: VisualTourInput) {
    const validatedInput = visualTourSchema.safeParse(input);
    if(!validatedInput.success) {
        throw new Error("Invalid input for visual tour");
    }
    return await generateVisualTour(validatedInput.data);
}

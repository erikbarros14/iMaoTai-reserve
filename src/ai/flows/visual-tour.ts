'use server';

/**
 * @fileOverview Generates a visual tour of a property from available images.
 *
 * - generateVisualTour - A function that generates the visual tour.
 * - VisualTourInput - The input type for the generateVisualTour function.
 * - VisualTourOutput - The return type for the generateVisualTour function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';
import {Readable} from 'stream';

const VisualTourInputSchema = z.object({
  imageUrls: z
    .array(z.string().describe('URL of the images of the property'))
    .describe('Array of image URLs to create the visual tour from.'),
});
export type VisualTourInput = z.infer<typeof VisualTourInputSchema>;

const VisualTourOutputSchema = z.object({
  tourVideo: z
    .string()
    .describe('The generated visual tour video in base64 data URI format.'),
});
export type VisualTourOutput = z.infer<typeof VisualTourOutputSchema>;

export async function generateVisualTour(input: VisualTourInput): Promise<VisualTourOutput> {
  return visualTourFlow(input);
}

const visualTourFlow = ai.defineFlow(
  {
    name: 'visualTourFlow',
    inputSchema: VisualTourInputSchema,
    outputSchema: VisualTourOutputSchema,
  },
  async input => {
    // Use the Veo model to generate a video from the given images.
    let {operation} = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: [
        {text: 'Create a seamless looping visual tour of the property.'},
        ...input.imageUrls.map(url => ({
          media: {
            url,
          },
        })),
      ],
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }

    return {
      tourVideo: await downloadVideoAsBase64(video),
    };
  }
);

async function downloadVideoAsBase64(video: any): Promise<string> {
  const fetch = (await import('node-fetch')).default;

  const videoDownloadResponse = await fetch(`${video.media!.url}&key=${process.env.GEMINI_API_KEY}`);
  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video');
  }
  const buffer = await videoDownloadResponse.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  return `data:video/mp4;base64,${base64}`;
}


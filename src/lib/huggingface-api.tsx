import { HfInference } from "@huggingface/inference";

export async function summarizeText(text: string) {
  const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);
 
  return await inference.summarization({
    model: 'facebook/bart-large-cnn',
    inputs: text,
    parameters: {
      max_length: 500
    }
  })

}
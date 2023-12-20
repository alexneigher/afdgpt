import { HfInference } from "@huggingface/inference";

export async function summarizeText(text: string) {
  const inference = new HfInference("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");
 
  return await inference.summarization({
    model: 'facebook/bart-large-cnn',
    inputs: text,
    parameters: {
      max_length: 500
    }
  })

}
import { z } from "zod";
import { summarizeText } from "~/lib/huggingface-api";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface SummaryObject {
  summary_text: string;
}

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      if (input.text) {
        const request = await fetch(input.text);

        const body = await request.text();

        const responseText = parseResponse(body);

        const summary: SummaryObject = (await summarizeText(
          responseText,
        )) as SummaryObject; //ask hugging for a summary

        return summary.summary_text;
      } else {
        return "";
      }
    }),
});

function parseResponse(text: string) {
  let content = "";
  const regex =
    /<!-- \/\/ CONTENT STARTS HERE -->\s*(.*?)\s*<!-- \/\/ CONTENT ENDS HERE -->/s;
  const match = text.match(regex);

  if (match && match[1]) {
    content = match[1];
    return content;
  } else {
    throw new Error("Could not parse response");
  }
}

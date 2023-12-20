import { z } from "zod";
import { dropdownOptions } from "~/lib/dropdown-options";
import { summarizeText } from "~/lib/huggingface-api";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface SummaryObject {
  summary_text: string;
}

export const postRouter = createTRPCRouter({
  summarize: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      if (input.text) {
        const request = await fetch(input.text);

        const body = await request.text();

        const responseText = parsedResponse(body);

        const summary: SummaryObject = (await summarizeText(
          responseText,
        )) as SummaryObject; //ask hugging for a summary

        return summary.summary_text;
      } else {
        return "";
      }
    }),
  getAfd: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const url = dropdownOptions.find((option) => option.name === input.id)
        ?.value;

      if (url == null) {
        return "";
      }

      const request = await fetch(url);
      const body = await request.text();
      const responseText = fullContent(body);
      return responseText;
    }),
});

function fullContent(text: string) {
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

function parsedResponse(text: string) {
  let content = "";
  const regex = /<pre.*?>([\s\S]*?)<\/pre>/i;
  const match = text.match(regex);

  if (match && match[1]) {
    content = match[1];
    return content;
  } else {
    throw new Error("Could not parse response");
  }
}

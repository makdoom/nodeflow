"use server";

import { geminiChannel } from "@/inngest/channels/gemini";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type GeminiRequestToken = Realtime.Token<
  typeof geminiChannel,
  ["status"]
>;

export const fetchGeminiRealtimeToken =
  async (): Promise<GeminiRequestToken> => {
    const token = await getSubscriptionToken(inngest, {
      channel: geminiChannel(),
      topics: ["status"],
    });

    return token;
  };

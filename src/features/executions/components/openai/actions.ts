"use server";

import { openaiChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type OpenaiRequestToken = Realtime.Token<
  typeof openaiChannel,
  ["status"]
>;

export const fetchOpenaiRealtimeToken =
  async (): Promise<OpenaiRequestToken> => {
    const token = await getSubscriptionToken(inngest, {
      channel: openaiChannel(),
      topics: ["status"],
    });

    return token;
  };

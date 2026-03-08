"use server";

import { httpRequestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type HttpRequestToken = Realtime.Token<
  typeof httpRequestChannel,
  ["status"]
>;

export const fetchHttpRequestRealtimeToken =
  async (): Promise<HttpRequestToken> => {
    const token = await getSubscriptionToken(inngest, {
      channel: httpRequestChannel(),
      topics: ["status"],
    });

    return token;
  };

"use server";

import { slackChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type slackRequestToken = Realtime.Token<typeof slackChannel, ["status"]>;

export const fetchSlackRealtimeToken = async (): Promise<slackRequestToken> => {
  const token = await getSubscriptionToken(inngest, {
    channel: slackChannel(),
    topics: ["status"],
  });

  return token;
};

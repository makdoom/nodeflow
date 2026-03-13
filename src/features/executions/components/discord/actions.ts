"use server";

import { discordChannel } from "@/inngest/channels/discord";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type discordRequestToken = Realtime.Token<
  typeof discordChannel,
  ["status"]
>;

export const fetchDiscordRealtimeToken =
  async (): Promise<discordRequestToken> => {
    const token = await getSubscriptionToken(inngest, {
      channel: discordChannel(),
      topics: ["status"],
    });

    return token;
  };

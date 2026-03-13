import { channel, topic } from "@inngest/realtime";

type StatusType = {
  nodeId: string;
  status: "loading" | "success" | "error";
};

export const DISCORD_CHANNEL_NAME = "discord-execution";

export const discordChannel = channel(DISCORD_CHANNEL_NAME).addTopic(
  topic("status").type<StatusType>(),
);

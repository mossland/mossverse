import * as discord from "discord.js";
export type DiscordEmbed = discord.APIEmbed;
export type DiscordMessage = discord.MessageOptions;
export type DiscordButton = discord.APIActionRowComponent<any>;
export type DiscordMember = discord.GuildMember;

export type DiscordBotInfo = {
  id: string;
  serverId: string;
  accessToken: string;
};
export type DiscordReactEventInfo = {
  id: string;
  messageId: string;
};

export type sendMessageWithEmbedType = {
  botId: string;
  channelId: string;
  message: string;
  embed: discord.APIEmbed;
  button?: DiscordButton[];
};

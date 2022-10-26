import * as discord from "discord.js";

export type DiscordToken = {
  token: string;
  serverId: string;
};

export type DiscordBot = {
  id: string;
  client: discord.Client;
  server: discord.Guild;
  serverId: string;
  token: string;
};

export const makeDiscordBot = async ({ token, serverId }: DiscordToken): Promise<DiscordBot> => {
  const client = new discord.Client({
    intents: [
      discord.IntentsBitField.Flags.Guilds,
      discord.IntentsBitField.Flags.GuildMessages,
      discord.IntentsBitField.Flags.GuildPresences,
      discord.IntentsBitField.Flags.GuildMembers,
      discord.IntentsBitField.Flags.GuildMessageReactions,
      discord.IntentsBitField.Flags.GuildIntegrations,
      discord.IntentsBitField.Flags.DirectMessages,
      discord.IntentsBitField.Flags.DirectMessageReactions,
      discord.IntentsBitField.Flags.DirectMessageTyping,
    ],
  });
  client.login(token);
  const server = client.guilds.cache.get(serverId);
  if (!server) throw new Error(`No Guild of Server in ${serverId}`);
  return new Promise((resolve, reject) => {
    client.on("ready", (client) => resolve({ client, token, id: client.user.id, server, serverId }));
    client.on("error", (error) => reject(error));
  });
};
export const makeDiscordBots = async (tokens: DiscordToken[]): Promise<Map<string, DiscordBot>> => {
  const bots = new Map<string, DiscordBot>();
  await Promise.all(
    tokens.map(async (token) => {
      const bot = await makeDiscordBot(token);
      bots.set(bot.id, bot);
    })
  );
  return bots;
};

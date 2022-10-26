import { Inject, Injectable } from "@nestjs/common";
import * as dto from "./discord.dto";
import * as discord from "discord.js";
import { ClientEvents, Awaitable } from "discord.js";
import { LogService, DiscordBot, DiscordToken, makeDiscordBot } from "@shared/util-server";
@Injectable()
export class DiscordService extends LogService {
  constructor(@Inject("DISCORD_BOTS") private bots: Map<string, DiscordBot>) {
    super(DiscordService.name);
  }
  async login(token: DiscordToken): Promise<DiscordBot> {
    const bot = await makeDiscordBot(token);
    this.bots.set(bot.id, bot);
    return bot;
  }
  async logout(botId: string) {
    this.bots.delete(botId);
  }
  bot(botId: string) {
    const bot = this.bots.get(botId);
    if (!bot) throw new Error(`No Bot Found for botId: ${botId}`);
    return bot;
  }
  async clientEvent<K extends keyof ClientEvents>(
    botId: string,
    event: K,
    listener: (...args: ClientEvents[K]) => Awaitable<void>
  ) {
    this.bot(botId).client.on(event, listener);
  }
  async fetchChannelMessage(botId: string, channelId: string) {
    const channel = this.bot(botId).client.channels.cache.get(channelId);
    return await (channel as discord.TextChannel).messages.fetch();
  }
  async onlineUsers(botId: string, filterBot = true) {
    await this.bot(botId).server.members.fetch();
    return this.bot(botId).server.members.cache.filter(
      (m) => !!(m.presence && (filterBot ? !m.user.bot : true) && m.presence.status === "online")
    );
  }
  async users(botId: string) {
    await this.bot(botId).server.members.fetch();
    return this.bot(botId).server.members.cache;
  }
  async findUser(botId: string, id: string) {
    return this.bot(botId).server.members.cache.get(id);
  }
  async banUser(botId: string, userId: string) {
    return this.bot(botId).server.members.ban(userId);
  }
  async sendMessage(botId: string, channelId: string, message: string) {
    return await (this.bot(botId).server.channels.cache.get(channelId) as discord.TextChannel).send(message);
  }
  async addRole(botId: string, userId: string, roleName: string) {
    const role = this.bot(botId).server.roles.cache.find((r) => r.id === roleName);
    const user = this.bot(botId).server.members.cache.get(userId);
    if (!role || !user) throw new Error("No Role or User");
    return await user.roles.add(role);
  }
  async removeRole(botId: string, userId: string, roleName: string) {
    const role = this.bot(botId).server.roles.cache.find((r) => r.id === roleName);
    const user = this.bot(botId).server.members.cache.get(userId);
    if (!role || !user) throw new Error("No Role or User");
    return await user.roles.remove(role);
  }
  async sendEmbed(botId: string, channelId: string, embed: discord.APIEmbed, button?: any[]) {
    const channel = this.bot(botId).server.channels.cache.get(channelId);
    return await (channel as discord.TextChannel).send({
      embeds: [embed],
      components: button,
    });
  }
  async sendMessageWithEmbed({ botId, channelId, message, embed, button }: dto.sendMessageWithEmbedType) {
    const channel = this.bot(botId).server.channels.cache.get(channelId);
    return await (channel as discord.TextChannel).send({
      content: message,
      embeds: [embed],
      components: button,
    });
  }
}

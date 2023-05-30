import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { LogService } from "@util/server";
import type { RedisClientType } from "redis";
@Injectable()
export class RtEmployee extends LogService implements OnModuleInit, OnModuleDestroy {
  private readonly rootKeys = ["world", "players"] as const;
  maxDigits = 13;
  constructor(@Inject("REDIS_CLIENT") private client: RedisClientType) {
    super(RtEmployee.name);
    this.client.on("error", (err) => this.logger.error("Redis Client Error", err));
  }
  async onModuleInit() {
    await Promise.all(this.rootKeys.map(async (key) => await this.client.del(key)));
  }
  async onModuleDestroy() {
    await this.client.disconnect();
  }
  async updatePlayer(mapId: string, id: string, score: string, data: string) {
    await Promise.all([
      this.client.hSet(`${mapId}:players`, id, data),
      this.client.zAdd(`${mapId}:lastConnected`, {
        score: new Date().getTime(),
        value: id,
      }),
      this.client.zAdd(`${mapId}:world`, { score: <any>score, value: id }),
    ]);
  }
  async expirePlayers(mapId: string, expireSeconds = 5) {
    const time = new Date();
    time.setSeconds(time.getSeconds() - expireSeconds);
    const playerIds = await this.client.zRangeByScore(`${mapId}:lastConnected`, 0, time.getTime());
    return await this.removePlayers(mapId, playerIds);
  }
  async removePlayers(mapId: string, playerIds: string | string[]) {
    if (!playerIds.length) return 0;
    await Promise.all([
      this.client.hDel(`${mapId}:players`, playerIds),
      this.client.zRem(`${mapId}:world`, playerIds),
      this.client.zRem(`${mapId}:lastConnected`, playerIds),
      this.client.hDel(`characters`, playerIds),
    ]);
    return playerIds.length;
  }
  async getRange(mapId: string, min: string, max: string) {
    const res = await this.client.zRangeByScore(`${mapId}:world`, min, max);
    return res.length ? await this.client.hmGet(`${mapId}:players`, res) : [];
  }
  async registerCharacter(id: string, data: string) {
    await this.client.hSet(`characters`, id, data);
    return true;
  }
  async characters(ids: string[]) {
    return ids.length ? await this.client.hmGet("characters", ids) : [];
  }
  convToScore(x: number, y: number, maxDigits: number) {
    const base = new Array(maxDigits).fill("0").join("");
    const [xbin, ybin] = [x.toString(2), y.toString(2)];
    const [xstr, ystr] = [base.substring(xbin.length) + xbin, base.substring(ybin.length) + ybin];
    return new Array(maxDigits)
      .fill(0)
      .map((_, idx) => xstr[idx] + ystr[idx])
      .join("");
  }
}

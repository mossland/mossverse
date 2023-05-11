import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { LogService } from "@shared/util-server";
import { Server, Socket } from "socket.io";
import { db, srv } from "..";
import { RtService } from "../rt/rt.service";
@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway extends LogService {
  @WebSocketServer()
  server: Server;

  constructor(private readonly rtService: RtService) {
    super(EventsGateway.name);
  }

  // @SubscribeMessage("events")
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(map((item) => ({ event: "events", data: item })));
  // }

  @SubscribeMessage("events")
  async events(client: Socket, data) {
    this.server.emit("events", data);
  }

  @SubscribeMessage("identity")
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage("player")
  async player(client: Socket, [mapId, id, position, data, min, max]: string[]) {
    await this.rtService.updatePlayer(mapId, id, position, data);
    const d = await this.rtService.getRange(mapId, min, max);
    client.emit("players", d);
  }

  @SubscribeMessage("register")
  async register(client: Socket, [id, data]: string[]) {
    return await this.rtService.registerCharacter(id, data);
  }

  @SubscribeMessage("characters")
  async characters(client: Socket, ids: string[]) {
    client.emit("characters", ids, await this.rtService.characters(ids));
  }

  @SubscribeMessage("adminEvent")
  async kicked(client: Socket, { event, id, roomId }: { event: "muted" | "kicked"; id: string; roomId?: string }) {
    // if (event === "kicked") {
    //   this.server.emit("adminEvent", { event, id, roomId });
    //   await this.rtService.removePlayers(id);
    // } else if (event === "muted") this.server.emit("adminEvent", { event, id, roomId });
  }

  @SubscribeMessage("chat")
  async chat(client: Socket, [roomId, data]: any) {
    if (roomId === "public") this.server.emit(`chat:${roomId}`, data);
    const sockets = this.server.of("/").in(roomId);
    return sockets.emit(`chat:${roomId}`, data);
  }
}

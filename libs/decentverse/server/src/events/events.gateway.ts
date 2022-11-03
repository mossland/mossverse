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
  async player(client: Socket, [id, position, data, min, max]: string[]) {
    await this.rtService.updatePlayer(id, position, data);
    const d = await this.rtService.getRange(min, max);
    client.emit("players", d);
  }

  @SubscribeMessage("register")
  async register(client: Socket, [id, data]: string[]) {
    return await this.rtService.registerCharacter(id, data);
  }

  @SubscribeMessage("characters")
  async chracters(client: Socket, ids: string[]) {
    client.emit("characters", ids, await this.rtService.characters(ids));
  }

  @SubscribeMessage("adminEvent")
  async kicked(client: Socket, { event, id, roomId }: { event: "muted" | "kicked"; id: string; roomId?: string }) {
    if (event === "kicked") {
      this.server.emit("adminEvent", { event, id, roomId });
      await this.rtService.removePlayers(id);
    } else if (event === "muted") this.server.emit("adminEvent", { event, id, roomId });
  }

  @SubscribeMessage("chat")
  async chat(client: Socket, [roomId, data]: any) {
    if (roomId === "public") this.server.emit(`chat:${roomId}`, data);
    const sockets = this.server.of("/").in(roomId);
    return sockets.emit(`chat:${roomId}`, data);
  }

  @SubscribeMessage("join")
  async join(client: Socket, { roomId, userId, nickName }: any) {
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    if (clients.length === 0) {
      this.logger.log("create Room");
      client.join(roomId);
      client.rooms.add(roomId);
    } else if (clients.length > 0) {
      this.logger.log("Ready");
      for (const client_ of clients) {
        client_.emit("init", client.id, client.data);
      }
      client.join(roomId);
    } else {
      client.rooms.clear();
      client.leave(roomId);
      client.emit("full");
    }

    client.on("disconnect", () => {
      this.logger.log("disconnect");
      this.server.to(roomId).emit(`disconnected:${userId}`);
    });
    client.on("leave", () => {
      this.logger.log("leave");
      this.server.to(roomId).emit(`disconnected:${userId}`);
      client.rooms.clear();
      client.leave(roomId);
      // client.off("leave");
    });
  }

  @SubscribeMessage("receive")
  async receive(client: Socket, { socketId, roomId, userId, nickName }: any) {
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    const receiver = clients.find((client) => client.id === socketId);
    receiver && receiver.emit("receive", client.id, client.data);
  }

  @SubscribeMessage("signal")
  async exchange(client: Socket, { socketId, desc, roomId, nickName, userId }: any) {
    // this.logger.log("SIGNAL", "receiver : ", socketId, "sender : ", userId, new Date());
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    const socket = clients.find((client) => client.id === socketId);
    if (!socket) return;
    socket.emit(`desc:${userId}`, { desc, userId });
  }

  @SubscribeMessage("leave")
  async leave(client: Socket) {
    this.logger.log("leave");
    const roomId = client.rooms.values()[0];
    if (roomId) this.server.to(roomId).emit(`disconnected:${client.id}`);
    client.rooms.clear();
    client.leave(roomId);
  }
}

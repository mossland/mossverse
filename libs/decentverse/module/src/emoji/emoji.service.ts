import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Emoji from "./emoji.model";
import * as db from "../db";
import * as gql from "../gql";
import * as srv from "../srv";
import { LoadService } from "@shared/util-server";

@Injectable()
export class EmojiService extends LoadService<Emoji.Mdl, Emoji.Doc, Emoji.Input> {
  constructor(@InjectModel(Emoji.name) private readonly Emoji: Emoji.Mdl) {
    super(EmojiService.name, Emoji);
  }
}

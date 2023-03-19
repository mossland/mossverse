import { TeleportSummary } from "../teleport/teleport.gql";
import { TileSummary } from "../tile/tile.gql";
import { LiveSummary } from "../live/live.gql";
import { CollisionSummary } from "../collision/collision.gql";
import { PlacementSummary } from "../placement/placement.gql";
import { WebviewSummary } from "../webview/webview.gql";
import { CallRoomSummary } from "../callRoom/callRoom.gql";
import { AssetSummary } from "../asset/asset.gql";
import { CharacterSummary } from "../character/character.gql";
import { DialogSummary } from "../dialog/dialog.gql";
import { MapSummary } from "../map/map.gql";
import { RoleSummary } from "../role/role.gql";
import { DecentverseUserSummary } from "../user/user.gql";
import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, mixInputType, mixObjectType, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst } from "@shared/util";
import { gql as shared } from "@shared/module";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {}

interface Base
  extends AssetSummary,
    CharacterSummary,
    DialogSummary,
    MapSummary,
    RoleSummary,
    DecentverseUserSummary,
    CallRoomSummary,
    WebviewSummary,
    PlacementSummary,
    CollisionSummary,
    LiveSummary,
    TileSummary,
    TeleportSummary {}
export const childSummaries = [
  TeleportSummary,
  TileSummary,
  LiveSummary,
  CollisionSummary,
  PlacementSummary,
  WebviewSummary,
  CallRoomSummary,
  AssetSummary,
  CharacterSummary,
  DialogSummary,
  MapSummary,
  RoleSummary,
  DecentverseUserSummary,
  //
];
childSummaries.map((model) => mixObjectType(Base, model));

export type DecentverseSummaryInput = Base;
export type DecentverseSummary = Tail & Base;

// * 최종 생성 모델
export class SummaryInput {}
export interface SummaryInput extends shared.SummaryInput, InputOverwrite, Base {}
mixInputType(shared.SummaryInput, IntersectionType(InputOverwrite, Base, InputType));

export class Summary {}
export interface Summary extends shared.Summary, Base, Tail {}
mixObjectType(shared.Summary, IntersectionType(Base, Tail));

@Schema()
export class SummarySchema extends Tail {}

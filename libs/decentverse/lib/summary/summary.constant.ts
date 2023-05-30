import { AssetSummary } from "../asset/asset.constant";
import { CallRoomSummary } from "../callRoom/callRoom.constant";
import { CharacterSummary } from "../character/character.constant";
import { CollisionSummary } from "../collision/collision.constant";
import { DecentverseUserSummary } from "../user/user.constant";
import { DialogSummary } from "../dialog/dialog.constant";
import { InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { LiveSummary } from "../live/live.constant";
import { MapSummary } from "../map/map.constant";
import { PlacementSummary } from "../placement/placement.constant";
import { RoleSummary } from "../role/role.constant";
import { Schema } from "@nestjs/mongoose";
import { TeleportSummary } from "../teleport/teleport.constant";
import { TileSummary } from "../tile/tile.constant";
import { WebviewSummary } from "../webview/webview.constant";
import { mixInputType, mixObjectType } from "@util/server";
import { cnst as shared } from "@shared/server";

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
    TeleportSummary,
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
    TileSummary {}
export const childSummaries = [
  TileSummary,
  LiveSummary,
  CollisionSummary,
  PlacementSummary,
  WebviewSummary,
  CallRoomSummary,
  AssetSummary,
  CharacterSummary,
  TeleportSummary,
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

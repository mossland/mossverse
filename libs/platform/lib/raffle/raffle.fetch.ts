import { BaseGql, Field, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";
import { Dayjs } from "dayjs";
import { Entry, PriceTag } from "../_platform/platform.fetch";
import { fetch as shared } from "@shared/client";
// import { User } from "@shared/db";

@InputType("RaffleInput")
export class RaffleInput {
  @Field(() => String)
  type: cnst.RaffleType;

  @Field(() => shared.Token, { nullable: true })
  token: shared.Token | shared.LightToken | null;

  @Field(() => shared.Thing, { nullable: true })
  thing: shared.Thing | shared.LightThing | null;

  @Field(() => shared.Product, { nullable: true })
  product: shared.Product | shared.LightProduct | null;

  @Field(() => Int, { nullable: true, default: 0 })
  entryLimit: number;

  @Field(() => [String])
  tags: string[];

  @Field(() => Date, { nullable: true })
  startAt?: Dayjs;

  @Field(() => Date)
  closeAt: Dayjs;

  @Field(() => Date)
  announceAt: Dayjs;

  @Field(() => [PriceTag])
  priceTags: PriceTag[];

  @Field(() => [shared.User])
  winners: shared.User[];

  @Field(() => Int)
  totalRaffleNum: number;
}

@ObjectType("Raffle", { _id: "id" })
export class Raffle extends BaseGql(RaffleInput) {
  @Field(() => String)
  status: cnst.RaffleStatus;
  @Field(() => [Entry])
  entries: Entry[];
  getName() {
    if (this.token?.meta?.name) return this.token.meta.name;
    if (this.thing?.name) return this.thing.name;
    if (this.product?.name) return this.product.name;
    else return `Unknown ${this.token ? `#${this.token.tokenId}` : ""}`;
  }

  getImage() {
    if (this.token?.image) return this.token.image;
    if (this.thing?.image) return this.thing.image;
    if (this.product?.image) return this.product.image;
    else return null;
  }
  getImageUrl() {
    if (this.token?.image?.url) return this.token.image.url;
    if (this.thing?.image?.url) return this.thing.image.url;
    if (this.product?.image?.url) return this.product.image.url;
    else return "";
  }
  getDescription() {
    if (this.token?.meta?.description) return this.token.meta.description;
    if (this.thing?.description) return this.thing.description;
    if (this.product?.description) return this.product.description;
    else return "";
  }
  getRemainCloseTime() {
    const remain = new Date(this.closeAt.toDate().getTime() - Date.now());
    const hour = remain.getHours();
    const min = remain.getMinutes();
    const sec = remain.getSeconds();
    return `${remain.getDate()} Days ${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}:${
      sec < 10 ? "0" + sec : sec
    }`;
  }

  entryNum(userId: string) {
    return this.entries.find((e) => e.user.id === userId)?.value;
  }

  isPicked(userId?: string) {
    return userId && this.winners.every((e) => e.id === userId);
  }
}

@ObjectType("LightRaffle", { _id: "id", gqlRef: "Raffle" })
export class LightRaffle extends PickType(Raffle, [
  "type",
  "status",
  "thing",
  "token",
  "entryLimit",
  "product",
  "announceAt",
  "closeAt",
  "priceTags",
  "totalRaffleNum",
  "entries",
] as const) {}

@ObjectType("RaffleSummary")
export class RaffleSummary {
  @Field(() => Int)
  totalRaffle: number;
}

export const raffleQueryMap = {
  totalRaffle: { status: { $ne: "inactive" } },
};

export const raffleGraphQL = createGraphQL("raffle" as const, Raffle, RaffleInput, LightRaffle);
export const {
  getRaffle,
  listRaffle,
  raffleCount,
  raffleExists,
  createRaffle,
  updateRaffle,
  removeRaffle,
  raffleFragment,
  lightRaffleFragment,
  purifyRaffle,
  crystalizeRaffle,
  lightCrystalizeRaffle,
  defaultRaffle,
  mergeRaffle,
  initRaffle,
  viewRaffle,
  editRaffle,
} = raffleGraphQL;

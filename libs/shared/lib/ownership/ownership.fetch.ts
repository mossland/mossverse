import { BaseGql, Field, Float, ID, InputType, Int, ObjectType, PickType, cnst, createGraphQL } from "@util/client";
import { Thing } from "../thing/thing.fetch";
import { Token } from "../token/token.fetch";

@InputType("OwnershipInput")
export class OwnershipInput {
  @Field(() => String)
  type: cnst.OwnershipType;

  @Field(() => ID, { nullable: true })
  user: string | null;

  @Field(() => ID, { nullable: true })
  wallet: string | null;

  @Field(() => ID, { nullable: true })
  contract: string | null;

  @Field(() => Token, { nullable: true })
  token: Token | null;

  @Field(() => Thing, { nullable: true })
  thing: Thing | null;

  @Field(() => Float)
  value: number;
}

@ObjectType("Ownership", { _id: "id" })
export class Ownership extends BaseGql(OwnershipInput) {
  @Field(() => Int)
  reservedValue: number;

  @Field(() => Int)
  credit: number;

  @Field(() => Int)
  bn: number;

  @Field(() => String)
  purpose: cnst.ThingPurpose;

  @Field(() => String)
  status: cnst.OwnershipStatus;

  has(value?: number) {
    return this.value ? (value ? this.value >= value : this.value > 0) : true;
  }
  static getByName(ownershipList: LightOwnership[], name: string) {
    return ownershipList.find((o) => o.thing?.name === name || o.token?.meta?.name === name) ?? null;
  }
  static getValue(ownershipList: LightOwnership[], name: string) {
    return this.getByName(ownershipList, name)?.value || 0;
  }
  static getCredit(ownershipList: LightOwnership[], name: string) {
    return this.getByName(ownershipList, name)?.credit || 0;
  }

  getName() {
    return (
      (this.type === "thing" && (this.thing?.name ?? "Unknown")) ||
      (this.type === "token" && (this.token?.meta?.name ?? `Unknown #${this.token?.tokenId}`))
    );
  }

  getImageUrl() {
    return (this.thing?.image.url ?? "") || (this.token?.image?.url ?? "");
  }

  getImage() {
    return (this.thing?.image ?? null) || (this.token?.image?.url ?? null);
  }

  isRemain() {
    return this.value - this.reservedValue > 0;
  }
}

@ObjectType("LightOwnership", { _id: "id", gqlRef: "Ownership" })
export class LightOwnership extends PickType(Ownership, [
  "thing",
  "token",
  "value",
  "reservedValue",
  "credit",
  "status",
  "type",
] as const) {}

@ObjectType("OwnershipSummary")
export class OwnershipSummary {
  @Field(() => Int)
  totalOwnership: number;
}

export const ownershipQueryMap = {
  totalOwnership: { status: { $ne: "inactive" } },
};

export const ownershipGraphQL = createGraphQL("ownership" as const, Ownership, OwnershipInput, LightOwnership);
export const {
  getOwnership,
  listOwnership,
  ownershipCount,
  ownershipExists,
  createOwnership,
  updateOwnership,
  removeOwnership,
  ownershipFragment,
  lightOwnershipFragment,
  purifyOwnership,
  crystalizeOwnership,
  lightCrystalizeOwnership,
  defaultOwnership,
  mergeOwnership,
  initOwnership,
  viewOwnership,
  editOwnership,
} = ownershipGraphQL;

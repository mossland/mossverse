import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  Field,
  InputType,
  ObjectType,
  BaseGql,
  Int,
  Float,
  PickType,
  SliceModel,
  mutate,
  InputOf,
  query,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";

@InputType("ShipInfoInput")
export class ShipInfoInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  address: string;

  @Field(() => shared.User)
  user: shared.User | shared.LightUser;

  @Field(() => shared.Product)
  product: shared.Product | shared.LightProduct;

  @Field(() => String, { nullable: true })
  siteName: string | null;

  @Field(() => String, { nullable: true })
  zipcode: string | null;

  @Field(() => String, { nullable: true })
  message: string | null;
}

@ObjectType("ShipInfo", { _id: "id" })
export class ShipInfo extends BaseGql(ShipInfoInput) {
  @Field(() => String)
  status: cnst.ShipInfoStatus;
}

@ObjectType("LightShipInfo", { _id: "id", gqlRef: "ShipInfo" })
export class LightShipInfo extends PickType(ShipInfo, ["status", "product", "user"] as const) {}

@ObjectType("ShipInfoSummary")
export class ShipInfoSummary {
  @Field(() => Int)
  totalShipInfo: number;
}

export const shipInfoQueryMap: { [key in keyof ShipInfoSummary]: any } = {
  totalShipInfo: { status: { $ne: "inactive" } },
};

export const shipInfoGraphQL = createGraphQL("shipInfo" as const, ShipInfo, ShipInfoInput, LightShipInfo);
export const {
  getShipInfo,
  listShipInfo,
  shipInfoCount,
  shipInfoExists,
  createShipInfo,
  updateShipInfo,
  removeShipInfo,
  shipInfoFragment,
  lightShipInfoFragment,
  purifyShipInfo,
  crystalizeShipInfo,
  lightCrystalizeShipInfo,
  defaultShipInfo,
  mergeShipInfo,
} = shipInfoGraphQL;

export type GetMyShipInfoMutation = { getMyShipInfo: ShipInfo };
export const getMyShipInfoMutation = graphql`
  ${shipInfoFragment}
  query getMyShipInfo($userId: ID!, $productId: ID!) {
    getMyShipInfo(userId: $userId, productId: $productId) {
      ...shipInfoFragment
    }
  }
`;

export const getMyShipInfo = async (userId: string, productId: string) =>
  (await query<GetMyShipInfoMutation>(getMyShipInfoMutation, { userId, productId })).getMyShipInfo;

export type AddWinnerShipInfoMutation = { addWinnerShipInfo: ShipInfo };
export const addWinnerShipInfoMutation = graphql`
  ${shipInfoFragment}
  mutation addWinnerShipInfo($raffleId: ID!, $shipInfo: ShipInfoInput!) {
    addWinnerShipInfo(raffleId: $raffleId, shipInfo: $shipInfo) {
      ...shipInfoFragment
    }
  }
`;

export const addWinnerShipInfo = async (raffleId: string, shipInfo: InputOf<ShipInfoInput>) =>
  (await mutate<AddWinnerShipInfoMutation>(addWinnerShipInfoMutation, { raffleId, shipInfo })).addWinnerShipInfo;

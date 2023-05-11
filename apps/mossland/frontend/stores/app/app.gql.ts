import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { mutate, query, InputOf } from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { gql as platform } from "@platform/data-access";

export type TradeSkinMutation = { tradeSkin: platform.Trade };
export const tradeSkinMutation = graphql`
  ${platform.tradeFragment}
  mutation tradeSkin($characterId: ID!, $data: TradeInput!) {
    tradeSkin(characterId: $characterId, data: $data) {
      ...tradeFragment
    }
  }
`;
export const tradeSkin = async (characterId: string, data: InputOf<platform.TradeInput>) =>
  (await mutate<TradeSkinMutation>(tradeSkinMutation, { characterId, data })).tradeSkin;

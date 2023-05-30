import { InputOf, graphql, mutate } from "@util/client";
import { fetch as platform } from "@platform/client";

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

import { gql } from "@platform/data-access";
import { BiRightArrowAlt } from "react-icons/bi";

type ExchangeFlowType = {
  input: gql.Exchange;
  output: gql.Exchange;
};

export const ExchangeFlow = ({ input, output }: ExchangeFlowType) => {
  return (
    <>
      {input &&
        (input.type === "etc" ? (
          <>
            <img src="/images/m_coin.png" />
            MOC
          </>
        ) : input.type === "thing" ? (
          <>
            <img src={input.thing?.image.url} />
            {input.thing?.name}
          </>
        ) : input && input.type === "token" ? (
          <>
            <img src={(input && input.token && input.token.meta && input.token?.meta.image) ?? ""} />
            {input.token?.meta?.name}
          </>
        ) : (
          <></>
        ))}
      <BiRightArrowAlt />
      {output &&
        (output.type === "etc" ? (
          <>
            <img src="/images/m_coin.png" />
            MOC
          </>
        ) : output.type === "thing" ? (
          <>
            <img src={output.thing?.image.url} />
            {output.thing?.name}
          </>
        ) : output && output.type === "token" ? (
          <>
            <img src={(output && output.token && output.token.meta && output.token.meta.image) ?? ""} />
            {output.token?.meta?.name}
          </>
        ) : (
          <></>
        ))}
    </>
  );
};

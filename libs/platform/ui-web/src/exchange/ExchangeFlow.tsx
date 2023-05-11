import { gql } from "@platform/data-access";
import Image from "next/legacy/image";
import { BiRightArrowAlt } from "react-icons/bi";

type ExchangeFlowType = {
  input: gql.Exchange;
  output: gql.Exchange;
};

export const ExchangeFlow = ({ input, output }: ExchangeFlowType) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {input &&
        (input.type === "currency" ? (
          <div className="flex items-center justify-center">
            <div className="flex mr-2 ">
              <Image width={20} height={20} src="/images/m_coin.png" />
            </div>
            <div className="text-black text-[18px]">MOC</div>
          </div>
        ) : input.type === "thing" ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center mr-2 ">
              <Image width={20} height={20} src={input.thing?.image.url ?? ""} />
            </div>
            <div className="text-black text-[18px]">{input.thing?.name}</div>
          </div>
        ) : input && input.type === "token" ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center mr-2 ">
              <Image
                width={20}
                height={20}
                src={(input && input.token && input.token.meta && input.token?.meta.image) ?? ""}
              />
            </div>
            <div className="text-black text-[18px]">{input.token?.meta?.name}</div>
          </div>
        ) : (
          <></>
        ))}
      <BiRightArrowAlt />
      {output &&
        (output.type === "currency" ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center mr-2 ">
              <Image className="w-[3px] h-[3px]" width={16} height={16} src="/images/m_coin.png" />
            </div>
            <div className="text-black text-[18px]">MOC</div>
          </div>
        ) : output.type === "thing" ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center mr-2 ">
              <Image className="w-[3px] h-[3px]" width={16} height={16} src={output.thing?.image.url ?? ""} />
            </div>
            <div className="text-black text-[18px]">{output.thing?.name}</div>
          </div>
        ) : output && output.type === "token" ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center mr-2 ">
              <Image
                className="w-[3px] h-[3px]"
                width={16}
                height={16}
                src={(output && output.token && output.token.meta && output.token.meta.image) ?? ""}
              />
            </div>
            <div className="text-black text-[18px]">{output.token?.meta?.name}</div>
          </div>
        ) : (
          <></>
        ))}
    </div>
  );
};

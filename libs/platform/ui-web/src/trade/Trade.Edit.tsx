import { Input } from "antd";
import { gql, st, slice, useLocale } from "@platform/data-access";
import { Editor, OnlyAdmin } from "@shared/ui-web";

interface TradeEditProps {
  tradeId?: string | null;
  slice?: slice.TradeSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const TradeEdit = ({ slice = st.slice.trade, tradeId = undefined }: TradeEditProps) => {
  const tradeForm = slice.use.tradeForm();
  const { l } = useLocale();
  return (
    <>
      <div className="flex items-center mb-4">
        {/* <p className="w-20 mt-3">{l("trade.field")}</p> */}
        {/* <Input value={tradeForm.field} onChange={(e) => slice.do.setFieldOnTrade(e.target.value)} /> */}
      </div>
    </>
  );
};

interface TradeEditInInputProps {
  slice?: slice.TradeSlice;
  input: gql.Exchange;
  idx: number;
}

export const TradeEditInInput = ({ slice = st.slice.trade, input, idx }: TradeEditInInputProps) => {
  // const tradeForm = slice.use.tradeForm();
  const { l } = useLocale();
  return (
    <>
      <div className="flex items-center mb-4">
        <p className="w-20 mt-3">가격</p>
        <input
          className="input input-bordered"
          value={input.value}
          onChange={(e) => slice.do.writeOnTrade(`input.${idx}.value`, Number(e.target.value))}
        />
      </div>
    </>
  );
};
interface TradeEditInOutputProps {
  slice?: slice.TradeSlice;
  // output: gql.ExchangeInput;
  idx: number;
}

export const TradeEditInOutput = ({ slice = st.slice.trade, idx }: TradeEditInOutputProps) => {
  const tradeForm = slice.use.tradeForm();
  const { l } = useLocale();
  return (
    <div className="flex items-center mb-4">
      <p className="w-20 mt-3">가격</p>
      <input
        type="number"
        value={tradeForm.outputs[idx]?.value ?? 0}
        onChange={(e) => {
          const value = Number(e.target.value);
          slice.do.writeOnTrade(`outputs.${idx}.value`, value);
        }}
      />
    </div>
  );
};
// export const TradeEditInOutput = ({ slice = st.slice.trade, tradeId = undefined }: TradeEditProps) => {
//   const tradeForm = slice.use.tradeForm();
//   const { l } = useLocale();
//   return (
//     <>
//       <div className="flex items-center mb-4">
//         <p className="w-20 mt-3">{l("trade.field")}</p>
//         <Input value={tradeForm.} onChange={(e) => slice.do.setFieldOnTrade(e.target.value)} />
//       </div>
//     </>
//   );
// };

TradeEdit.Input = TradeEditInInput;
TradeEdit.Output = TradeEditInOutput;

import { fetch, usePage } from "@platform/client";
import dayjs from "dayjs";

interface GeneralProps {
  className?: string;
  receipt: fetch.Receipt;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const General = ({ className, receipt }: GeneralProps) => {
  const { l } = usePage();
  return (
    <div className={className}>
      <div className="flex">
        <div className="inline-block w-16 mr-2 font-bold text-right">Name</div>
        <div className="flex-1">{receipt.name}</div>
      </div>
      <div>
        <span className="inline-block w-16 mr-2 font-bold text-right">User</span> {receipt.from?.nickname}
      </div>
      {receipt.fromWallet && (
        <div>
          <span className="inline-block w-16 mr-2 font-bold text-right">Wallet</span>
          {receipt.fromWallet.address}
        </div>
      )}
      <div>
        <span className="inline-block w-16 mr-2 font-bold text-right">At</span>
        {dayjs(receipt.createdAt).format("YYYY-MM-DD HH:mm")}
      </div>
      <div className="block w-16 mr-2 font-bold text-right">Inputs</div>
      {receipt.inputs.map((input, idx) => (
        <div key={idx} className="ml-16">
          {input.thing
            ? `- ${input.thing.name} x ${input.value}`
            : input.currency
            ? `- ${input.value}${input.currency.name}`
            : null}
        </div>
      ))}
      <div className="block w-16 mr-2 font-bold text-right">Outputs</div>
      {receipt.outputs.map((output, idx) => (
        <div key={idx} className="ml-16">
          {output.thing
            ? `- ${output.thing.name} x ${output.value}`
            : output.currency
            ? `- ${output.value}${output.currency.name}`
            : null}
        </div>
      ))}
      <div>
        <span className="inline-block w-16 mr-2 font-bold text-right">Status</span> {receipt.status}
      </div>
    </div>
  );
};

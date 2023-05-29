"use client";
import { st, usePage } from "@shared/client";

interface WalletEditProps {
  walletId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ walletId = undefined }: WalletEditProps) => {
  const walletForm = st.use.walletForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      <p className="w-20 mt-3">{l("wallet.id")}</p>
      <input
        className="input input-bordered w-full"
        value={walletForm.address}
        onChange={(e) => st.do.setAddressOnWallet(e.target.value)}
      />
    </div>
  );
};

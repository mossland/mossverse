import { CopyToClipboard } from "react-copy-to-clipboard";
import { BiCopyAlt } from "react-icons/bi";

type CopyAddressButtonProps = {
  address: string;
  onClick: (text: string) => void;
  type: "defaultButton" | "icon";
};

export const CopyAddressButton = ({ address, onClick }: CopyAddressButtonProps) => {
  return (
    <CopyToClipboard text={address} onCopy={(text: any) => onClick(text)}>
      <div className="bg-color-main w-[44px] flex items-center justify-center cursor-pointer transition duration-500 rounded-br-[6px] rounded-tr-[6px] hover:bg-opacity-80">
        <BiCopyAlt />
      </div>
    </CopyToClipboard>
  );
};

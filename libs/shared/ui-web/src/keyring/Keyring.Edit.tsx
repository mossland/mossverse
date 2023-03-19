import { Input } from "antd";
import { gql, st, slice, useLocale } from "@shared/data-access";
import { Editor, OnlyAdmin } from "@shared/ui-web";

interface KeyringEditProps {
  keyringId?: string | null;
  slice?: slice.KeyringSlice;
}
export const KeyringEdit = ({ slice = st.slice.keyring, keyringId = undefined }: KeyringEditProps) => {
  const keyringForm = slice.use.keyringForm();
  const { l } = useLocale();
  return (
    <>
      <div className="flex items-center mb-4">
        <p className="w-20 mt-3">{l("keyring.id")}</p>
        {/* <Input value={keyringForm.field} onChange={(e) => slice.do.setFieldOnKeyring(e.target.value)} /> */}
      </div>
    </>
  );
};

"use client";
import { st, usePage } from "@shared/client";

interface KeyringEditProps {
  keyringId?: string | null;
}
export const General = ({ keyringId = undefined }: KeyringEditProps) => {
  const keyringForm = st.use.keyringForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      <p className="w-20 mt-3">{l("keyring.id")}</p>
      {/* <Input value={keyringForm.field} onChange={(e) => slice.do.setFieldOnKeyring(e.target.value)} /> */}
    </div>
  );
};

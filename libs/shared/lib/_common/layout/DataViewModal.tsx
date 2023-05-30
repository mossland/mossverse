"use client";
import { DataAction, Slice, Utils } from "@util/client";
import { Field, Modal, st } from "@shared/client";
import React, { ReactNode } from "react";

export interface DataViewModalProps<T extends string, State, SL extends Slice<T, State>, M extends { id: string }> {
  sliceName: string;
  renderTitle: string | ((form: M) => string);
  actions?: DataAction<M>[] | ((model: M) => DataAction<M>[]);
  hideActions?: boolean;
  children?: ReactNode;
}

export const DataViewModal = <T extends string, State, SL extends Slice<T, State>, M extends { id: string }>({
  sliceName,
  children,
  actions = [],
  hideActions,
  renderTitle,
}: DataViewModalProps<T, State, SL, M>) => {
  const [modelName, className] = [sliceName, Utils.capitalize(sliceName)];
  const model = st.slice[sliceName].use[`${modelName}` as any]();
  const modelModal = st.slice[sliceName].use[`${modelName}Modal` as any]();
  return (
    <Modal
      width="80%"
      title={`${typeof renderTitle === "string" ? renderTitle : renderTitle(model)}`}
      open={modelModal === "view"}
      onCancel={() => st.slice[sliceName].do[`reset${className}` as any]()}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <Field.Container>{children}</Field.Container>
    </Modal>
  );
};

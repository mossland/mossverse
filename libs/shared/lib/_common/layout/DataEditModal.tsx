"use client";
import { AiOutlineSend } from "react-icons/ai";
import { CreateOption, DefaultOf, Slice, Utils } from "@util/client";
import { Modal, Skeleton, st } from "@shared/client";
import { twMerge } from "tailwind-merge";
import React, { ReactNode, useCallback, useEffect } from "react";

export interface DataEditModalProps<T extends string, State, SL extends Slice<T, State>, M extends { id: string }> {
  type?: "modal" | "form" | "empty";
  sliceName: string;
  id?: string;
  className?: string;
  renderTitle?: (form: DefaultOf<M>) => ReactNode;
  children?: ReactNode | ReactNode[];
  submitOption?: CreateOption;
  renderSubmit?:
    | ((item: M, modelSubmit: { loading: boolean; disabled: boolean }) => ReactNode)
    | ((item: M, modelSubmit: { loading: boolean; disabled: boolean }) => ReactNode[])
    | ReactNode;
  open?: boolean;
  renderCancel?: ReactNode | ReactNode[];
  onSubmit?: (form?: any) => any;
  onCancel?: (form?: any) => any;
}

export default function DataEditModal<T extends string, State, SL extends Slice<T, State>, M extends { id: string }>({
  type = "modal",
  sliceName,
  id,
  children,
  className,
  renderTitle,
  submitOption,
  renderSubmit,
  renderCancel,
  open,
  onSubmit,
  onCancel,
}: DataEditModalProps<T, State, SL, M>) {
  const [modelName, modelClassName] = [sliceName, Utils.capitalize(sliceName)];
  const modelModal = st.slice[sliceName].use[`${modelName}Modal` as any]();
  const modelForm = st.slice[sliceName].use[`${modelName}Form` as any]();
  const modelSubmit = st.slice[sliceName].use[`${modelName}Submit` as any]();
  useEffect(() => {
    if (!modelModal) return;
    st.slice[sliceName].do[`check${modelClassName}Submitable` as any]();
  }, [modelModal, modelForm]);
  const handleSubmit = useCallback(async () => {
    await st.slice[sliceName].do[`submit${modelClassName}` as any](submitOption);
    onSubmit?.(modelForm);
  }, []);
  const handleCancel = useCallback(async () => {
    await st.slice[sliceName].do[`reset${modelClassName}` as any]();
    onCancel?.(modelForm);
  }, []);
  const formReady = !id || id === modelForm.id;
  if (type === "modal")
    return (
      <Modal
        width="80%"
        title={
          renderTitle
            ? renderTitle(modelForm)
            : !modelForm.id?.length
            ? `New ${st.slice[sliceName].refName}`
            : `${st.slice[sliceName].refName} - ${modelForm.id}`
        }
        open={open ?? modelModal === "edit"}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okButtonProps={modelSubmit}
      >
        <div className={twMerge("w-full", className)}>{formReady ? children : <Skeleton active />}</div>
      </Modal>
    );
  else if (type === "form")
    return (
      <div className={twMerge("w-full", className)}>
        {renderTitle?.(modelForm)}
        {formReady ? children : <Skeleton active />}
        <div className="flex justify-center mt-4">
          {renderSubmit === undefined ? (
            <button className="gap-2 mr-2 btn btn-primary" disabled={modelSubmit.disabled} onClick={handleSubmit}>
              <AiOutlineSend />
              Submit
            </button>
          ) : (
            typeof renderSubmit === "function" && renderSubmit(modelForm, modelSubmit)
          )}
          {renderCancel === undefined ? (
            <button className="border-dashed btn btn-outline" onClick={handleCancel}>
              Cancel
            </button>
          ) : (
            renderCancel
          )}
        </div>
      </div>
    );
  else return <div>{children}</div>;
}

import React, { MutableRefObject, ReactNode, Suspense, useCallback, useEffect, useMemo } from "react";
import { Modal, Skeleton } from "antd";
import { Field } from "@shared/ui-web";
import { CreateOption, DefaultOf, Slice, SliceModel } from "@shared/util-client";
import { SendOutlined } from "@ant-design/icons";
import { Utils } from "@shared/util";
import { twMerge } from "tailwind-merge";

interface DataEditModalProps<T extends string, State, SL extends Slice<T, State>, M extends { id: string }> {
  type?: "modal" | "form" | "empty";
  slice: SL;
  id?: string;
  className?: string;
  renderTitle?: (form: DefaultOf<M>) => ReactNode;
  children?: ReactNode | ReactNode[];
  submitStyle?: string;
  cancelStyle?: string;
  submitOption?: CreateOption;
  renderSubmit?:
    | ((item: M, modelSubmit: { loading: boolean; disabled: boolean }) => ReactNode)
    | ((item: M, modelSubmit: { loading: boolean; disabled: boolean }) => ReactNode[])
    | ReactNode;
  renderCancel?: ReactNode | ReactNode[];
  onSubmit?: (form?: any) => any;
  onCancel?: (form?: any) => any;
}

export const DataEditModal = <T extends string, State, SL extends Slice<T, State>, M extends { id: string }>({
  type = "modal",
  slice,
  id,
  children,
  className,
  renderTitle,
  submitStyle,
  cancelStyle,
  submitOption,
  renderSubmit,
  renderCancel,
  onSubmit,
  onCancel,
}: DataEditModalProps<T, State, SL, M>) => {
  const [modelName, modelClassName] = [slice.refName, Utils.capitalize(slice.refName)];
  const modelModal = slice.use[`${modelName}Modal` as any]();
  const modelForm = slice.use[`${modelName}Form` as any]();
  const modelSubmit = slice.use[`${modelName}Submit` as any]();
  useEffect(() => {
    slice.do[`check${modelClassName}Submitable` as any]();
  }, [modelForm]);
  const handleSubmit = useCallback(async () => {
    await slice.do[`submit${modelClassName}` as any](submitOption);
    onSubmit?.(modelForm);
  }, []);
  const handleCancel = useCallback(async () => {
    await slice.do[`reset${modelClassName}` as any]();
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
            ? `New ${slice.refName}`
            : `${slice.refName} - ${modelForm.id}`
        }
        open={modelModal === "edit"}
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
            <button className="gap-2 mr-2 btn btn-primary" {...modelSubmit} onClick={handleSubmit}>
              <SendOutlined />
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
};

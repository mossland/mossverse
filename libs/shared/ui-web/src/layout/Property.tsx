import { Utils } from "@shared/util";
import { FieldMeta, getClassMeta, getFieldMetas, Slice } from "@shared/util-client";
import { Skeleton, Typography } from "antd";
import { useCallback, useMemo } from "react";
import { RecentTime } from "../Recent";

interface PropertyProps {
  label?: string;
  prop: string;
  modelPath?: string;
  renderEdit?: (form: any) => JSX.Element;
  renderView?: (model: any) => JSX.Element;
  slice: Slice<any, any>;
}

export const Property = ({ label, prop, slice, modelPath, renderEdit, renderView }: PropertyProps) => {
  const model = slice.use[modelPath ?? slice.sliceName]();
  // console.log(slice);
  const modelClass = slice.use[`${slice.refName}Class${slice.suffix}`]();
  const fieldMeta = useMemo(
    () => getFieldMetas(modelClass.constructor).find((fieldMeta) => fieldMeta.key === prop),
    []
  );
  const setState = useCallback(
    (val) => slice.do[`set${Utils.capitalize(prop)}On${Utils.capitalize(slice.refName)}${slice.suffix}`](val),
    []
  );
  const update = useCallback(() => slice.do[`update${Utils.capitalize(slice.sliceName)}`](modelPath), []);
  const reset = useCallback(() => slice.do[`reset${Utils.capitalize(slice.sliceName)}`](), []);
  const edit = useCallback(() => slice.do[`edit${Utils.capitalize(slice.sliceName)}`](model), []);
  const modelForm = slice.use[`${slice.refName}Form${slice.suffix}`]();
  const modelModal = slice.use[`${slice.refName}Modal${slice.suffix}`]();
  if (!fieldMeta) throw new Error("FieldMeta not found");
  return (
    <div>
      <Typography.Title level={5}>{label ?? prop}</Typography.Title>
      {modelModal === "edit" && modelForm[prop] !== undefined && !fieldMeta.tailed ? (
        renderEdit ? (
          renderEdit(modelForm)
        ) : (
          <PropertyEdit
            metadata={fieldMeta}
            model={model}
            value={modelForm[prop]}
            slice={slice}
            modelPath={modelPath}
            setState={setState}
            update={update}
            reset={reset}
          />
        )
      ) : model === "loading" ? (
        <Skeleton.Input />
      ) : renderView ? (
        renderView(model)
      ) : (
        <PropertyView
          metadata={fieldMeta}
          model={model}
          value={model[prop]}
          slice={slice}
          modelPath={modelPath}
          edit={edit}
        />
      )}
    </div>
  );
};
interface PropertyEditProps {
  metadata: FieldMeta;
  model: any;
  value: any;
  slice: Slice<any, any>;
  modelPath?: string;
  setState: (val: any) => void;
  update: () => void;
  reset: () => void;
}
export const PropertyEdit = ({
  metadata,
  model,
  value,
  slice,
  modelPath,
  setState,
  update,
  reset,
}: PropertyEditProps) => {
  if (value === null || value === undefined) return null;
  if (metadata.isArray && Array.isArray(value))
    return (
      <>
        {value.map((val, idx) => (
          <PropertyEdit
            key={idx}
            metadata={metadata}
            model={model}
            value={val}
            slice={slice}
            modelPath={modelPath}
            setState={setState}
            update={update}
            reset={reset}
          />
        ))}
      </>
    );
  if (metadata.name === "Date") return <RecentTime date={value} />;
  if (["String", "ID"].includes(metadata.name))
    return (
      <Typography.Text editable={{ onChange: setState, onEnd: update, onCancel: reset }} onBlur={() => reset()}>
        {value}
      </Typography.Text>
    );
  return null;
};

interface PropertyViewProps {
  metadata: FieldMeta;
  model: any;
  value: any;
  slice: Slice<any, any>;
  modelPath?: string;
  edit: () => void;
}
export const PropertyView = (args: PropertyViewProps) => {
  const { metadata, model, value, slice, modelPath, edit } = args;
  if (value === null || value === undefined) return null;
  if (metadata.isArray && Array.isArray(value))
    return (
      <>
        {value.map((val, idx) => (
          <PropertyView key={idx} {...args} value={val} />
        ))}
      </>
    );
  if (metadata.name === "Date") return <RecentTime date={value} />;
  if (metadata.name === "ID") return <Typography.Text>{value}</Typography.Text>;
  if (metadata.name === "String")
    return <Typography.Text editable={!metadata.tailed && { onStart: edit }}>{value}</Typography.Text>;
  return null;
};

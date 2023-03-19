import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "../index";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { FileExcelOutlined } from "@ant-design/icons";

export const ThingMenuItem: DataMenuItem = {
  key: "thing",
  label: "Thing",
  icon: <FileExcelOutlined />,
  render: () => <Things />,
};
export const Things = ({ slice = st.slice.thing, init }: ModelsProps<slice.ThingSlice, gql.Thing>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      tools={[
        {
          label: "CSV Template",
          onClick: () => {
            //
          },
          icon: <FileExcelOutlined />,
        },
      ]}
      edit={<ThingEdit slice={slice} />}
      renderItem={Thing}
      columns={["purpose", "description"]}
      actions={["edit"]}
    />
  );
};
export const Thing = ({
  thing,
  slice = st.slice.thing,
  actions,
  columns,
}: ModelProps<slice.ThingSlice, gql.LightThing>) => {
  return <DataItem title={thing.name} model={thing} slice={slice} actions={actions} columns={columns} />;
};

export const ThingEdit = ({ slice }: ModelEditProps<slice.ThingSlice>) => {
  const { l } = useLocale();

  const thingForm = slice.use.thingForm();
  return (
    <DataEditModal slice={slice} renderTitle={(thing: DefaultOf<gql.Thing>) => `${thing.name}`}>
      <Field.Text label={l("thing.name")} value={thingForm.name} onChange={slice.do.setNameOnThing} />
      <Field.Text
        label={l("thing.description")}
        value={thingForm.description}
        onChange={slice.do.setDescriptionOnThing}
      />
      {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => slice.setState({ type })}>
          {cnst.thingTypes.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select> */}
      <Field.Img
        label={l("thing.image")}
        addFiles={slice.do.uploadImageOnThing}
        file={thingForm.image}
        onRemove={() => slice.do.setImageOnThing(null)}
      />
    </DataEditModal>
  );
};

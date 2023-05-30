"use client";
import { Field, st, usePage } from "@shared/client";

interface ThingEditProps {
  thingId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ thingId = undefined }: ThingEditProps) => {
  const thingForm = st.use.thingForm();
  const { l } = usePage();
  return (
    <>
      <Field.Text label={l("thing.name")} value={thingForm.name} onChange={st.do.setNameOnThing} />
      <Field.Text label={l("thing.description")} value={thingForm.description} onChange={st.do.setDescriptionOnThing} />
      {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => st.setState({ type })}>
          {cnst.thingTypes.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select> */}
      <Field.Img
        label={l("thing.image")}
        addFiles={st.do.uploadImageOnThing}
        file={thingForm.image}
        onRemove={() => st.do.setImageOnThing(null)}
      />
    </>
  );
};

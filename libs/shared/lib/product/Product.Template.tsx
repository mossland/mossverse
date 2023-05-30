"use client";
import { Field, st, usePage } from "@shared/client";

interface ProductEditProps {
  productId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ productId = undefined }: ProductEditProps) => {
  const productForm = st.use.productForm();
  const { l } = usePage();
  return (
    <>
      <Field.Text label={l(`product.name`)} value={productForm.name} onChange={st.do.setNameOnProduct} />
      <Field.Text
        label={l(`product.description`)}
        value={productForm.description}
        onChange={st.do.setDescriptionOnProduct}
      />
      {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => st.setState({ type })}>
        {cnst.productTypes.map((type) => (
          <Select.Option value={type}>{type}</Select.Option>
        ))}
      </Select> */}
      <Field.Img
        label={l(`product.image`)}
        addFiles={st.do.uploadImageOnProduct}
        file={productForm.image}
        onRemove={() => st.do.setImageOnProduct(null)}
      />
    </>
  );
};
export const InChild = () => {
  const { l } = usePage();
  const productForm = st.use.productForm();
  return (
    // <DataEditField slice={slice} renderTitle={(product: DefaultOf<fetch.Product>) => `${product.name}`}>
    <>
      <Field.Text label={l(`product.name`)} value={productForm.name} onChange={st.do.setNameOnProduct} />
      <Field.Text
        label={l(`product.description`)}
        value={productForm.description}
        onChange={st.do.setDescriptionOnProduct}
      />
      <Field.Img
        label={l(`product.image`)}
        addFiles={st.do.uploadImageOnProduct}
        file={productForm.image}
        onRemove={() => st.do.setImageOnProduct(null)}
      />
    </>
    // </DataEditField>
  );
};

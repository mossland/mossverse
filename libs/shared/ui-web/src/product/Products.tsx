import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataEditModal, DataEditField, DataItem, DataListContainer, Field, Img } from "../index";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { FileExcelOutlined } from "@ant-design/icons";

export const ProductMenuItem: DataMenuItem = {
  key: "product",
  label: "Product",
  icon: <FileExcelOutlined />,
  render: () => <Products />,
};
export const Products = ({ slice = st.slice.product, init }: ModelsProps<slice.ProductSlice, gql.Product>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<ProductEdit slice={slice} />}
      renderItem={Product}
      columns={["purpose", "description"]}
      actions={["edit"]}
    />
  );
};
export const Product = ({
  product,
  slice = st.slice.product,
  actions,
  columns,
}: ModelProps<slice.ProductSlice, gql.LightProduct>) => {
  return <DataItem title={product.name} model={product} slice={slice} actions={actions} columns={columns} />;
};

export const ProductEdit = ({ slice }: ModelEditProps<slice.ProductSlice>) => {
  const { l } = useLocale();
  const productForm = slice.use.productForm();
  return (
    <DataEditModal slice={slice} renderTitle={(product: DefaultOf<gql.Product>) => `${product.name}`}>
      <Field.Text label={l(`product.name`)} value={productForm.name} onChange={slice.do.setNameOnProduct} />
      <Field.Text
        label={l(`product.description`)}
        value={productForm.description}
        onChange={slice.do.setDescriptionOnProduct}
      />
      {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => slice.setState({ type })}>
        {cnst.productTypes.map((type) => (
          <Select.Option value={type}>{type}</Select.Option>
        ))}
      </Select> */}
      <Field.Img
        label={l(`product.image`)}
        addFiles={slice.do.uploadImageOnProduct}
        file={productForm.image}
        onRemove={() => slice.do.setImageOnProduct(null)}
      />
    </DataEditModal>
  );
};

export const ProuctEditInChild = ({ slice }: ModelEditProps<slice.ProductSlice>) => {
  const { l } = useLocale();
  const productForm = slice.use.productForm();
  return (
    <DataEditField slice={slice} renderTitle={(product: DefaultOf<gql.Product>) => `${product.name}`}>
      <Field.Text label={l(`product.name`)} value={productForm.name} onChange={slice.do.setNameOnProduct} />
      <Field.Text
        label={l(`product.description`)}
        value={productForm.description}
        onChange={slice.do.setDescriptionOnProduct}
      />
      <Field.Img
        label={l(`product.image`)}
        addFiles={slice.do.uploadImageOnProduct}
        file={productForm.image}
        onRemove={() => slice.do.setImageOnProduct(null)}
      />
    </DataEditField>
  );
};

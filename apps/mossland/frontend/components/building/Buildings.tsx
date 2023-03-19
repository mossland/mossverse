import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Skeleton } from "antd";
import { st, slice, gql } from "../../stores";
import { DataEditModal, DataListContainer, Field, Img } from "@shared/ui-web";
import { cnst, Utils } from "@shared/util";
import { DefaultOf, InitActionForm } from "@shared/util-client";

// interface BuildingsProps {
//   slice?: gql.BuildingSlice;
//   init?: InitActionForm<gql.Building>;
// }
// export const Buildings = ({ slice = st.slice.building, init }: BuildingsProps) => {
//   return (
//     <DataListContainer
//       init={init}
//       slice={slice}
//       edit={<BuildingEdit slice={slice} />}
//       renderItem={(building) => <Building building={building} showToolbox slice={slice} />}
//     />
//   );
// };
// interface BuildingProps {
//   building: gql.LightBuilding;
//   slice: slice.BuildingSlice;
//   showToolbox?: boolean;
// }
// export const Building = ({ building, slice, showToolbox }: BuildingProps) => {
//   return (
//     <Card
//       hoverable
//       actions={
//         showToolbox ? [<EditOutlined key="edit" onClick={() => slice.do.editBuilding(building.id)} />] : []
//       }
//     >
//       <Card.Meta title={building.id} />
//     </Card>
//   );
// };
// interface BuildingEditProps {
//   slice: slice.BuildingSlice;
// }
export const BuildingEdit = ({ slice }: any) => {
  const buildingForm = slice.use.buildingForm();
  return (
    <DataEditModal slice={slice} renderTitle={(building: DefaultOf<gql.Building>) => `${building.id}`}>
      {/* <Field.Text label="Code" value={buildingForm.code} onChange={slice.do.setCodeOnBuilding} />
      <Field.Number label="Num" value={buildingForm.num} onChange={slice.do.setNumOnBuilding} /> */}
    </DataEditModal>
  );
};

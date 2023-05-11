import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Skeleton } from "antd";
import { gql, st, slice } from "@shared/data-access";
import { DataEditModal, DataListContainer, Field, Img } from "@shared/ui-web";
import { cnst, Utils } from "@shared/util";
import { DefaultOf, InitActionForm } from "@shared/util-client";

// interface SummariesProps {
//   slice?: any; //gql.SummarySlice;
//   init?: InitActionForm<gql.Summary>;
// }
// export const Summaries = ({ slice = store.summary.slice.summary, init }: SummariesProps) => {
//   return (
//     <DataListContainer
//       init={init}
//       slice={slice}
//       edit={<SummaryEdit slice={slice} />}
//       renderItem={(summary) => <Summary summary={summary} showToolbox slice={slice} />}
//     />
//   );
// };
// interface SummaryProps {
//   summary: gql.LightSummary;
//   slice: slice.SummarySlice;
//   showToolbox?: boolean;
// }
// export const Summary = ({ summary, slice, showToolbox }: SummaryProps) => {
//   return (
//     <Card
//       hoverable
//       actions={showToolbox ? [<EditOutlined key="edit" onClick={() => slice.do.editSummary(summary.id)} />] : []}
//     >
//       <Card.Meta title={summary.id} />
//     </Card>
//   );
// };
// interface SummaryEditProps {
//   slice: slice.SummarySlice;
// }
// export const SummaryEdit = ({ slice }: SummaryEditProps) => {
//   const summaryForm = slice.use.summaryForm();
//   return (
//     <DataEditModal slice={slice} renderTitle={(summary: DefaultOf<gql.Summary>) => `${summary.id}`}>
//       {/* <Field.Text label="Code" value={summaryForm.code} onChange={slice.do.setCodeOnSummary} />
//       <Field.Number label="Num" value={summaryForm.num} onChange={slice.do.setNumOnSummary} /> */}
//     </DataEditModal>
//   );
// };

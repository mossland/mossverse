import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { gql, st, slice } from "./../../stores";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { ScheduleOutlined } from "@ant-design/icons";
import { cnst, Utils } from "@shared/util";
import Image from "next/legacy/image";
import dayjs from "dayjs";

export const AdvertiseMenuItem: DataMenuItem = {
  key: "advertise",
  label: "Advertise",
  icon: <ScheduleOutlined />,
  render: () => <Advertises />,
};

export const Advertises = ({ slice = st.slice.advertise, init }: ModelsProps<slice.AdvertiseSlice, gql.Advertise>) => {
  return (
    <DataListContainer
      init={{ ...init, default: { openAt: Utils.getNextDays(1), closeAt: Utils.getNextDays(2) } as any }}
      slice={slice}
      edit={<AdvertiseEdit slice={slice} />}
      renderItem={Advertise}
      columns={["openAt", "closeAt"]}
      actions={["edit"]}
    />
  );
};
export const Advertise = ({
  advertise,
  slice = st.slice.advertise,
  actions,
  columns,
}: ModelProps<slice.AdvertiseSlice, gql.Advertise>) => {
  // return <DataItem title={advertise.id} model={advertise} slice={slice} actions={actions} columns={columns} />;
  return <DataItem title={advertise.id} model={advertise} slice={slice} actions={actions} columns={columns} />;
};
interface AdvertiseEditProps {
  slice: slice.AdvertiseSlice;
}
export const AdvertiseEdit = ({ slice }: ModelEditProps<slice.AdvertiseSlice>) => {
  const advertiseForm = slice.use.advertiseForm();

  return (
    <DataEditModal slice={slice} renderTitle={(advertise: DefaultOf<gql.Advertise>) => `${advertise.id}`}>
      <Field.DatePick
        label="openAt"
        date={advertiseForm.openAt}
        min={dayjs().add(1, "day")}
        max={dayjs().add(60, "day")}
        onChange={(openAt) => {
          openAt && slice.do.setOpenAtOnAdvertise(openAt);
          openAt && slice.do.setCloseAtOnAdvertise(openAt.add(1, "day"));
        }}
      />
      <Field.DatePick
        label="closeAt"
        date={advertiseForm.closeAt}
        min={advertiseForm.closeAt.add(1, "day")}
        max={dayjs().add(60, "day")}
        onChange={(closeAt) => {
          closeAt && slice.do.setCloseAtOnAdvertise(closeAt);
        }}
      />
    </DataEditModal>
  );
};

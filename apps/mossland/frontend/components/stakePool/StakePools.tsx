import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { gql, st, slice, useLocale } from "./../../stores";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { ScheduleOutlined } from "@ant-design/icons";
import { cnst, Utils } from "@shared/util";
import Image from "next/legacy/image";

export const StakePoolMenuItem: DataMenuItem = {
  key: "stakePool",
  label: "StakePool",
  icon: <ScheduleOutlined />,
  render: () => <StakePools />,
};

export const StakePools = ({ slice = st.slice.stakePool, init }: ModelsProps<slice.StakePoolSlice, gql.StakePool>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<StakePoolEdit slice={slice} />}
      renderItem={StakePool}
      columns={["type", "totalValue"]}
      actions={["edit"]}
    />
  );
};
export const StakePool = ({
  stakePool,
  slice = st.slice.stakePool,
  actions,
  columns,
}: ModelProps<slice.StakePoolSlice, gql.StakePool>) => {
  return <DataItem title={stakePool.id} model={stakePool} slice={slice} actions={actions} columns={columns} />;
};
interface StakePoolEditProps {
  slice: slice.StakePoolSlice;
}
export const StakePoolEdit = ({ slice }: ModelEditProps<slice.StakePoolSlice>) => {
  const { l } = useLocale();
  const stakePoolForm = slice.use.stakePoolForm();

  return (
    <DataEditModal slice={slice} renderTitle={(stakePool: DefaultOf<gql.StakePool>) => `${stakePool.id}`}>
      <Field.SelectItem
        label={l("stakePool.type")}
        items={cnst.stakePoolTypes}
        value={stakePoolForm.type}
        onChange={slice.do.setTypeOnStakePool}
      />
      <Field.Parent
        label={l("stakePool.thing")}
        slice={st.slice.thing}
        value={stakePoolForm.thing as gql.shared.Thing}
        onChange={(thing) => slice.do.setThingOnStakePool(thing as gql.shared.Thing)}
        renderOption={(thing) => `${thing.name}/${thing.id}/${thing.status}`}
      />
    </DataEditModal>
  );
};

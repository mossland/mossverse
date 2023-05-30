"use client";
import { DataItem, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  keyring,
  sliceName = "keyring",
  actions,
  columns,
}: ModelProps<"keyring", fetch.LightKeyring>) => {
  return <DataItem title={`${keyring.id}`} model={keyring} sliceName={sliceName} actions={actions} columns={columns} />;
};

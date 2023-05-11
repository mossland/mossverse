import { DataEditModal, DataItem, DataListContainer } from "@shared/ui-web";
import { DefaultOf, InitActionForm, ModelsProps } from "@shared/util-client";
import { slice, gql, st } from "@decentverse/data-access";
import * as Character from "./";
import { Socket } from "socket.io";
export const CharacterList = ({
  slice = st.slice.character,
  init,
}: ModelsProps<slice.CharacterSlice, gql.Character>) => {
  return (
    <DataListContainer
      type="list"
      init={{
        ...init,
        query: { status: "applied" },
      }}
      slice={slice}
      edit={
        <DataEditModal slice={slice} renderTitle={(character: DefaultOf<gql.Character>) => `${character.name}`}>
          <Character.Edit slice={slice} />
        </DataEditModal>
      }
      renderItem={Character.Item}
      columns={[
        {
          key: "file",
          render: (file) => <img className="w-[40px] h-[40px]" src={file.url}></img>,
        },
        {
          key: "creator",
          render: (creator) => <div className="">{creator?.nickname}</div>,
        },
        "status",
        // "id",
        "name",
      ]}
      actions={(character: gql.LightCharacter, idx: number) => [
        "edit",
        ...(character.status === "applied"
          ? [
              {
                type: "reject",
                render: () => (
                  <button
                    className="text-white bg-red-400 rounded-md"
                    onClick={() => st.do.rejectCharacter(character.id, idx)}
                  >
                    Reject
                  </button>
                ),
              },
              {
                type: "approve",
                render: () => (
                  <button
                    className="text-white bg-green-400 rounded-md"
                    onClick={() => st.do.approveCharacter(character.id, idx)}
                  >
                    Approve
                  </button>
                ),
              },
            ]
          : []),
      ]}
    />
  );
};

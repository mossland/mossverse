import { Upload, UploadFile } from "antd";
import { ReactNode } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { RiImageEditFill } from "react-icons/ri";
import { Col, Row } from "antd";
import { st, gql, slice } from "@decentverse/data-access";
import { Utils } from "@shared/util";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";

export const CharacterEdit = ({ slice }: ModelEditProps<slice.CharacterSlice>) => {
  const characterForm = slice.use.characterForm();
  interface SpriteDefProps {
    type: "idle" | "walk";
    direction: "up" | "down" | "right" | "left";
    slice: slice.CharacterSlice;
  }
  const SpriteDef = ({ type, direction, slice }: SpriteDefProps) => {
    const characterForm = slice.use.characterForm();
    const sprite = characterForm[direction];
    if (!sprite) return <></>;
    return (
      <>
        <Field.Number
          label="row"
          value={sprite[type].row}
          onChange={(row) => slice.do.writeOnCharacter([direction, type, "row"], row)}
        />
        <Field.Number
          label="column"
          value={sprite[type].column}
          onChange={(column) => slice.do.writeOnCharacter([direction, type, "column"], column)}
        />
        <Field.Number
          label="duration"
          value={sprite[type].duration}
          onChange={(duration) => slice.do.writeOnCharacter([direction, type, "duration"], duration)}
        />
      </>
    );
  };
  interface SpriteProps {
    direction: "up" | "down" | "right" | "left";
    slice: slice.CharacterSlice;
  }
  const Sprite = ({ direction, slice }: SpriteProps) => {
    return (
      <>
        idle
        <SpriteDef direction={direction} type="idle" slice={slice} />
        <br />
        walk
        <SpriteDef direction={direction} type="walk" slice={slice} />
        <button className="btn" onClick={() => slice.do[`set${Utils.capitalize(direction)}OnCharacter`](null)}>
          Remove-{direction}
        </button>
        <br />
      </>
    );
  };
  return (
    <Row gutter={10}>
      <Col span={8}>
        <Field.Text label="Name" value={characterForm.name} onChange={slice.do.setNameOnCharacter} />
        <Field.Img
          label="File"
          addFiles={slice.do.uploadFileOnCharacter}
          file={characterForm.file}
          onRemove={() => slice.do.setFileOnCharacter(null)}
        />
        <Field.DoubleNumber
          label="TotalSize"
          onChange={slice.do.setTotalSizeOnCharacter}
          value={characterForm.totalSize}
          disabled={true}
        />
        <Field.DoubleNumber
          label="TileSize"
          onChange={slice.do.setTileSizeOnCharacter}
          value={characterForm.tileSize}
        />
        <Field.DoubleNumber label="Size" onChange={slice.do.setSizeOnCharacter} value={characterForm.size} />
      </Col>
      <Col span={8}>
        {characterForm.right ? (
          <Sprite direction="right" slice={slice} />
        ) : (
          <button className="btn" onClick={() => slice.do.setRightOnCharacter(gql.defaultCharacter.right)}>
            Create-right
          </button>
        )}
        {characterForm.left ? (
          <Sprite direction="left" slice={slice} />
        ) : (
          <button className="btn" onClick={() => slice.do.setLeftOnCharacter(gql.defaultCharacter.right)}>
            Create-left
          </button>
        )}
      </Col>
      <Col span={8}>
        {characterForm.up ? (
          <Sprite direction="up" slice={slice} />
        ) : (
          <button className="btn" onClick={() => slice.do.setUpOnCharacter(gql.defaultCharacter.right)}>
            Create-up
          </button>
        )}
        {characterForm.down ? (
          <Sprite direction="down" slice={slice} />
        ) : (
          <button className="btn" onClick={() => slice.do.setDownOnCharacter(gql.defaultCharacter.right)}>
            Create-down
          </button>
        )}
      </Col>
    </Row>
  );
};

interface CharacterEditForUserProps {
  slice: slice.CharacterSlice;
  actions: ReactNode;
}
const CharacterEditForUser = ({ slice, actions }: CharacterEditForUserProps) => {
  const characterForm = slice.use.characterForm();
  const uploadFiles: UploadFile[] = characterForm.file
    ? [{ uid: characterForm.file.id, name: characterForm.file.id, url: characterForm.file.url }]
    : [];
  return (
    <>
      {/* <div className="justify-center p-5 md:flex">
        <div className="md:flex-1 md:w-[324px] md:h-[324px] flex items-center justify-center w-full"> */}
      <div className="block gap-5 md:flex">
        <div className="flex items-center justify-center flex-1 p-5">
          {characterForm.file ? (
            <Upload
              className="w-auto h-auto z-[-0.5]"
              showUploadList={false}
              fileList={uploadFiles}
              openFileDialogOnClick={true}
              accept="image/png"
              onChange={(e) => {
                if (e.file.status !== "uploading" || e.file.percent) return;
                slice.do.uploadFileOnCharacter([e.file.originFileObj] as any);
              }}
            >
              <div className="relative w-[324px] h-[324px] items-center justify-center rounded-md hover:cursor-pointer shadow-md">
                <img
                  className="w-full h-full duration-500 rounded-md hover:opacity-20"
                  src={characterForm.file.url}
                ></img>
                <div className="absolute text-gray-800 opacity-40 md:z-[-1] top-1/2 items-center justify-center left-1/2 translate-x-[-50%] translate-y-[-50%]">
                  <div className="flex items-center justify-center text-center">
                    <RiImageEditFill className="flex text-[50px]" />
                  </div>
                  <span className="flex text-[14px]">클릭 또는 드래그하여 이미지를 올려주세요.</span>
                </div>
              </div>
            </Upload>
          ) : (
            <Upload
              className="w-auto h-auto"
              // listType="picture-card"
              accept="image/png"
              showUploadList={false}
              // openFileDialogOnClick={true}

              onChange={(e) => {
                if (e.file.status !== "uploading" || e.file.percent) return;
                slice.do.uploadFileOnCharacter([e.file.originFileObj] as any);
              }}
            >
              <div className="w-[324px] h-[324px] bg-gray-200 font-bold grid place-content-center rounded-md hover:cursor-pointer hover:opacity-50 duration-500">
                <div className="flex items-center justify-center text-center">
                  <RiImageEditFill className="flex text-[50px] text-gray-400" />
                </div>
                <span className="flex text-[14px] text-center text-gray-400">
                  클릭 또는 드래그하여 이미지를 올려주세요.
                </span>
              </div>
            </Upload>
          )}
        </div>
        <div className="flex-1 pr-5 mt-3">{actions}</div>
      </div>
      <div className="px-8 py-2">
        <div className="my-3">
          스킨 이름
          <input
            className="input input-bordered"
            value={characterForm.name}
            onChange={(e) => {
              slice.do.setNameOnCharacter(e.target.value);
            }}
          />
        </div>
        <div className="my-3">
          <div>설명</div>
          <textarea
            className="border-[1px] p-2 w-full border-gray-300 rounded-md"
            style={{ height: 100, resize: "none" }}
            value={characterForm.description}
            onChange={(e) => {
              slice.do.setDescriptionOnCharacter(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
};
CharacterEdit.ForUser = CharacterEditForUser;

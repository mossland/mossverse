"use client";
import { Field, Upload } from "@shared/client";
import { RiImageEditFill } from "react-icons/ri";
import { Utils } from "@util/client";
import { fetch, st } from "@decentverse/client";

export const General = () => {
  const characterForm = st.use.characterForm();
  interface SpriteDefProps {
    type: "idle" | "walk";
    direction: "up" | "down" | "right" | "left";
  }
  const SpriteDef = ({ type, direction }: SpriteDefProps) => {
    const characterForm = st.use.characterForm();
    const sprite = characterForm[direction];
    if (!sprite) return <></>;
    return (
      <>
        <Field.Number
          label="row"
          value={sprite[type].row}
          onChange={(row) => st.do.writeOnCharacter([direction, type, "row"], row)}
        />
        <Field.Number
          label="column"
          value={sprite[type].column}
          onChange={(column) => st.do.writeOnCharacter([direction, type, "column"], column)}
        />
        <Field.Number
          label="duration"
          value={sprite[type].duration}
          onChange={(duration) => st.do.writeOnCharacter([direction, type, "duration"], duration)}
        />
      </>
    );
  };
  interface SpriteProps {
    direction: "up" | "down" | "right" | "left";
  }
  const Sprite = ({ direction }: SpriteProps) => {
    return (
      <>
        idle
        <SpriteDef direction={direction} type="idle" />
        <br />
        walk
        <SpriteDef direction={direction} type="walk" />
        <button className="btn" onClick={() => st.do[`set${Utils.capitalize(direction)}OnCharacter`](null)}>
          Remove-{direction}
        </button>
        <br />
      </>
    );
  };
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <Field.Text label="Name" value={characterForm.name} onChange={st.do.setNameOnCharacter} />
        <Field.Img
          label="File"
          addFiles={st.do.uploadFileOnCharacter}
          file={characterForm.file}
          onRemove={() => st.do.setFileOnCharacter(null)}
        />
        <Field.DoubleNumber
          label="TotalSize"
          onChange={st.do.setTotalSizeOnCharacter}
          value={characterForm.totalSize}
          disabled={true}
        />
        <Field.DoubleNumber label="TileSize" onChange={st.do.setTileSizeOnCharacter} value={characterForm.tileSize} />
        <Field.DoubleNumber label="Size" onChange={st.do.setSizeOnCharacter} value={characterForm.size} />
      </div>
      <div>
        {characterForm.right ? (
          <Sprite direction="right" />
        ) : (
          <button className="btn" onClick={() => st.do.setRightOnCharacter(fetch.defaultCharacter.right)}>
            Create-right
          </button>
        )}
        {characterForm.left ? (
          <Sprite direction="left" />
        ) : (
          <button className="btn" onClick={() => st.do.setLeftOnCharacter(fetch.defaultCharacter.right)}>
            Create-left
          </button>
        )}
      </div>
      <div>
        {characterForm.up ? (
          <Sprite direction="up" />
        ) : (
          <button className="btn" onClick={() => st.do.setUpOnCharacter(fetch.defaultCharacter.right)}>
            Create-up
          </button>
        )}
        {characterForm.down ? (
          <Sprite direction="down" />
        ) : (
          <button className="btn" onClick={() => st.do.setDownOnCharacter(fetch.defaultCharacter.right)}>
            Create-down
          </button>
        )}
      </div>
    </div>
  );
};

export const ForUser = () => {
  const characterForm = st.use.characterForm();
  console.log();
  return (
    <>
      <div className="block gap-5 md:flex">
        <div className="flex items-center justify-center flex-1 p-5">
          {characterForm.file ? (
            <Upload
              multiple={false}
              className="w-auto h-auto z-[-0.5]"
              fileList={[characterForm.file]}
              onChange={(e) => {
                console.log(e);
                st.do.uploadFileOnCharacter([e] as any);
              }}
            >
              {/* <div className="relative w-[324px] h-[324px] items-center justify-center rounded-md hover:cursor-pointer shadow-md">
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
              </div> */}
            </Upload>
          ) : (
            <Upload
              className="w-auto h-auto"
              onChange={(e) => {
                console.log(e);
                st.do.uploadFileOnCharacter([e] as any);
              }}
            >
              <div className="grid w-full h-full font-bold duration-500 bg-gray-200 rounded-md place-content-center hover:cursor-pointer hover:opacity-50">
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
        <div className="flex-1 pr-5 mt-3">
          <div>
            <div className="text-[18px] mb-5">커스텀 제작을 위한 안내</div>
            <ul className="list-decimal">
              <li>세 종류의 모습이 하나의 파일에 들어있어야 합니다.</li>
              <li>이미지 사이지는 126*600이고, 확장자는 png입니다.</li>
              <li>운영팀에서 검수 후 마켓에 리스팅됩니다.</li>
              <li>부적절하거나 잘못된 포멧의 스킨은 리스팅이 거절 될 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="px-8 py-2">
        <div className="my-3">
          스킨 이름
          <input
            className="input input-bordered"
            value={characterForm.name}
            onChange={(e) => {
              st.do.setNameOnCharacter(e.target.value);
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
              st.do.setDescriptionOnCharacter(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
};

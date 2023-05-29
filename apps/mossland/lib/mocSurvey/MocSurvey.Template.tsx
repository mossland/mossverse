"use client";
import { Common } from "../../client";
import { DatePicker, Field, Input, OnlyAdmin, Radio, Select } from "@shared/client";
import { cnst } from "@util/client";
import { fetch, st, usePage } from "@mossland/client";
import { useEffect } from "react";
import dayjs from "dayjs";

interface GeneralProps {
  mocSurveyId?: string | null;
  sliceName?: string;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ sliceName = "mocSurvey", mocSurveyId = undefined }: GeneralProps) => {
  const mocSurvey = st.use.mocSurvey();
  const mocSurveyForm = st.use.mocSurveyForm();
  const mocSurveyModal = st.use.mocSurveyModal();

  const { l } = usePage();
  const today = dayjs();
  const maxDay = dayjs().add(2, "month");
  return (
    <div className="px-[10px] py-[20px]">
      <div className="flex items-center mb-4">
        <p className="w-20 mt-3">{l("mocSurvey.title")}</p>
        <Input
          className="w-full"
          inputClassName={`w-full focus:border-primary`}
          value={mocSurveyForm.title}
          onChange={(e) => st.do.setTitleOnMocSurvey(e.target.value as string)}
        />
      </div>
      <OnlyAdmin>
        <div className="flex items-center my-3 ">
          <p className="w-20">작성자</p>
          {mocSurveyForm.creator ? (
            <>{`${mocSurveyForm.creator.id} - ${mocSurveyForm.creator.nickname}`}</>
          ) : (
            <Field.Parent
              init={{
                query: {
                  role: "admin",
                },
              }}
              sliceName="user"
              value={mocSurveyForm.creator}
              onChange={(user: fetch.LightUser) => st.do.setCreatorOnMocSurvey(user as fetch.User)}
              renderOption={(user: fetch.LightUser) => `${user.id}-${user.nickname}`}
            />
          )}
        </div>
      </OnlyAdmin>
      {mocSurveyModal === "new" && (
        <div className="flex items-center">
          <p className="w-20">기간</p>
          <DatePicker.RangePicker
            className={`w-full`}
            value={[mocSurveyForm.openAt, mocSurveyForm.closeAt]}
            disabledDate={(d) => !d || (d.isAfter && d.isAfter(maxDay)) || (d.isBefore && d.isBefore(today))}
            onChange={(o) => {
              st.do.setOpenAtOnMocSurvey(o?.[0] ? o[0] ?? mocSurveyForm.openAt : undefined);
              st.do.setCloseAtOnMocSurvey(o?.[1] ? o[1] ?? mocSurveyForm.closeAt : undefined);
            }}
          />
        </div>
      )}
      <p className=" mb-[8px] mt-[20px]">{l("mocSurvey.description")}</p>
      <Input.TextArea
        value={mocSurveyForm.description}
        onChange={(e) => st.do.setDescriptionOnMocSurvey(e.target.value as string)}
        className={`w-full rounded-md min-h-[300px] border-[1px] border-solid p-[11px] text-lg  resize-none  focus:border-primary `}
      />
      <div className="mt-[20px]">
        <p>{l("mocSurvey.type")}</p>
        <div className="flex items-center">
          <Select
            className={``}
            value={mocSurveyForm.type}
            onChange={(value) => st.do.setTypeOnMocSurvey(value as cnst.SurveyType)}
          >
            <Select.Option value="objective">Objective</Select.Option>
            <Select.Option value="subjective">Subjective</Select.Option>
          </Select>
        </div>
        {mocSurveyForm.type === "objective" && (
          <div>
            <div className="">
              {!mocSurveyForm.selections.length ? (
                <Common.Selection
                  selection={mocSurveyForm.selections?.[0] ?? ""}
                  itemIndex={0}
                  removeItem={(idx) => st.do.writeOnMocSurvey(["selections", idx], undefined)}
                  updateItem={(value) => st.do.writeOnMocSurvey(["selections", 0], value)}
                />
              ) : (
                mocSurveyForm.selections.map((selection, index) => (
                  <Common.Selection
                    key={index}
                    selection={selection}
                    itemIndex={index}
                    removeItem={(idx) => st.do.writeOnMocSurvey(["selections", idx], undefined)}
                    updateItem={(value) => st.do.writeOnMocSurvey(["selections", index], value)}
                  />
                ))
              )}
              <button
                className={`inline-block text-[14px] cursor-pointer border-[1px] font-bold bg-white border-solid border-black rounded-[4px] p-[8px] text-[#555] bg-transparent `}
                onClick={() => st.do.setSelectionsOnMocSurvey([...mocSurveyForm.selections, ""])}
              >
                질문 추가
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface InUserFormProps {
  mocSurveyId?: string | null;
  sliceName?: string;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const InUserForm = ({ sliceName = "mocSurvey", mocSurveyId = undefined }: InUserFormProps) => {
  const mocSurveyForm = st.use.mocSurveyForm();
  const { l } = usePage();
  const today = dayjs();
  const maxDay = dayjs().add(2, "month");

  return (
    <div className="px-[10px] py-[20px]">
      <div className="items-center mb-4 ">
        {/* <p className="w-20 my-3">{l("mocSurvey.title")}</p> */}
        <p className="w-20 my-3  text-[16px]">Proposal</p>
        <Input
          className="w-full"
          inputClassName={`w-full focus:border-primary`}
          value={mocSurveyForm.title}
          onChange={(e) => st.do.setTitleOnMocSurvey(e.target.value as string)}
        />
      </div>
      <div className="items-center ">
        <p className="w-20 my-3 text-[16px] text-[#555]">Until</p>

        <DatePicker.RangePicker
          className={`w-full`}
          value={[mocSurveyForm.openAt, mocSurveyForm.closeAt]}
          disabledDate={(d) => !d || d.isAfter(maxDay) || d.isBefore(today)}
          onChange={(o) => {
            st.do.setOpenAtOnMocSurvey(o?.[0] ? o[0] ?? mocSurveyForm.openAt : undefined);
            st.do.setCloseAtOnMocSurvey(o?.[1] ? o[1] ?? mocSurveyForm.closeAt : undefined);
          }}
        />
      </div>
      <p className=" mb-[8px] mt-[20px]">Description</p>
      <Input.TextArea
        value={mocSurveyForm.description}
        onChange={(e) => st.do.setDescriptionOnMocSurvey(e.target.value as string)}
        className={`w-full rounded-md min-h-[300px] border-[1px] border-solid p-[11px] text-lg  resize-none  focus:border-primary `}
      />
      <div className="mt-[20px]">
        <div className="flex items-center justify-between">
          <p>Answers</p>
          <div className="flex items-center gap-2">
            Types:
            <Select
              className={``}
              value={mocSurveyForm.type}
              onChange={(value) => st.do.setTypeOnMocSurvey(value as cnst.SurveyType)}
            >
              <Select.Option value="objective">Multiple</Select.Option>
              <Select.Option value="subjective">Text Box</Select.Option>
            </Select>
          </div>
        </div>
        {mocSurveyForm.type === "objective" && (
          <div>
            <div className="">
              {!mocSurveyForm.selections.length ? (
                <Common.Selection
                  selection={mocSurveyForm.selections?.[0] ?? ""}
                  itemIndex={0}
                  removeItem={(idx) => st.do.writeOnMocSurvey(["selections", idx], undefined)}
                  updateItem={(value) => st.do.writeOnMocSurvey(["selections", 0], value)}
                />
              ) : (
                mocSurveyForm.selections.map((selection, index) => (
                  <Common.Selection
                    key={index}
                    selection={selection}
                    itemIndex={index}
                    removeItem={(idx) =>
                      st.do.setMocSurveyForm({
                        ...mocSurveyForm,
                        selections: mocSurveyForm.selections.filter((cur, index) => index !== idx),
                      })
                    }
                    updateItem={(value) => st.do.writeOnMocSurvey(["selections", index], value)}
                  />
                ))
              )}
              <button
                className={`inline-block text-[14px] cursor-pointer border-[1px] font-bold bg-white border-solid border-black rounded-[4px] p-[8px] text-[#555] bg-transparent `}
                onClick={() => st.do.setSelectionsOnMocSurvey([...mocSurveyForm.selections, ""])}
              >
                + Add New Answer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface AnswerProps {
  sliceName?: string;
}

export const Answer = ({ sliceName = "mocSurvey" }: AnswerProps) => {
  const self = st.use.self();
  const mocSurvey = st.use.mocSurvey();
  const mocSurveyResponse = st.use.mocSurveyResponse();

  useEffect(() => {
    return () => {
      st.do.setMocSurveyResponse({
        ...mocSurveyResponse,
        selection: null,
        answer: null,
      });
    };
  }, []);
  return mocSurvey === "loading" ? (
    <></>
  ) : (
    <div className="bg-[#e8e8e8] p-[23px]">
      {mocSurvey.type === "objective" ? (
        <div className="mb-[16px] block">
          <Radio
            value={mocSurveyResponse.selection}
            disabled={!mocSurvey.isActive(self)}
            onChange={(_, index) =>
              st.do.setMocSurveyResponse({
                ...mocSurveyResponse,
                selection: index,
              })
            }
          >
            {mocSurvey.selections.map((selection, index) => (
              <Radio.Item className="bg-transparent " key={index} value={index}>
                {selection}
              </Radio.Item>
            ))}
          </Radio>
        </div>
      ) : (
        <div className="mb-[16px]">
          <Input.TextArea
            className="resize-none w-full h-[369px] border-[0px] border-black rounded-[6px] p-[14px] text-[16px] font-normal disabled:bg-white disabled:opacity-50"
            value={mocSurveyResponse.answer ?? ""}
            onChange={(e) =>
              st.do.setMocSurveyResponse({
                ...mocSurveyResponse,
                answer: e.target.value as string,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

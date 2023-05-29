import { MocSurvey, fetch } from "@mossland/client";

export default async function Page({ searchParams: { filter } }) {
  const { mocSurveyInit } = await fetch.initMocSurvey({ query: { status: { $in: ["surveying", "closed"] } } });
  return (
    <div className="flex w-full h-[calc(100vh-220px)] md:h-[calc(100vh-118px)] border-solid border-black border-t-[2px]">
      <div className="w-full overflow-auto ">
        <MocSurvey.Zone.List className="flex flex-col flex-1 w-full overflow-auto" init={mocSurveyInit} />
      </div>
      <hr className="h-full w-[0.1px] border-solid border-black border-[1px]" />
      <div className="w-full overflow-auto">
        <MocSurvey.Zone.UserView />
      </div>
    </div>
  );
}

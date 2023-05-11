import { LinkOutlined } from "@ant-design/icons";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { RecentTime } from "@shared/ui-web";
import { Spin } from "antd";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { BiX } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import { client } from "@shared/util-client";

interface WebviewViewProps {
  className?: string;
  webview: gql.Webview;
  slice?: slice.WebviewSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const WebviewView = ({ className, webview, slice = st.slice.webview }: WebviewViewProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("webview.id")}-{webview.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{webview.status}</div>
        <RecentTime
          date={webview.createdAt}
          breakUnit="second"
          timeOption={{ dateStyle: "short", timeStyle: "short" }}
        />
      </div>
    </div>
  );
};

interface WebviewViewModalProps {
  className?: string;
  // webview: gql.Webview;
  slice?: slice.WebviewSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const WebviewViewModal = ({ className, slice = st.slice.webview }: WebviewViewModalProps) => {
  const { l } = useLocale();
  const webview = st.use.webview();
  if (webview === "loading") return <></>;

  const innerModalClassName = "w-full h-full flex justify-center rounded-[30px]";
  return (
    <div
      className={"fixed w-full h-screen left-0 top-0 bg-black/40 z-[1]"}
      //  onClick={() => st.do.setCharacterModal(null)}
    >
      <div className="w-[100%] min-w-auto md:w-[80%] animate-fadeIn z-[2] fixed text-black left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] backdrop-blur-lg rounded-[10px] border-[3px] border-black bg-white">
        <div className="h-[34px]">
          <div className="justify-center w-full h-full text-center border-b-2">
            <h2>Webview</h2>
          </div>
          <div
            onClick={() => st.do.setWebviewModal("join")}
            className="absolute h-[34px] top-0 right-0 border-l-2 hover:cursor-pointer"
          >
            <BiX className="text-[32px]" />
          </div>
        </div>

        {!webview.isEmbed && (
          <div className={innerModalClassName}>
            <div className="bg-white p-[20px] w-full  md:w-[760px] h-fit rounded-[20px]">
              <h4 className="text-[1.6em] pb-[10px] border-b-[1px] border-[#eee]">{webview.message}</h4>
              <div>
                <a href={webview.url} target="_blank" rel="noreferrer" className="text-[1.2em]">
                  <LinkOutlined />
                </a>
              </div>
            </div>
          </div>
        )}

        {webview.isEmbed && webview.purpose === "twitter" && (
          <div className={innerModalClassName}>
            <div className="twitter-embed w-[90%] h-[80vh] rounded-[20px] overflow-hidden">
              <TwitterTimelineEmbed sourceType="profile" screenName={webview.url} options={{ width: "100%" }} />
            </div>
          </div>
        )}

        {webview.isEmbed && webview.purpose !== "twitter" && (
          <object
            className="w-full h-[75vh] overflow-x-hidden mb-[-8px]"
            data={client.jwt ? `${webview.url}?jwt=${client.jwt}` : webview.url}
          />
        )}
      </div>
    </div>
  );
};

WebviewView.Modal = WebviewViewModal;

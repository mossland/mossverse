import { useEffect, useState } from "react";
import { keyringStore, userStore, webviewStore } from "../../stores";
import { XButton } from "..";
import styled from "styled-components";
import { Spin } from "antd";
import * as types from "../../stores/types";
import { LinkOutlined } from "@ant-design/icons";
import { ModalContainer } from "@shared/ui-web";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useInterval } from "@shared/util-client";

export const WebViewModal = () => {
  const self = userStore.use.self();
  const webview = webviewStore.use.webview();
  const webviewOpen = webviewStore.use.webviewOpen();
  const operation = webviewStore.use.operation();
  const otp = keyringStore.use.otp();
  const getOtp = keyringStore.use.getOtp();

  useEffect(() => {
    if (!webview || self?.role === "guest") return;
    getOtp();
  }, [webview]);
  // window.onmessage = (event) => {
  //   event?.source?.window?.postMessage("GOT_YOU_IFRAME", "*");
  // };
  if (!webview) return null;
  return (
    <ModalWrapper>
      <ModalContainer
        showModal={webviewOpen}
        closeShowModal={() => webviewStore.setState({ webviewOpen: false })}
        title={webview.message ?? "Webviewer"}
        isWide
      >
        {!webview.isEmbed && (
          <InnerModal>
            <LinkView>
              <h4>{webview.message}</h4>
              <div>
                <a href={webview.url} target="_blank" rel="noreferrer">
                  <LinkOutlined />
                </a>
              </div>
            </LinkView>
          </InnerModal>
        )}

        {webview.isEmbed && webview.purpose === "twitter" && (
          <InnerModal>
            {operation === "loading" && <Spiner size={"large"} />}
            <TwitterWrapper>
              <TwitterTimelineEmbed
                sourceType="profile"
                screenName={webview.url}
                options={{ width: "100%" }}
                onLoad={() => webviewStore.setState({ operation: "idle" })}
              />
            </TwitterWrapper>
          </InnerModal>
        )}

        {webview.isEmbed && webview.purpose !== "twitter" && (
          <>
            {operation === "loading" && <Spiner size={"large"} />}
            <Webview
              data={otp ? `${webview.url}?access-token=${otp}` : webview.url}
              onLoad={() => webviewStore.setState({ operation: "idle" })}
            />
          </>
        )}
      </ModalContainer>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  overflow-y: hidden;

  .modal-header {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const Spiner = styled(Spin)`
  z-index: 1.1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Webview = styled.object`
  width: 100%;
  height: 75vh;
  overflow-x: hidden;
  margin-bottom: -8px;
  /* @media screen and (max-width: 800px) {
    width: 95%;
    height: 80vh;
  } */
`;

const TwitterWrapper = styled.div`
  width: 90%;
  height: 80vh;
  border-radius: 20px;
  overflow: hidden;
  & > div {
    overflow: auto;
    height: 80vh;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    @media screen and (max-width: 800px) {
      height: 80vh;
    }
  }
`;

const LinkView = styled.div`
  background-color: #fff;
  padding: 20px;
  width: 760px;
  height: fit-content;
  border-radius: 20px;
  h4 {
    font-size: 1.6em;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  a {
    font-size: 1.2em;
  }
  svg {
    vertical-align: baseline;
  }
  /* @media screen and (max-width: 800px) {
    width: 95%;
  } */
`;

const InnerModal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 30;
`;

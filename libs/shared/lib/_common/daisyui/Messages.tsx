"use client";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineLoading3Quarters,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { ReactNode, useEffect } from "react";
import { st } from "@shared/client";

type MessageType = "open" | "success" | "error" | "info" | "warning" | "loading";

type MessageProps = {
  content: ReactNode;
  type?: MessageType;
  duration: number; // in seconds
  keyForMessage: string;
};

type TimeOutType = {
  key: string;
  timeoutId: NodeJS.Timeout;
};

let timeOuts: TimeOutType[] = [];

const Message = ({ content, type = "info", duration, keyForMessage }: MessageProps) => {
  useEffect(() => {
    if (!content) return;

    // 기존의 timeouts에 key가 있으면, 기존의 timeout을 제거하고 새로운 timeout을 추가한다.
    const existingTimeOut = timeOuts.find((item) => item.key === keyForMessage);
    if (existingTimeOut) {
      clearTimeout(existingTimeOut.timeoutId);
      removeTimeOut(keyForMessage);
    }

    const timeoutId = setTimeout(() => {
      st.do.hideMessage(keyForMessage);
      removeTimeOut(keyForMessage);
    }, duration * 1000);
    addTimeOut(keyForMessage, timeoutId);

    return () => clearTimeout(timeoutId);
  }, [content, keyForMessage, type]);

  const addTimeOut = (key: string, timeoutId: NodeJS.Timeout) => {
    const filteredTimeOuts = timeOuts.filter((item) => item.key !== key);
    timeOuts = [...filteredTimeOuts, { key, timeoutId }];
  };

  const removeTimeOut = (key: string) => {
    timeOuts = timeOuts.filter((item) => item.key !== key);
  };

  const getIcon = (type) => {
    const icons = {
      info: <AiOutlineInfoCircle />,
      success: <AiOutlineCheckCircle />,
      error: <AiOutlineCloseCircle />,
      warning: <AiOutlineQuestionCircle />,
      loading: <AiOutlineLoading3Quarters className="animate-spin" />,
    };

    return icons[type] || <AiOutlineInfoCircle />;
  };

  const alertClassName = `alert alert-${type} py-2 min-h-[30px]`;
  return (
    <div className={alertClassName}>
      <div className="flex items-centerw w-72 md:w-96">
        {getIcon(type)}
        <span>{content}</span>
      </div>
    </div>
  );
};

export default function Messages() {
  const messages = st.use.messages();
  return (
    <div className="z-50 flex items-center justify-center toast toast-top toast-center">
      {messages.map((message) => (
        <Message
          content={message.content}
          type={message.type}
          duration={message.duration}
          key={message.key}
          keyForMessage={message.key}
        />
      ))}
    </div>
  );
}

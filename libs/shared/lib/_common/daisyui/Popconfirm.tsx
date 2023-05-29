"use client";
import { BiMessageRoundedError } from "react-icons/bi";
import { animated, useSpring } from "@react-spring/web";
import { usePage } from "@shared/client";
import React, { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

type PopconfirmProps = {
  title: string;
  description?: ReactNode;
  onConfirm?: () => void;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  okText?: string;
  cancelText?: string;
  children?: ReactNode;
};

export const Popconfirm = ({
  title,
  description,
  onConfirm,
  okButtonProps,
  cancelButtonProps,
  okText,
  cancelText,
  children,
}: PopconfirmProps) => {
  const { l } = usePage();
  const [isConfirming, setIsConfirming] = useState(false);

  const popconfirmProps = useSpring({
    opacity: isConfirming ? 1 : 0,
    from: {
      opacity: 0,
    },
  });

  // popconfirm 위치 조정 (x 좌표가 음수인 경우)
  useEffect(() => {
    const popconfirm = document.querySelector(".popconfirm");
    const popconfirmRect = popconfirm?.getBoundingClientRect();
    const popconfirmDeco = document.querySelector(".popconfirm-deco");

    // popconfirmRect.x 가 좌측 화면 밖으로 나가는 경우
    if (popconfirmRect && popconfirmRect?.x < 0) {
      popconfirm?.classList.add("left-0", "right-auto");
      popconfirmDeco?.classList.add("left-10", "left-auto");
    }
    // popconfirmRect.x 가 우측 화면 밖으로 나가는 경우
    if (popconfirmRect && popconfirmRect?.x + popconfirmRect?.width > window.innerWidth) {
      popconfirm?.classList.add("left-auto", "right-0");
    }
  }, [isConfirming]);

  const handleConfirm = () => {
    setIsConfirming(false);
    onConfirm && onConfirm();
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <>
      <div className="relative inline-block">
        <div className="trigger" onClick={() => setIsConfirming(true)}>
          {children}
        </div>
        {isConfirming && (
          <animated.div
            className="popconfirm absolute bottom-0 translate-y-[106%] -right-2 z-10 p-4 border border-gray-200 rounded-lg shadow-xl bg-white"
            style={popconfirmProps}
          >
            <div className="absolute w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200 rounded popconfirm-deco -top-2 right-10"></div>
            <div className="flex gap-1">
              <BiMessageRoundedError className="text-orange-500" />
              <div>
                <p className="mb-2 font-bold whitespace-nowrap">{title}</p>
                <div className="mb-2 whitespace-nowrap">{description}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-xs btn-outline" onClick={handleCancel} {...cancelButtonProps}>
                {cancelText || l("shared.cancel")}
              </button>
              <button className="btn btn-xs" onClick={handleConfirm} {...okButtonProps}>
                {okText || l("shared.ok")}
              </button>
            </div>
          </animated.div>
        )}
      </div>
      {isConfirming && (
        <div className="absolute top-0 left-0 w-full h-screen" onClick={() => setIsConfirming(false)}></div>
      )}
    </>
  );
};

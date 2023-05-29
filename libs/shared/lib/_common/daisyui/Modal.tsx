"use client";
import { AiOutlineSend } from "react-icons/ai";
import { animated, useSpring } from "@react-spring/web";
import { twMerge } from "tailwind-merge";
import { usePage } from "@shared/client";
import React, { ButtonHTMLAttributes, ReactNode, useEffect, useRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

type ModalProps = {
  title?: ReactNode;
  open: boolean;
  width?: string | number;
  onOk?: () => void;
  onCancel: () => void;
  footer?: ReactNode;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  className?: string;
  children: ReactNode;
};

export const Modal = ({
  title,
  open,
  width = "520px",
  onOk,
  onCancel,
  footer,
  okButtonProps,
  cancelButtonProps,
  className = "",
  children,
}: ModalProps) => {
  const { l } = usePage();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
    };
    if (!modalRef.current) return;
    const modalNode = modalRef.current;
    if (open) {
      document.body.style.overflow = "hidden";
      modalNode.addEventListener("scroll", handleScroll);
    } else {
      document.body.style.overflow = "visible";
      modalNode.removeEventListener("scroll", handleScroll);
    }
    return () => {
      document.body.style.overflow = "visible";
      modalNode.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  const handleCloseModal = () => {
    onCancel();
  };

  const handleOk = () => {
    onOk && onOk();
    handleCloseModal();
  };

  const bgProps = useSpring({
    backgroundColor: open ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)",
    from: { backgroundColor: "rgba(0, 0, 0, 0)" },
  });

  const modalProps = useSpring({
    opacity: open ? 1 : 0,
    scale: open ? 1 : 0.8,
    from: { opacity: 0, scale: 0.8 },
  });

  if (!open) return <></>;

  return (
    <animated.div
      ref={modalRef}
      className="fixed top-0 left-0 z-20 flex items-center justify-center w-screen h-screen overflow-hidden"
      style={bgProps}
    >
      <animated.div
        className={twMerge("p-5 bg-base-100 rounded-lg relative max-h-[80%] overflow-y-auto", className)}
        style={{ width: width, ...modalProps }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleCloseModal} className="absolute btn btn-sm btn-circle btn-ghost right-2 top-3">
          ✕
        </button>
        {title && <div className="mb-4 text-lg font-bold">{title}</div>}
        {children}
        {footer || footer === null ? (
          <div>{footer}</div>
        ) : footer === false ? null : (
          <div className="flex justify-center gap-2 mt-6">
            <button className="flex gap-2 btn btn-primary" onClick={handleOk} {...okButtonProps}>
              <AiOutlineSend />
              {l("shared.ok")}
            </button>
            <button className="border-dashed btn btn-outline" onClick={handleCloseModal} {...cancelButtonProps}>
              {l("shared.cancel")}
            </button>
          </div>
        )}
      </animated.div>
    </animated.div>
  );
};

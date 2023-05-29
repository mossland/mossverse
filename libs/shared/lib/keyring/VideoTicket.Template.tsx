"use client";
import { st, usePage } from "@mib/client";

interface VideoTicketEditProps {
  videoTicketId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ videoTicketId = undefined }: VideoTicketEditProps) => {
  const videoTicketForm = st.use.videoTicketForm();
  const { l } = usePage();
  return <div className="flex items-center mb-4"></div>;
};

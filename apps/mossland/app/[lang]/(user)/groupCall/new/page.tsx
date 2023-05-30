"use client";
import { DataEditModal } from "@shared/client";
import { GroupCall } from "@social/client";
import { st } from "@mossland/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    st.do.newGroupCall({ type: "video" });
  }, []);
  return (
    <div className="flex">
      <DataEditModal sliceName="groupCall" onCancel={() => router.back()} onSubmit={() => router.push("/groupCall")}>
        <GroupCall.Edit.General />
      </DataEditModal>
    </div>
  );
}

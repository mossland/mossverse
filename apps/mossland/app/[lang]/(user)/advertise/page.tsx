"use client";
import { st } from "@mossland/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const self = st.use.self();
  useEffect(() => {
    //
  }, []);

  return <div>AdvertisePage</div>;
}

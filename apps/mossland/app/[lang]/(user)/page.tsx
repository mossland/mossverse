import { fetch } from "@mossland/client";
import { redirect } from "next/navigation";

export default async function Page() {
  const { mapList } = await fetch.decentverse.initMap({ limit: 0 });
  const map = mapList.find((map) => map.name === "mossland2");
  if (map) redirect(`/map/${map.id}`);
  return <div className=""></div>;
}

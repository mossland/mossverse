import { Map } from "@decentverse/client";
import { fetch } from "@mossland/client";

export default async function Page() {
  const { mapList } = await fetch.decentverse.initMap({ limit: 0 });
  return (
    <div className="">
      <div className="flex gap-12 mt-12 ml-12">
        {mapList.map((map) => (
          <Map.Unit.Admin key={map.id} map={map} href={`/map/${map.id}`} />
        ))}
      </div>
    </div>
  );
}

"use client";
import { Admin, AdminLayout, Image, Product, Thing, Token } from "@shared/client";
import { Advertise, MocSurvey, st } from "@mossland/client";
import { Asset, Character, Map } from "@decentverse/client";
import { Listing, Raffle } from "@platform/client";
import { cnst } from "@util/client";

export interface MapEditorProps {
  uri: string;
  networkType: cnst.NetworkType;
}

export default function Page() {
  return (
    <AdminLayout
      getActiveSummary={st.do.getActiveSummary}
      logo={
        <div className="flex items-center gap-3 text-white ">
          <Image src="/logo/platform_logo.png" className="object-contain " width={200} height={36} />
          Admin
        </div>
      }
      pageMenus={[
        {
          title: "Data",
          menus: [
            Admin.Util.Menu,
            Token.Util.Menu,
            Product.Util.Menu,
            Thing.Util.Menu,
            Advertise.Util.Menu,
            Asset.Util.Menu,
            Character.Util.Menu,
            MocSurvey.Util.Menu,
            Listing.Util.Menu,
            Raffle.Util.Menu,
          ],
        },
        { title: "Map", menus: Map.Util.MenuEditor },
      ]}
    />
  );
}

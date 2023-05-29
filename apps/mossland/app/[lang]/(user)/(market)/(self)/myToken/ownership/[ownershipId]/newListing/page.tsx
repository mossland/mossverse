"use client";
import { Common, fetch, st } from "@mossland/client";
import { DataEditModal } from "@shared/client";
import { Listing } from "@platform/client";
import { useEffect } from "react";

export default function Page({ params: { ownershipId } }) {
  const self = st.use.self();
  const ownership = st.use.ownership();
  const thingMap = st.use.thingMap();
  const MMOC =
    thingMap !== "loading" ? (fetch.shared.Thing.find([...thingMap.values()], "MMOC") as fetch.shared.Thing) : null;

  useEffect(() => {
    st.do.viewOwnership(ownershipId);
  }, [ownershipId]);

  useEffect(() => {
    if (ownership === "loading") return;
    st.do.newListing({
      ...ownership,
      user: self,
      value: 0,
      priceTags: [{ thing: MMOC, type: "thing", discountPrice: 0, price: 0, token: null }],
    } as any);
  }, [ownership]);

  return (
    <div className="overflow-hidden">
      <DataEditModal
        type="form"
        sliceName="character"
        renderSubmit={(item, opt) => (
          <Common.SubmitButton className="mx-[50px]" onClick={() => st.do.createListing()}>
            판매 시작
          </Common.SubmitButton>
        )}
      >
        <Listing.Edit.InSelf />
      </DataEditModal>
    </div>
  );
}

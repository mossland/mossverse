"use client";
import * as Trade from "./_client";
import { DataEditModal, DataListContainer, LoadUnits, LoadView } from "@shared/client";
import { DefaultOf, ModelsProps, ServerInit, ServerView } from "@util/client";
import { fetch } from "@platform/client";

export const Admin = ({ sliceName = "trade", init }: ModelsProps<fetch.Trade>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Trade.Unit.Admin}
      renderDashboard={Trade.Util.Stat}
      queryMap={fetch.tradeQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(trade: DefaultOf<fetch.Trade>) => `${trade.name}`}>
          <Trade.Edit.General sliceName={sliceName} />
        </DataEditModal>
      }
      columns={["description", "policy", "status", "createdAt"]}
      actions={(trade: fetch.LightTrade, idx) => ["remove", "edit"]}
    />
  );
};
interface MarketProps {
  className?: string;
  init: ServerInit<"trade", fetch.LightTrade>;
}
export const Market = ({ className, init }: MarketProps) => {
  return (
    <LoadUnits
      className={className}
      init={init}
      renderItem={(trade) => <Trade.Unit.Market trade={trade} href={`/trade/${trade.id}`} />}
      renderEmpty={() => (
        <div className="flex items-center justify-center w-full h-full min-h-[400px]">
          <div>No Trades</div>
        </div>
      )}
    />
  );
};

interface ViewMarketProps {
  view: ServerView<"trade", fetch.Trade>;
}
export const ViewMarket = ({ view }: ViewMarketProps) => {
  return <LoadView view={view} renderView={(trade) => <Trade.View.Market trade={trade} />} />;
};

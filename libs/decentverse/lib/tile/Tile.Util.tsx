"use client";
import * as Tile from "./_client";
import { AiOutlineNumber, AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch, st } from "@decentverse/client";

export const Menu: DataMenuItem = {
  key: "tile",
  label: "Tile",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Tile.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "tile",
  queryMap = fetch.tileQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.TileSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalTile"]}
      hidePresents={hidePresents}
    />
  );
};

export const ToolBox = () => {
  const tileModal = st.use.tileModal();
  const toolBoxPosition = st.use.toolBoxPosition();
  if (tileModal !== "toolBox") return <></>;
  return (
    <div className={`absolute top-[${toolBoxPosition[1]}px] left-[${toolBoxPosition[0]}px]`}>
      <button
        className="gap-2 btn"
        onClick={() => null}
        // onClick={() => st.do.processTile(tile.id, idx)}
      >
        <AiOutlineNumber />
        ToolBox
      </button>
    </div>
  );
};

import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@decentverse/data-access";

interface ToolBoxProps {
  slice?: slice.TileSlice;
  tile: gql.LightTile;
  idx?: number;
}
export const ToolBox = ({ slice = st.slice.tile, tile, idx }: ToolBoxProps) => {
  const tileModal = slice.use.tileModal();
  const toolBoxPosition = slice.use.toolBoxPosition();
  if (tileModal !== "toolBox") return <></>;
  return (
    <div className={`absolute top-[${toolBoxPosition[1]}px] left-[${toolBoxPosition[0]}px]`}>
      <button
        className="gap-2 btn"
        onClick={() => null}
        // onClick={() => slice.do.processTile(tile.id, idx)}
      >
        <NumberOutlined />
        ToolBox
      </button>
    </div>
  );
};

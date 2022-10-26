import { types, useInventory } from "../../stores";
import { Modal, InputNumber } from "antd";
import { Socket } from "socket.io-client";

export const ItemOptionModal = ({
  itemId,
  socket,
  callback,
  maxNum,
  index,
}: {
  itemId: string;
  callback: types.ItemCallback;
  socket: Socket;
  maxNum: number;
  index: number;
}) => {
  const isShowItemOption = useInventory((state) => state.isShowItemOption);
  const toggleItemOption = useInventory((state) => state.toggleItemOption);
  const updateInputItemNum = useInventory((state) => state.updateInputItemNum);
  const inputItemNum = useInventory((state) => state.inputItemNum);
  const applyItem = useInventory((state) => state.applyItem);
  const itemMenuIndex = useInventory((state) => state.itemMenuIndex);

  if (itemMenuIndex !== index) return null;

  return (
    <Modal
      title="Quantity"
      width={300}
      open={isShowItemOption}
      onCancel={() => toggleItemOption(index)}
      onOk={() => applyItem(itemId, socket, callback, { num: inputItemNum })}
    >
      <InputNumber min={1} max={maxNum} value={inputItemNum} onChange={(val) => val && updateInputItemNum(val)} />
    </Modal>
  );
};

"use client";
type SelectionProps = {
  selection: string;
  itemIndex: number;
  removeItem: (itemIndex: number) => void;
  updateItem: (value: string, itemIndex: number) => void;
};

export const Selection = ({ itemIndex, removeItem, selection, updateItem }: SelectionProps) => {
  return (
    <div className="flex items-center mb-[10px] mt-[10px] ">
      <div className="w-full">
        <input className="w-full" value={selection} onChange={(e) => updateItem(e.target.value as string, itemIndex)} />
      </div>
      <button
        disabled={itemIndex === 0}
        className="ml-[10px] rounded-md disabled:bg-gray-400 disabled:opacity-50 px-4 py-2"
        onClick={() => removeItem(itemIndex)}
      >
        <img className="" src="/images/remove.svg" alt="remove" />
      </button>
    </div>
  );
};

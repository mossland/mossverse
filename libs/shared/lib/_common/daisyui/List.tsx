import { twMerge } from "tailwind-merge";
import React, { ReactNode } from "react";

type ListProps<T> = {
  grid?: {
    gutter?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
  dataSource?: T[];
  renderItem?: (item: T, idx: number) => React.ReactNode;
  className?: string;
  children?: ReactNode;
};

export function List<T>({ grid, dataSource, renderItem, className = "", children }: ListProps<T>) {
  const gridClassNames = grid
    ? twMerge(
        `grid gap-${grid.gutter ?? 0} `,
        `grid-cols-${grid.xs ?? 1} sm:grid-cols-${grid.sm ?? 2} md:grid-cols-${grid.md ?? 1} `,
        `lg:grid-cols-${grid.lg ?? 2} xl:grid-cols-${grid.xl ?? 3} 2xl:grid-cols-${grid.xxl ?? 4}`,
        className
      )
    : className;

  return (
    <div className={gridClassNames}>
      {dataSource?.map((item, index) => (
        <div key={index} className={`inline-block w-full`}>
          {renderItem && renderItem(item, index)}
        </div>
      ))}
      {children}
    </div>
  );
}

type ListItemProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  itemLayout?: "horizontal" | "vertical";
};

export const ListItem = ({ children, onClick, className = "", style, itemLayout = "horizontal" }: ListItemProps) => {
  const layoutClassName = itemLayout === "horizontal" ? "flex-row" : "flex-col";
  return (
    <div
      onClick={onClick}
      className={twMerge("flex justify-between  gap-1", layoutClassName, className)}
      style={{ ...style }}
    >
      {children}
    </div>
  );
};
List.Item = ListItem;

type ListItemMetaProps = {
  avatar?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const ListItemMeta = ({ avatar, title, description, className = "", style }: ListItemMetaProps) => {
  return (
    <div className={twMerge("flex items-start py-2 w-full ", className)} style={{ ...style }}>
      {avatar && <div className="mr-2">{avatar}</div>}
      <div className="flex flex-col w-full">
        <div className="mb-1 text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
  );
};
// List.Item.Meta = ListItemMeta;
ListItem.Meta = ListItemMeta;

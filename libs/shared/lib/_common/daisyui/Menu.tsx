"use client";
import { AiFillCaretDown, AiOutlineEllipsis } from "react-icons/ai";
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { st } from "@shared/client";
import { twMerge } from "tailwind-merge";

export type MenuItem = {
  label: ReactNode;
  key: string;
  path?: string;
  children?: MenuItem[];
  icon?: ReactNode;
  type?: string;
};

type MenuProps = {
  className?: string;
  ulClassName?: string;
  style?: React.CSSProperties;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  mode?: "horizontal" | "inline";
  items: MenuItem[];
  onClick?: (item: MenuItem) => void;
  activeStyle?: "active" | "bordered";
  inlineCollapsed?: boolean;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
};

export const Menu = ({
  items,
  onClick,
  selectedKeys,
  defaultSelectedKeys,
  className = "",
  ulClassName = "",
  style,
  mode = "inline",
  activeStyle = "active",
  inlineCollapsed,
  onMouseOver,
  onMouseLeave,
}: MenuProps) => {
  const [expandedKey, setExpandedKey] = useState<string>(); // 서브메뉴
  const [currentKey, setCurrentKey] = useState<string | null>(defaultSelectedKeys?.[0] || null); // 선택된 메뉴
  const modeClassName = mode === "horizontal" ? "menu-horizontal flex-row" : "";
  const menuRef = useRef<HTMLDivElement | null>(null);
  const LiRefs = useRef<HTMLLIElement[]>([]);
  const overflowLiRef = useRef<HTMLLIElement | null>(null);
  const itemWidthsRef = useRef<number[]>([]);
  const innerWidth = st.use.innerWidth();

  const subMenuClassName =
    mode === "horizontal"
      ? `z-50  fixed bottom-0 translate-y-[98%] border-0 rounded-sm shadow-lg bg-white flex flex-col`
      : "flex  flex-col gap-0 p-0 bg-primary/10 hover:bg-primary/10 overflow-hidden";

  const subMenuItemClassName =
    mode === "inline"
      ? "w-full h-full btn btn-ghost px-2 m-0 hover:bg-primary/20 btn btn-ghost text-primary font-normal"
      : "w-full text-center duration-300 whitespace-nowrap btn btn-ghost text-primary font-normal";

  const activeClassName = activeStyle === "active" ? "[&>div]:bg-primary/20 [&>div]:text-primary" : "bordered";

  const [overflowMenuItems, setOverflowMenuItems] = useState<MenuItem[]>([]);

  // 초기화. 각각 아이템의 너비를 구함
  useLayoutEffect(() => {
    if (mode !== "horizontal") return;
    const menu = menuRef.current;
    if (!menu) return;
    const liList = LiRefs.current;
    const widths: number[] = [];
    liList.forEach((li) => {
      widths.push(li.getBoundingClientRect().width);
    });
    itemWidthsRef.current = widths;
    checkOverflow();
  }, []);

  // 브라우저 너비가 줄어들면, overflowMenuItems에 추가
  useEffect(() => checkOverflow(), [innerWidth]);

  const checkOverflow = useCallback(() => {
    if (mode !== "horizontal" || !itemWidthsRef.current.length) return;
    const menu = menuRef.current;
    if (!menu) return;
    // const overflowLiWidth = overflowLiRef?.current?.getBoundingClientRect().width || 0;
    const totalWidth = menu.getBoundingClientRect().width;
    const widths = itemWidthsRef.current;
    const overflowItems: MenuItem[] = [];
    let accumulatedWidth = 0;
    for (let i = 0; i < widths.length; i++) {
      accumulatedWidth += widths[i];
      if (accumulatedWidth > totalWidth) {
        if (overflowItems.length === 0 && i - 1 >= 0) overflowItems.push(items[i - 1]);
        overflowItems.push(items[i]);
      }
    }
    setOverflowMenuItems(overflowItems);
  }, [items, mode]);

  const handleOnClick = (item: MenuItem) => {
    setCurrentKey(item.key);
    if (mode === "inline" && item.children) setExpandedKey(item.key === expandedKey ? undefined : item.key);
    else onClick?.(item);
  };

  const checkIsActive = (key: string) => {
    if (selectedKeys) return selectedKeys.includes(key);
    return key === currentKey;
  };
  return (
    <div
      ref={menuRef}
      id="menu"
      className={twMerge(mode === "horizontal" ? "shrink overflow-hidden w-full" : "w-fit", className)}
    >
      <ul
        className={twMerge("list-none h-full menu p-0 flex-nowrap  w-full", modeClassName, ulClassName)}
        style={{ ...style }}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        {items
          .filter((item) => !overflowMenuItems.some((overflowItem) => overflowItem.key === item.key))
          .map((item, idx) => {
            const isOverflowItem = overflowMenuItems.some((overflowItem) => overflowItem.key === item.key);
            const overflowClassName = isOverflowItem ? "opacity-0" : "";
            return (
              <li
                ref={(el) => el && (LiRefs.current[idx] = el)}
                id={item.key}
                key={item.key}
                className={twMerge("m-0 relative ", overflowClassName, checkIsActive(item.key) ? activeClassName : "")}
                onClick={() => !isOverflowItem && handleOnClick(item)}
                onMouseEnter={() =>
                  mode === "horizontal" &&
                  !isOverflowItem &&
                  item.children &&
                  expandedKey !== item.key &&
                  setExpandedKey(item.key)
                }
                onMouseLeave={() => mode === "horizontal" && !isOverflowItem && setExpandedKey(undefined)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    {item.icon}
                    {!inlineCollapsed && <div className="whitespace-nowrap">{item.label}</div>}
                  </div>
                  {item.children && mode === "inline" && (
                    <AiFillCaretDown
                      className={twMerge(
                        "text-xs transition-transform duration-400",
                        expandedKey === item.key ? "rotate-180" : ""
                      )}
                    />
                  )}
                </div>
                {/* 서브메뉴 */}
                {item.children && expandedKey === item.key && (
                  <div className={subMenuClassName}>
                    {item.children?.map((child) => (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick?.(child);
                          setExpandedKey(undefined);
                        }}
                        key={child.key}
                        className={subMenuItemClassName}
                      >
                        {child.label}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        {overflowMenuItems.length > 0 && mode === "horizontal" && (
          <OverflowMenu overflowItems={overflowMenuItems} onClick={onClick} />
        )}
      </ul>
    </div>
  );
};

type OverflowMenuProps = {
  overflowItems: MenuItem[];
  onClick?: (item: MenuItem) => void;
};

const OverflowMenu = ({ overflowItems, onClick }: OverflowMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string>(); // 서브메뉴
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);
  return (
    <li className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div>
        <AiOutlineEllipsis />
      </div>
      {isOpen && (
        <div className="z-50 fixed -bottom-0 translate-y-[98%]  border-0 rounded-sm shadow-lg bg-white flex flex-col p-2">
          {overflowItems.map((item) => (
            <div
              key={item.key}
              onClick={() => onClick?.(item)}
              className="relative font-normal whitespace-nowrap btn btn-ghost text-primary"
              onMouseEnter={() => item.children && expandedKey !== item.key && setExpandedKey(item.key)}
              onMouseLeave={() => setExpandedKey(undefined)}
            >
              {item.label}
              {item.children && expandedKey === item.key && (
                <div className="absolute left-0 top-0 translate-x-[-100%] bg-white drop-shadow p-4">
                  {item.children?.map((child) => (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick?.(child);
                        setExpandedKey(undefined);
                      }}
                      key={child.key}
                      className="flex items-center justify-center font-normal text-center btn btn-ghost text-primary"
                      // className="block font-normal text-center btn-sm text-primary h-fit btn btn-ghost "
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

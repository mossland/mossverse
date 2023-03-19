import { DataMenuItem } from "@shared/util-client";
import { Menu } from "antd";
import { ReactNode, useEffect, useRef, useState } from "react";
import { st, gql, useLocale } from "@shared/data-access";
import Router from "next/router";
interface Props {
  defaultMenu?: string;
  isWide?: boolean;
  topMenu?: string;
  subMenu?: string;
  pageMenus: { title: string; menus: DataMenuItem[] | DataMenuItem }[];
  logo?: ReactNode;
  footer?: ReactNode;
}

const Footer = () => {
  const { l } = useLocale();

  return (
    <div className="container">
      <div>{l("main.footer1")}</div>
      <div>{l("main.footer2")}</div>
      <div>{l("main.footer3")}</div>
    </div>
  );
};

export const AdminLayout = ({
  defaultMenu = "admin",
  logo,
  pageMenus,
  topMenu,
  subMenu,
  footer = <Footer />,
}: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { l } = useLocale();
  const pageMenu = pageMenus.find((pageMenu) => pageMenu.title === topMenu) ?? pageMenus[0];
  const menuItems = pageMenu.menus;
  const isArray = Array.isArray(menuItems);
  return (
    <div className="block min-h-screen mx-auto mt-0 overflow-hidden">
      <div className="fixed z-50 flex justify-between w-full h-12 bg-black">
        <div className="flex items-center justify-center mt-1 ml-5">{logo}</div>
        <div className="flex justify-center w-full">
          <Menu
            className="flex justify-center w-full"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
            mode="horizontal"
            selectedKeys={[pageMenu.title]}
            onClick={({ key }) => Router.push(`/admin?topMenu=${key}`)}
            items={pageMenus.map((pageMenu) => ({
              key: pageMenu.title,
              label: <div className="text-white">{pageMenu.title}</div>,
            }))}
          />
        </div>
        <div>{l("main.profile")}</div>
      </div>
      {isArray && (
        <div className="fixed h-full mt-12">
          <Menu
            style={{ height: "100vh" }}
            defaultSelectedKeys={[(menuItems as DataMenuItem[])[0].key]}
            inlineCollapsed={!menuOpen}
            mode="inline"
            items={menuItems.map((menuItem) => ({ ...menuItem, render: undefined }))}
            selectedKeys={[subMenu ?? (menuItems as DataMenuItem[])[0].key]}
            onClick={({ key }) => Router.push(`/admin?topMenu=${pageMenu.title}&subMenu=${key}`)}
            onMouseOver={() => !menuOpen && setMenuOpen(true)}
            onMouseLeave={() => menuOpen && setMenuOpen(false)}
          />
        </div>
      )}
      <div className={`mt-20 ${!isArray ? "mx-12" : menuOpen ? "ml-48" : "ml-24"} mr-4 duration-300 min-h-screen`}>
        {isArray
          ? (menuItems.find((menuItem) => menuItem.key === subMenu) ?? (menuItems as DataMenuItem[])[0]).render()
          : (menuItems as DataMenuItem).render()}
      </div>{" "}
      <div className="p-8 bg-black/5">{footer}</div>
    </div>
  );
};

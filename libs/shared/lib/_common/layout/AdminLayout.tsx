"use client";
import { Admin, Menu, st, usePage } from "@shared/client";
import { DataMenuItem, useInterval } from "@util/client";
import { ReactNode, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface AdminLayoutProps {
  defaultMenu?: string;
  pageMenus: { title: string; menus: DataMenuItem[] | DataMenuItem }[];
  logo?: ReactNode;
  footer?: ReactNode;
  getActiveSummary?: () => void;
}

export const AdminLayout = ({ defaultMenu = "admin", logo, pageMenus, footer, getActiveSummary }: AdminLayoutProps) => {
  const router = useRouter();
  const topMenu = useSearchParams()?.get("topMenu");
  const subMenu = useSearchParams()?.get("subMenu");
  const [menuOpen, setMenuOpen] = useState(false);
  const { l } = usePage();
  const pageMenu = pageMenus.find((pageMenu) => pageMenu.title === topMenu) ?? pageMenus[0];
  const menuItems = pageMenu.menus;
  const isArray = Array.isArray(menuItems);
  const me = st.use.me();
  const Render: any = isArray
    ? (menuItems.find((menuItem) => menuItem.key === subMenu) ?? (menuItems as DataMenuItem[])[0]).render
    : (menuItems as DataMenuItem).render;
  useInterval(() => {
    me.id && getActiveSummary?.();
  }, 2000);
  if (!me.id?.length || ["signup", "signin"].includes(topMenu ?? "")) return <Admin.Util.Auth logo={logo} />;
  return (
    <div className="block min-h-screen mx-auto mt-0 overflow-hidden">
      <div className="fixed z-50 flex items-center justify-between w-full h-12 bg-black">
        <div className="mt-1 ml-5">{logo}</div>

        <Menu
          className="top-0 left-0 right-0 flex justify-center h-12 m-auto w-72"
          ulClassName="h-12"
          mode="horizontal"
          selectedKeys={[pageMenu.title]}
          onClick={({ key }) => router.push(`/admin?topMenu=${key}`)}
          items={pageMenus.map((pageMenu) => ({
            key: pageMenu.title,
            label: <div className="text-white">{pageMenu.title}</div>,
          }))}
        />

        <div className="mr-4 text-white w-36">{me.accountId}</div>
      </div>
      {isArray && (
        <div className="fixed h-full mt-12">
          <Menu
            className="text-xs shadow-lg"
            style={{ height: "100vh" }}
            defaultSelectedKeys={[(menuItems as DataMenuItem[])[0].key]}
            inlineCollapsed={!menuOpen}
            mode="inline"
            items={menuItems.map((menuItem) => ({
              ...menuItem,
              icon: <div className="grid h-5 place-items-center">{menuItem.icon}</div>,
              label: <div className="grid h-5 place-items-center">{menuItem.label}</div>,
              render: undefined,
            }))}
            selectedKeys={[subMenu ?? (menuItems as DataMenuItem[])[0].key]}
            onClick={({ key }) => router.push(`/admin?topMenu=${pageMenu.title}&subMenu=${key}`)}
            onMouseOver={() => !menuOpen && setMenuOpen(true)}
            onMouseLeave={() => menuOpen && setMenuOpen(false)}
          />
        </div>
      )}
      <div className={`mt-20 ${!isArray ? "mx-12" : menuOpen ? "ml-48" : "ml-24"} mr-4 duration-300 min-h-screen`}>
        <Render />
      </div>
      <div className="p-8 bg-black/5">
        {footer ?? (
          <div className="container">
            <div>{l("shared.footer1")}</div>
            <div>{l("shared.footer2")}</div>
          </div>
        )}
      </div>
    </div>
  );
};

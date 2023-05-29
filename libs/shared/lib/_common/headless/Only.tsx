"use client";
import { ReactNode } from "react";
import { cnst } from "@util/client";
import { st } from "@shared/client";

export interface OnlyShowProps {
  children: ReactNode | ReactNode[];
  show?: boolean | cnst.Responsive[];
}

export const OnlyShow = ({ children, show = false }: OnlyShowProps) => {
  const responsive = st.use.responsive();
  if (typeof show === "boolean") return show ? <>{children}</> : null;
  else return show.includes(responsive) ? <>{children}</> : null;
};

export interface OnlyAdminProps {
  children: ReactNode | ReactNode[];
  roles?: cnst.AdminRole[];
}

export const OnlyAdmin = ({ children, roles }: OnlyAdminProps) => {
  const me = st.use.me();
  if (!me.id) return null;
  if (roles && roles.every((role) => !me.roles.includes(role))) return null;
  return <>{children}</>;
};

export interface OnlyUserProps {
  children?: React.ReactNode | React.ReactNode[];
  roles?: cnst.UserRole[];
}

export const OnlyUser = ({ children, roles }: OnlyUserProps) => {
  const self = (st as any).use.self();
  if (!self.id) return null;
  if (roles && roles.every((role) => !self.roles.includes(role))) return null;
  return <>{children}</>;
};

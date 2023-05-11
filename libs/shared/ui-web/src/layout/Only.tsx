import { st } from "@shared/data-access";
import { cnst } from "@shared/util";
import { ReactNode } from "react";

interface OnlyAdminProps {
  children: ReactNode | ReactNode[];
  roles?: cnst.AdminRole[];
}

export const OnlyAdmin = ({ children, roles }: OnlyAdminProps) => {
  const me = st.use.me();
  if (!me.id) return null;
  if (roles && roles.every((role) => !me.roles.includes(role))) return null;
  return <>{children}</>;
};

interface OnlyUserProps {
  children?: React.ReactNode | React.ReactNode[];
  roles?: cnst.UserRole[];
}

export const OnlyUser = ({ children, roles }: OnlyUserProps) => {
  const self = (st as any).use.self();
  if (!self.id) return null;
  if (roles && roles.every((role) => !self.roles.includes(role))) return null;
  return children;
};

"use client";
import { ReactNode, useMemo, useRef } from "react";
import { ServerEdit, ServerView, Utils } from "@util/client";
import { Skeleton } from "../daisyui";
import { gqlTemp, st } from "@shared/client";

export interface LoadViewProps<T extends string, M> {
  className?: string;
  view: ServerView<T, M>;
  noDiv?: boolean;
  loading?: ReactNode;
  renderView: (model: M) => ReactNode;
}
export default function LoadView<T extends string, M>({
  className,
  view,
  noDiv,
  loading = (
    <div className="grid w-full h-full place-items-center">
      <Skeleton active />
    </div>
  ),
  renderView,
}: LoadViewProps<T, M>) {
  const loaded = useRef(false);
  const { refName } = view;
  const model = st.use[`${refName}` as any]();
  // if (
  //   model !== "loading"
  //   && st.get()[`${view.refName}ViewAt` as any].getTime() >= view[`${view.refName}ViewAt` as any].getTime()
  // )
  //   loaded.current = true; //! view 는 안해도 될듯 하면 캐시로 인해서 버그남
  const modelInit = useMemo(() => {
    if (loaded.current) return model;
    const { [`${refName}Obj`]: modelObj } = view as any;
    const crystal = gqlTemp[`crystalize${Utils.capitalize(refName)}`](modelObj);
    st.set({
      [`${refName}`]: crystal,
      [`${refName}Modal`]: "view",
      [`${refName}ViewAt`]: view[`${refName}ViewAt` as any],
    });
    loaded.current = true;
    return crystal;
  }, []);
  const renderModel = !loaded.current ? modelInit : model === "loading" ? "loading" : model;
  if (renderModel === "loading") return <>{loading}</>;
  return noDiv ? <>{renderView(renderModel)}</> : <div className={className}>{renderView(renderModel)}</div>;
}

export interface LoadEditProps<T extends string, M> {
  className?: string;
  edit: ServerEdit<T, M>;
  modal?: string;
  noDiv?: boolean;
  children?: any;
}
export const LoadEdit = <T extends string, M>({ className, edit, modal, noDiv, children }: LoadEditProps<T, M>) => {
  const loaded = useRef(false);
  const { refName } = edit;
  const { [`${refName}Obj`]: modelObj } = edit as any;
  const model = useMemo(() => {
    const crystal = gqlTemp[`crystalize${Utils.capitalize(refName)}`](modelObj);
    st.set({ [`${refName}Form`]: Utils.deepObjectify(crystal), [`${refName}Modal`]: modal ?? "edit" });
    return crystal;
  }, []);
  return children;
};

import dynamic from "next/dynamic";
import { Suspense } from "react";

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const ReactverseWithNoSSR = dynamic(() => import("../components/ReactverseWrapper"), { ssr: false });
  return (
    <>
      <ReactverseWithNoSSR />
    </>
  );
}

export default Index;

import React, { use } from "react";

export default function Page({ params }) {
  // const as = use(test());
  console.log("server page");
  return <div>asd</div>;
}

// export async function test() {
//   console.log("hello SSR!");
//   const res = await fetch("http://localhost:3000/api/test");
//   return "hello SSR!";
// }

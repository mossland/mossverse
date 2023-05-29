import { Link } from "@shared/client";
import { StakePool, fetch, usePage } from "@mossland/client";

export default async function Layout({ children, params: { stakePoolId } }) {
  // const { stakePoolList } = await fetch.initStakePool();
  const { path } = usePage();
  const { stakePool, stakePoolView } = await fetch.viewStakePool(stakePoolId);
  // !account.id && jwt && st.do.login({ auth: "user", jwt });

  return (
    <div className="relative w-full h-full ">
      <StakePool.View.General stakePool={stakePool} />
      <div className="w-full">
        <div className="flex items-center w-full border-black border-solid border-y-2">
          <Link
            className="flex justify-center w-full border-r border-black border-solid"
            href={`/stakePool/${stakePool.id}/new`}
          >
            <button className={`w-full py-2 ${path.includes("new") && "font-bold"}`}>새로 예치하기</button>
          </Link>
          <Link
            className="flex justify-center w-full border-l border-black border-solid"
            href={`/stakePool/${stakePool.id}/myStakePool`}
          >
            <button className={`w-full py-2 ${path.includes("myStakePool") && "font-bold"}`}>내 예치</button>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

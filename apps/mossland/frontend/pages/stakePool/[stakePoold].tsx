import { useEffect } from "react";
import { gql, st, store } from "../../stores";
import { useRouter } from "next/router";

export function StakePoolPage() {
  const router = useRouter();
  const { stakePoolId } = router.query;
  const self = st.use.self();
  useEffect(() => {
    //
  }, []);

  return <div>StakePoolPage</div>;
}

export default StakePoolPage;

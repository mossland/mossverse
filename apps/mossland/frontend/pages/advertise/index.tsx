import { useEffect } from "react";
import { gql, st, store } from "../../stores";
import { useRouter } from "next/router";

export function AdvertisePage() {
  const router = useRouter();
  const self = st.use.self();
  useEffect(() => {
    //
  }, []);

  return <div>AdvertisePage</div>;
}

export default AdvertisePage;

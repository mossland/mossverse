import { useState, useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import { Stream, Game, Interface, Login, ReactverseLayout, Kicked, Pending } from "../index";
import { io, Socket as Soc } from "socket.io-client";
import { Utils, cnst } from "@shared/util";
import { client } from "@shared/util-client";
export interface ReactverseProps {
  uri: string;
  ws: string;
  networkType: cnst.NetworkType;
  config: gql.Configuration;
}

export const Reactverse = ({ uri, ws, config, networkType }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  const worldStatus = store.world.use.status();
  const isKicked = store.world.use.isKicked();
  const isPending = store.world.use.isPending();
  const initKeyring = store.shared.keyring.use.init();
  const setGuest = (user: gql.User) => store.user.setState({ ...user, user: { ...user } });
  const initWorld = store.world.use.initWorld();
  const initMap = store.map.use.init();
  const setupConfiguration = store.world.use.setupConfiguration();
  const initWallet = store.shared.wallet.use.init();
  const self = store.user.use.self();
  const me = store.shared.keyring.use.me();
  useEffect(() => {
    const socket = io(ws, { transports: ["websocket"] });
    client.setLink(uri);
    setSocket(socket);
    config && setupConfiguration(config);
    initKeyring();
    socket.on("connect", () => setIsConnected(true));
    const url = window.location.href;
    if (url.includes("guest=true")) {
      initMap("game");
      const guestName = `guest#${Utils.randomNumber(1000)}`;
      const guestUser: gql.User = {
        ...gql.defaultUser,
        id: guestName,
        nickname: guestName,
      };
      setGuest(guestUser);
      initWorld(guestUser);
    }
  }, []);

  useEffect(() => {
    if (!self?.keyring || self.role === "guest") return;
    initWallet(me?.wallets);
  }, [me]);

  window.addEventListener("beforeunload", (ev) => {
    ev.preventDefault();
    localStorage.removeItem("walletconnect");
    localStorage.removeItem("ally-supports-cache");
    // return (ev.returnValue = "Are you sure you want to close?");
    return;
  });
  if (!socket || !isConnected) return <></>;
  return (
    <ReactverseLayout>
      {worldStatus === "none" ? (
        <Login
          backgroundImage={config?.login?.backgroundImage}
          logo={config?.login?.logoImage}
          networkType={networkType}
        />
      ) : isKicked ? (
        <Kicked />
      ) : (
        <>
          {/* {!isLoaded() && <GameLoading />} */}
          {isPending && <Pending />}
          <Interface socket={socket} />
          <Game socket={socket} />
          <Stream socket={socket} />
        </>
      )}
    </ReactverseLayout>
  );
};

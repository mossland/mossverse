import { useState, useEffect } from "react";
import { walletStore, keyringStore, mapStore, setLink, userStore, worldStore } from "./stores";
import { Stream, Game, Interface, Login, ReactverseLayout, Kicked, Pending } from "./ui-web";
import { io, Socket as Soc } from "socket.io-client";
import { useInventory, types } from "./stores";
import { worldEventStore } from "./stores/worldEvent";
import { Utils, cnst } from "@shared/util";
export interface ReactverseProps {
  uri: string;
  ws: string;
  networkType: cnst.NetworkType;
  config: types.Configuration;
  itemCallbacks?: types.ItemCallback[];
  eventCallback?: types.EventCallback;
}

export const Reactverse = ({ uri, ws, config, itemCallbacks, networkType, eventCallback }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  const worldStatus = worldStore.use.status();
  const isKicked = worldEventStore.use.isKicked();
  const isPending = worldEventStore.use.isPending();
  const initKeyring = keyringStore.use.init();
  const setGuest = (user: types.User) => userStore.setState({ ...user, user: { ...user } });
  // const setItems = useInventory((state) => state.setItems);
  // const setItemCallbacks = useInventory((state) => state.setItemCallbacks);
  const initWorld = worldStore.use.initWorld();
  const initMap = mapStore.use.init();
  const setupConfiguration = worldStore.use.setupConfiguration();
  const intWallet = walletStore.use.init();
  const self = userStore.use.self();

  useEffect(() => {
    setLink(uri);
    const socket = io(ws, { transports: ["websocket"] });
    setSocket(socket);
    config && setupConfiguration(config);
    initKeyring(networkType);
    socket.on("connect", () => setIsConnected(true));
    const url = window.location.href;
    if (url.includes("guest=true")) {
      initMap("game");
      const guestName = `guest#${Utils.randomNumber(1000)}`;
      const guestUser: types.User = {
        ...types.defaultUser,
        id: guestName,
        nickname: guestName,
      };
      setGuest(guestUser);
      initWorld(guestUser);
    }
  }, []);

  useEffect(() => {
    if (!self?.keyring) return;
    intWallet(self.keyring.wallets);
  }, [self?.keyring]);

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
          <Game socket={socket} eventCallback={eventCallback} />
          <Stream socket={socket} />
        </>
      )}
    </ReactverseLayout>
  );
};

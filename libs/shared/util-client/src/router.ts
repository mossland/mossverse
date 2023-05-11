import { WalletNetworkType } from "./wallet";
import Router, { NextRouter } from "next/router";
import { InitActionForm } from "./decorators";
import { isMobile } from "react-device-detect";
import { logger } from "./logger";

type DecodedURLQuery = { init: { [key: string]: InitActionForm<any> }; state: { [key: string]: any } };
type EncodedURLQuery = { x: string };

export type PathMap = {
  paths: string[];
  home: string;
  unauthorized: string;
};
export class PageMap {
  admin: PathMap;
  user: PathMap;
  public: PathMap;
  init: { [key: string]: any } = {};
  state: { [key: string]: any } = {};
  auth: "user" | "admin" | "public" = "admin";
  isMobile = isMobile;
  blockCountries: string[] = [];
  constructor(pageMap: Partial<PageMap> & { admin: PathMap; user: PathMap; public: PathMap }) {
    this.set(pageMap);
  }
  set(pageMap: Partial<PageMap>) {
    Object.assign(this, pageMap);
    return this;
  }
  getAuth(): "user" | "admin" | "public" {
    const pathname = Router.pathname;
    if (this.admin.paths.some((path) => pathname.startsWith(path))) this.auth = "admin";
    else if (this.public.paths.some((path) => pathname.startsWith(path))) this.auth = "public";
    else if (this.user.paths.some((path) => pathname.startsWith(path))) this.auth = "user";
    else this.auth = "public";
    return this.auth;
  }
  getHome() {
    return this[this.getAuth()].home;
  }
  getUnauthorized() {
    return this[this.getAuth()].unauthorized;
  }
  unauthorize() {
    if (Router.pathname === this.getUnauthorized()) return;
    logger.verbose(`Unauthorized in ${this.getAuth()}. Redirecting to ${this.getUnauthorized()}.`);
    Router.push({ pathname: this.getUnauthorized(), query: { loginType: "requireAuth", asPath: Router.asPath } });
  }
  redirectAfterLogin(loginType, auth: "user" | "admin" | "public" = this.getAuth()) {
    const type = Router.query.loginType ?? loginType ?? "signin";
    logger.verbose(`Redirecting after login: ${type} in ${auth}.`);
    if (type === "skipReplace") return;
    if (type === "signin") Router.push(this[auth].home);
    else if (type === "signup") Router.push(this[auth].home);
    else if (type === "autoLogin") return;
    else if (type === "requireAuth") Router.push((Router.query.asPath as string) ?? this[auth].home);
  }
  setState(state: { [key: string]: any }, { replace }: { replace?: boolean } = {}) {
    this.state = { ...(replace ? this.state : {}), ...state };
    Router.replace({
      pathname: Router.pathname,
      query: this.#encodeQuery({ init: this.init, state: this.state }),
    });
  }
  goto(path: string, query: { [key: string]: any } = {}) {
    Router.push({ pathname: path, query: this.#encodeQuery(query as any) });
  }
  enter() {
    const query = this.#decodeQuery(Router.query as any);
    this.init = query.init ?? {};
    this.state = query.state ?? {};
  }
  #encodeQuery(query: DecodedURLQuery): EncodedURLQuery {
    return { x: Buffer.from(JSON.stringify(query)).toString("base64") };
  }
  #decodeQuery(query: EncodedURLQuery): DecodedURLQuery {
    return { ...query, ...(query.x ? JSON.parse(Buffer.from(query.x, "base64").toString("utf8")) : {}) };
  }
}

export const pageMap = new PageMap({
  public: {
    paths: [],
    home: "/",
    unauthorized: "/signin",
  },
  user: {
    paths: ["/"],
    home: "/",
    unauthorized: "/signin",
  },
  admin: {
    paths: [],
    home: "/",
    unauthorized: "/admin",
  },
});
export type LoginType = "signin" | "signup" | "requireAuth" | "autoLogin" | "skipReplace";
export type LoginAuth = "user" | "admin" | "public";
export type LoginForm = {
  auth: LoginAuth;
  loginType?: LoginType;
  jwt?: string | null;
};

export type Geolocation = {
  countryCode: string;
  countryName: string;
  city: string;
  postal: number | null;
  location: {
    type: "Point";
    coordinates: number[];
  };
  ipv4: string;
  state: string;
};
export const defaultGeolocation: Geolocation = {
  countryCode: "",
  countryName: "",
  city: "",
  postal: null,
  location: {
    type: "Point",
    coordinates: [0, 0],
  },
  ipv4: "",
  state: "",
};
export const getGeolocation = async (): Promise<Geolocation> => {
  const ipData = await fetch("https://geolocation-db.com/json/");
  const geodb = await ipData.json();
  return {
    countryCode: geodb.country_code,
    countryName: geodb.country_name,
    city: geodb.city,
    postal: geodb.postal,
    location: {
      type: "Point",
      coordinates: [geodb.longitude, geodb.latitude],
    },
    ipv4: geodb.IPv4,
    state: geodb.state,
  };
};
export type InitClientForm = {
  uri: string;
  ws: string | null;
  networkType?: WalletNetworkType;
  jwt?: string | undefined;
  // msg: MessageInstance;
  // noti: NotificationInstance;
  whoAmI: () => Promise<void>;
};
export const defaultInitClientForm = {
  networkType: "debugnet" as WalletNetworkType,
  whoAmI: async ({ reset }: { reset?: boolean } = {}) => {
    //
  },
};

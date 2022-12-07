import { cnst } from "@shared/util";
import { message, notification } from "antd";
import { MessageInstance } from "antd/lib/message";
import { NotificationInstance } from "antd/lib/notification";
import { WalletNetworkType } from "./wallet";

export type PathMap = {
  paths: string[];
  home: string;
  unauthorized: string;
};
export class PageMap {
  admin: PathMap;
  user: PathMap;
  public: PathMap;
  entry = "/";
  entryQuery = {};
  auth: "user" | "admin" | "public" = "admin";
  blockCountries: string[] = [];
  constructor(pageMap: Partial<PageMap> & { admin: PathMap; user: PathMap; public: PathMap }) {
    Object.assign(this, pageMap);
  }
  setEntry(path: string, query: any) {
    this.entry = path;
    this.entryQuery = query;
    return this;
  }
  getAuth(path?: string): "user" | "admin" | "public" {
    const pathname = path ?? this.entry;
    if (this.admin.paths.some((path) => pathname.startsWith(path))) this.auth = "admin";
    else if (this.public.paths.some((path) => pathname.startsWith(path))) this.auth = "public";
    else if (this.user.paths.some((path) => pathname.startsWith(path))) this.auth = "user";
    else this.auth = "public";
    return this.auth;
  }
  getHome(auth?: "user" | "admin" | "public") {
    return this[auth ?? this.auth].home;
  }
  getUnauthorized(auth?: "user" | "admin" | "public") {
    return this[auth ?? this.auth].unauthorized;
  }
}

export const defaultPageMap = new PageMap({
  public: {
    paths: ["/"],
    home: "/",
    unauthorized: "/signin",
  },
  user: {
    paths: ["/"],
    home: "/",
    unauthorized: "/signin",
  },
  admin: {
    paths: ["/"],
    home: "/",
    unauthorized: "/admin",
  },
});

export type LoginForm = {
  auth: "user" | "admin" | "public";
  type: "signin" | "signup" | "requireAuth" | "autoLogin";
  token?: string;
};

export type Geolocation = {
  countryCode: string;
  countryName: string;
  city: string;
  postal: number | null;
  latitude: number;
  longitude: number;
  ipv4: string;
  state: string;
};
export const defaultGeolocation: Geolocation = {
  countryCode: "",
  countryName: "",
  city: "",
  postal: null,
  latitude: 0,
  longitude: 0,
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
    latitude: geodb.latitude,
    longitude: geodb.longitude,
    ipv4: geodb.IPv4,
    state: geodb.state,
  };
};
export type InitClientForm = {
  pageMap: PageMap;
  uri: string;
  ws: string | null;
  networkType?: WalletNetworkType;
  msg: MessageInstance;
  noti: NotificationInstance;
  whoAmI: () => Promise<void>;
};
export const defaultInitClientForm = {
  pageMap: defaultPageMap,
  // entryPath: "/",
  // uri: "http://localhost:8080/graphql",
  // ws: null,
  msg: message as MessageInstance,
  noti: notification as NotificationInstance,
  geolocation: defaultGeolocation,
  networkType: "debugnet" as WalletNetworkType,
  whoAmI: async () => {
    //
  },
};

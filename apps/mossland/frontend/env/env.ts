import { Env } from "./envType";
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const env = require(`./env.${process.env["CLIENT_ENV"] ?? "testing.local"}.ts`).env as Env;

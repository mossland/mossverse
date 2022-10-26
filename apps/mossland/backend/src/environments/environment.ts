// eslint-disable-next-line @typescript-eslint/no-var-requires
export const { environment } = require(`./environment.${process.env.SERVER_ENV ?? "local"}.ts`);

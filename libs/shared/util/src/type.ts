export type GetObject<T> = Omit<{ [K in keyof T]: T[K] }, "prototype">;
export type GetStateObject<T> = Omit<
  { [K in keyof T as T[K] extends (...args: any) => any ? never : K]: T[K] },
  "prototype"
>;
export type GetActionObject<T> = Omit<
  { [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K] },
  "prototype"
>;

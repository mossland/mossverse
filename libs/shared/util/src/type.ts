export type GetObject<T> = { [K in keyof T]: T[K] };

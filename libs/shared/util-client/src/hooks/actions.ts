import { message } from "antd";

export const trying = async <Return>(
  name: string,
  fnOrPromise: Promise<Return> | ((...args: any) => Promise<Return> | Return),
  { onError }: { onError?: (err: string) => void } = {}
): Promise<Return> => {
  const key = `${name}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  message.open({ key, type: "loading", content: `${name}...`, duration: 30000 });
  try {
    const ret = typeof fnOrPromise === "function" ? await fnOrPromise() : await fnOrPromise;
    message.open({ key, type: "success", content: `${name} success` });
    return ret;
  } catch (err) {
    const content = `${name} Error: ${typeof err === "string" ? err : err.message}`;
    message.error({ key, type: "error", content });
    onError?.(content);
    throw new Error(content);
  }
};

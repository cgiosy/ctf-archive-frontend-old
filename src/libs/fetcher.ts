import Config from "../config";
import { getLocalStorage } from "./utils";
import type { IUserPrivateInfo } from "../types";

const user = getLocalStorage<IUserPrivateInfo>("user");

export const get = (path: string, query?: Record<string, string>, config?: RequestInit) => {
  const searchParams = new URLSearchParams(query).toString();
  return fetch(Config.apiHost + path + (searchParams ? "?" + searchParams : "")).then(
    async (res) => {
      if (res.ok === false) {
        const status = res.status.toString();
        const text = await res.text();
        throw new Error(text ? status + ":" + text : status);
      }
      const json = await res.json();
      return json;
    }
  );
};

export const post = (path: string, body?: unknown, config?: RequestInit) =>
  fetch(Config.apiHost + path, {
    ...config,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": user()?.sessionid ?? "",
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (res.ok === false) {
      const status = res.status.toString();
      const text = await res.text();
      throw new Error(text ? status + ":" + text : status);
    }
    const json = await res.json();
    return json;
  });

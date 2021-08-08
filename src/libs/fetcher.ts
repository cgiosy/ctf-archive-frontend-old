import Config from "../config";
import { getLocalStorage } from "./utils";
import type { IUserPrivateInfo } from "../types";

const user = getLocalStorage<IUserPrivateInfo>("user");

const toSearchParams = (query?: Record<string, string>) => {
  const searchParams = new URLSearchParams(query).toString();
  return searchParams ? "?" + searchParams : "";
};

const done = async (res: Response) => {
  if (res.ok === false) {
    const status = res.status.toString();
    const text = await res.text();
    throw new Error(text ? status + ":" + text : status);
  }
  const json = await res.json();
  return json;
};

export const get = <T>(
  path: string,
  query?: Record<string, string>,
  config?: RequestInit
): Promise<T> => {
  const abortController = new AbortController();
  const request = fetch(Config.apiHost + path + toSearchParams(query), {
    ...config,
    method: "GET",
    headers: {
      "X-Session-Id": user()?.sessionid ?? "",
    },
    signal: abortController.signal,
  }).then(done);

  // https://github.com/tannerlinsley/react-query/issues/1265
  // @ts-expect-error
  request.cancel = () => {
    abortController.abort();
  };

  return request;
};

export const post = <T, U>(path: string, body?: U, config?: RequestInit): Promise<T> =>
  fetch(Config.apiHost + path, {
    ...config,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": user()?.sessionid ?? "",
    },
    body: JSON.stringify(body),
  }).then(done);

export const del = <T>(
  path: string,
  query?: Record<string, string>,
  config?: RequestInit
): Promise<T> =>
  fetch(Config.apiHost + path + toSearchParams(query), {
    ...config,
    method: "DELETE",
    headers: {
      "X-Session-Id": user()?.sessionid ?? "",
    },
  }).then(done);

export const put = <T, U>(path: string, body?: U, config?: RequestInit): Promise<T> =>
  fetch(Config.apiHost + path, {
    ...config,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": user()?.sessionid ?? "",
    },
    body: JSON.stringify(body),
  }).then(done);

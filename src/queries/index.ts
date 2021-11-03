import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from "@sveltestack/svelte-query";
import { get } from "../libs/fetcher";
import { getLocalStorage } from "../libs/utils";
import type {
  IProblemDetails,
  IStatus,
  IUserMiniInfo,
  IUserPrivateInfo,
  IUserPublicInfo,
} from "../types";

export const use =
  <QueryKeyType extends QueryKey, QueryData, QueryKeyArgs extends any[]>(
    queryKeyGen: QueryKeyType | ((...queryKeyArgs: QueryKeyArgs) => QueryKeyType),
    queryFn: QueryFunction<QueryData, QueryKeyType>,
    args?: UseQueryOptions<QueryData, unknown, QueryData, QueryKeyType>,
    enabled: boolean = false
  ) =>
  () => {
    const query = useQuery({
      queryKey: enabled ? (queryKeyGen as QueryKeyType) : undefined,
      queryFn,
      enabled,
    });
    let queryKey: QueryKeyType | undefined = undefined;
    return [
      query,
      (...queryKeyArgs: QueryKeyArgs) => {
        queryKey = typeof queryKeyGen === "function" ? queryKeyGen(...queryKeyArgs) : queryKeyGen;
        return query.setOptions({
          queryKey,
          queryFn,
          ...args,
        });
      },
      () => queryKey,
    ] as const;
  };

export const useSessionid = use(
  "sessionid",
  getLocalStorage<string>("sessionid"),
  {
    cacheTime: 0,
    staleTime: 0,
  },
  true
);

export const useMyInfo = use("me", () => get<IUserPrivateInfo>("/users/-"), { retry: false });

export const useUser = use(
  (username: string) => ["users", username] as const,
  ({ queryKey: [, username] }) => get<IUserPublicInfo>("/users/" + username)
);

export const useUsers = use(
  (query: string, sort: string, page: number) => ["users", query, sort, page] as const,
  ({ queryKey: [, query, sort, page] }) =>
    get<{
      count: number;
      users: IUserMiniInfo[];
    }>("/users", {
      query,
      sort,
      page: page.toString(),
    })
);

export const useStatus = use("status", () => get<IStatus>("/problems/status"));

export const useProblem = use(
  (problem: number) => ["problem", problem],
  ({ queryKey: [, problem] }) => get<IProblemDetails>("/problems/" + problem)
);

export const useProblemDetails = use(
  (problem: number) => ["problem", problem],
  ({ queryKey: [, problem] }) => get<IProblemDetails>("/problems/" + problem),
  {
    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  }
);

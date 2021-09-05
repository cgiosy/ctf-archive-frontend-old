<script lang="ts">
  import { register, init, getLocaleFromNavigator } from "svelte-i18n";
  import { Router } from "@roxi/routify";
  import {
    QueryClient,
    QueryClientProvider,
    createLocalStoragePersistor,
    persistQueryClient,
  } from "@sveltestack/svelte-query";
  import { routes } from "../.routify/routes";

  const cacheTime = 1000 * 60 * 60 * 24 * 7; // 7 days
  const staleTime = Number(localStorage.getItem("testingStaleTime")) || 1000 * 60 * 5; // 5 mins

  const retryWhenServerError = (failureCount: number, error: unknown) =>
    failureCount < 4 && (error as Error).message[0] === "5";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime,
        staleTime,
        retry: retryWhenServerError,
      },
    },
  });

  const localStoragePersistor = createLocalStoragePersistor();

  persistQueryClient({
    queryClient,
    maxAge: cacheTime,
    persistor: localStoragePersistor,
  }).then(() => {
    // persistent cache bug?
    queryClient.removeQueries("problems");
  });

  register("ko", () => import("./constants/ko"));
  init({
    fallbackLocale: "ko",
    initialLocale: getLocaleFromNavigator(),
  });
</script>

<QueryClientProvider client={queryClient}>
  <Router {routes} />
</QueryClientProvider>

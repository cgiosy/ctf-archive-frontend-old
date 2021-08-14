<script lang="ts">
  import { Router } from "@roxi/routify";
  import {
    QueryClient,
    QueryClientProvider,
    createLocalStoragePersistor,
    persistQueryClient,
  } from "@sveltestack/svelte-query";
  import { routes } from "../.routify/routes";

  const cacheTime = 1000 * 60 * 60 * 24 * 7; // 7 days
  const staleTime = 1000 * 60 * 5; // 5 mins

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime,
        staleTime,
      },
    },
  });

  const localStoragePersistor = createLocalStoragePersistor();

  persistQueryClient({
    queryClient,
    maxAge: cacheTime,
    persistor: localStoragePersistor,
  });
</script>

<QueryClientProvider client={queryClient}>
  <Router {routes} />
</QueryClientProvider>

<script lang="ts">
  import { Router } from "@roxi/routify";
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
  import { routes } from "../.routify/routes";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <Router {routes} />
</QueryClientProvider>

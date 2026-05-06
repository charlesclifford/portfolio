
"use client"
import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR we set a staleTime > 0 to avoid refetching
        // immediately on the client after a server render.
        staleTime: 60 * 1000,
        // Show stale data while revalidating (no loading flash
        // when navigating between project pages).
        refetchOnWindowFocus: false,
        retry: 2,
      },
    },
  });
}

// Singleton for the browser, new instance per request on the server.
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Avoid useState initialiser so the client isn't recreated
  // on every render when used inside Suspense boundaries.
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

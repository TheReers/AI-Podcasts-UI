"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

const reactQueryConfig = {
  refetchOnWindowFocus: false,
  retry: false,
};

const defaultOptions = {
  queries: reactQueryConfig,
  mutations: reactQueryConfig,
};

const queryClient = new QueryClient({ defaultOptions });

const toastOptions = {
  duration: 10000,
};

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-right" toastOptions={toastOptions} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

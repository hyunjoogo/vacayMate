import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";

const QueryClientConfig = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export default QueryClientConfig;

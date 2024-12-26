import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes"
import { ChakraProvider } from "@chakra-ui/react";
import AuthContextProvider from "./auth/authContext";
import { HelmetProvider } from 'react-helmet-async';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AuthContextProvider>
      <HelmetProvider>  
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ChakraProvider>
      </HelmetProvider>
  </AuthContextProvider>
);

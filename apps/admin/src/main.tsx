import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { AxiosError } from 'axios';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import env from '@/config/env';
import { useAuthStore } from '@/stores/auth-store';
import { handleServerError } from '@/lib/handle-server-error';
import { DirectionProvider } from './context/direction-provider';
import { FontProvider } from './context/font-provider';
import { ThemeProvider } from './context/theme-provider';
import { routeTree } from './routeTree.gen';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (env.app.mode === 'development') {
          return false;
        }
        if (failureCount > 3 && env.app.mode === 'production') return false;
        return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0));
      },
      refetchOnWindowFocus: env.app.mode === 'production',
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const isRedirectError = error instanceof AxiosError && [401, 403, 500].includes(error.response?.status ?? 0);
      if (!isRedirectError) {
        handleServerError(error);
      }

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          useAuthStore.getState().auth.logout();
          const redirect = router.state.location.pathname;
          router.navigate({ to: '/sign-in', search: { redirect } });
        } else if (error.response?.status === 500) {
          router.navigate({ to: '/500' });
        } else if (error.response?.status === 403) {
          router.navigate({ to: '/403' });
        }
      }
    },
  }),
});

// Create a new router instance
const router = createRouter({
  routeTree,
  basepath: '/admin',
  context: { queryClient, auth: undefined! }, // auth will be injected by the provider or used in beforeLoad
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { auth } = useAuthStore();
  return <RouterProvider router={router} context={{ queryClient, auth }} />;
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontProvider>
            <DirectionProvider>
              <App />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

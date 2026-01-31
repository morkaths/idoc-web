import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { AxiosError } from 'axios';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import env from '@/config/env';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { handleServerError } from '@/lib/handle-server-error';
import { DirectionProvider } from './context/direction-provider';
import { FontProvider } from './context/font-provider';
import { ThemeProvider } from './context/theme-provider';
// Generated Routes
import { routeTree } from './routeTree.gen';
// Styles
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (env.app.mode === 'development') {
          console.log({ failureCount, error });
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

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!');
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Session expired!');
          useAuthStore.getState().auth.logout();
          const redirect = `${router.history.location.href}`;
          router.navigate({ to: '/sign-in', search: { redirect } });
        }
        if (error.response?.status === 500) {
          router.navigate({ to: '/500' });
        }
        if (error.response?.status === 403) {
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
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
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
              <RouterProvider router={router} />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

import { StrictMode, useMemo } from 'react';
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
          const auth = useAuthStore.getState().auth;
          if (auth.token || auth.user) {
            auth.logout();
          }

          if (!window.location.pathname.includes('/sign-in')) {
            const redirect = router.state.location.pathname;
            router.navigate({ to: '/sign-in', search: { redirect } });
          }
        } else if (error.response?.status === 500) {
          router.navigate({ to: '/500' });
        } else if (error.response?.status === 403) {
          router.navigate({ to: '/403' });
        }
      }
    },
  }),
});

// Extract basepath from env.app.url
const getBasePath = (url: string) => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  } catch (_e) {
    return '/admin';
  }
};

const basepath = getBasePath(env.app.url);

// Create a new router instance
const router = createRouter({
  routeTree,
  basepath,
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
  const context = useMemo(() => ({ queryClient, auth }), [auth]);
  return <RouterProvider router={router} context={context} />;
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

import { type QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import env from '@/config/env';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@repo/ui/components/sonner';
import { NavigationProgress } from '@/components/navigation-progress';
import { GeneralError } from '@/features/errors/general-error';
import { NotFoundError } from '@/features/errors/not-found-error';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={5000} />
        {env.app.mode === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    );
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});

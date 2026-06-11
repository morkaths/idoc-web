import { Outlet } from '@tanstack/react-router';
import { getCookie } from '@/lib/cookies';
import { cn } from '@/lib/utils';
import { LayoutProvider, useLayout } from '@/context/layout-provider';
import { SearchProvider } from '@/context/search-provider';
import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SkipToMain } from '@/components/skip-to-main';
import { ConfigDrawer } from './config-drawer';
import { Header } from './header';
import { Main } from './main';
import { NotificationBell } from './notification-bell';
import { ProfileDropdown } from './profile-dropdown';
import { Search } from './search';
import { ThemeSwitch } from './theme-switch';

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

export function AuthenticatedLayoutWrapper({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false';
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            dir='ltr'
            className={cn(
              '@container/content',
              'has-data-[layout=fixed]:h-svh',
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  );
}

/**
 * Inner layout that consumes the layout context (useLayout).
 * Must be rendered inside Providers so useLayout() is valid.
 */
function InnerLayout({ children }: AuthenticatedLayoutProps) {
  const { headerFixed, mainFixed } = useLayout();

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed={headerFixed}>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main className='flex flex-1 flex-col' fixed={mainFixed}>
        {children ?? <Outlet />}
      </Main>
    </>
  );
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <AuthenticatedLayoutWrapper>
      <InnerLayout>{children}</InnerLayout>
    </AuthenticatedLayoutWrapper>
  );
}

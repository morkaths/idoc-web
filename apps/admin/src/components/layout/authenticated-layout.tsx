import { Outlet } from '@tanstack/react-router';
import { getCookie } from '@/lib/cookies';
import { cn } from '@/lib/utils';
import { LayoutProvider, useLayout } from '@/context/layout-provider';
import { SearchProvider } from '@/context/search-provider';
import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SkipToMain } from '@/components/skip-to-main';
import { ConfigDrawer } from '../config-drawer';
import { ProfileDropdown } from '../profile-dropdown';
import { Search } from '../search';
import { ThemeSwitch } from '../theme-switch';
import { Header } from './header';
import { Main } from './main';

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
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
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

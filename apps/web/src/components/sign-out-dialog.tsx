import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
    const router = useRouter();
  const { auth } = useAuthStore();

  const handleSignOut = () => {
    toast.promise(
      auth.logout(),
      {
        loading: 'Signing out...',
        success: (result) => {
          if (result) {
            const currentPath = location.href;
            router.replace('/sign-in?redirect=' + encodeURIComponent(currentPath));
            return 'Signed out successfully!';
          }
          return 'Error signing out.';
        },
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  );
}

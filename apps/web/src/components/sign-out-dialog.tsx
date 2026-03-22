"use client";

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';
import { useLocale } from '@/hooks/ui/useLocale';

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const router = useRouter();
  const { t, keys } = useLocale('auth');

  const handleSignOut = () => {
    toast.promise(
      signOut({ redirect: false }),
      {
        loading: t(keys.form.states.signOut.loading),
        success: () => {
          const currentPath = location.href;
          router.replace('/sign-in?redirect=' + encodeURIComponent(currentPath));
          return t(keys.form.states.signOut.success);
        },
        error: () => t(keys.form.states.signOut.error),
      }
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t(keys.signOut.title)}
      desc={t(keys.signOut.description)}
      confirmText={t(keys.signOut.submit)}
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  );
}

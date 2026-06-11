import type { Metadata } from 'next';
import { SettingContent } from './_components/setting-content';
import SettingHeader from './_components/setting-header';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
};

export default function SettingPage() {
  return (
    <div className='mx-auto max-w-4xl space-y-6 px-4 py-10'>
      <SettingHeader />
      <SettingContent />
    </div>
  );
}

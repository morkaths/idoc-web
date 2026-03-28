import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your profile',
};

export default function ProfilePage() {
  return <div className='mx-auto max-w-4xl space-y-6 px-4 py-10'></div>;
}

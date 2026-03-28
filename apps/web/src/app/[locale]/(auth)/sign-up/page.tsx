import type { Metadata } from 'next';
import { SignUpView } from './_components/view';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new iDoc account',
};

export default function SignUpPage() {
  return <SignUpView />;
}

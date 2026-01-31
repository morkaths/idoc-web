import type { Metadata } from "next";
import { SignInView } from "./_components/view";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your iDoc account",
};

export default function SignInPage() {
  return <SignInView />;
}
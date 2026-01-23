import type { Metadata } from "next";
import { UnauthorizedView } from "./_components/view";

export const metadata: Metadata = {
  title: "401 - Unauthorized",
  description: "You are not authorized to access this page",
};

export default function UnauthorizedPage() {
  return <UnauthorizedView />;
}
import type { Metadata } from "next";
import { ForbiddenView } from "./_components/view";

export const metadata: Metadata = {
  title: "403 - Forbidden",
  description: "You do not have permission to access this resource",
};

export default function ForbiddenPage() {
  return <ForbiddenView />;
}
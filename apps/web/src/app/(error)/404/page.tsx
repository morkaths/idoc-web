import type { Metadata } from "next";
import { NotFoundView } from "@/app/(error)/404/_components/view";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist",
};

export default function NotFoundPage() {
  return <NotFoundView />;
}

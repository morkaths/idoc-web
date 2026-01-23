"use client";

import { Button } from "@repo/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export function NotFoundView() {
  const router = useRouter();
  
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-screen items-center border-x">
        <div>
          <div className="absolute inset-x-0 h-px bg-border" />
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="font-black font-mono text-8xl">
                404
              </EmptyTitle>
              <EmptyDescription className="text-nowrap">
                The page you're looking for might have been <br />
                moved or doesn't exist.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button variant='outline' onClick={() => router.back()}>
                  <ArrowLeft /> Go Back
                </Button>
                <Button onClick={() => router.push("/")}>
                  <Home />Back to Home
                </Button>
              </div>
            </EmptyContent>
          </Empty>
          <div className="absolute inset-x-0 h-px bg-border" />
        </div>
      </div>
    </div>
  );
}

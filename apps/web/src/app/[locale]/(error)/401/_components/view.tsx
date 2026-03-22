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
import { useLocale } from '@/hooks/ui/useLocale';

export function UnauthorizedView() {
  const router = useRouter();
  const { t, keys } = useLocale('error');

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-screen items-center border-x">
        <div>
          <div className="absolute inset-x-0 h-px bg-border" />
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="font-black font-mono text-8xl">
                401
              </EmptyTitle>
              <EmptyDescription className="text-balance text-center max-w-xs sm:max-w-md px-4">
                {t(keys[401].description)}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 px-4">
                <Button variant='outline' onClick={() => router.back()}>
                  <ArrowLeft /> {t(keys.actions.goBack)}
                </Button>
                <Button onClick={() => router.push("/")}>
                  <Home /> {t(keys.actions.backToHome)}
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

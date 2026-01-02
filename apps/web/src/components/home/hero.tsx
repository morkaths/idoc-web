import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import { LogoCloud } from "./logo-clound";

export default function HeroSection() {
  return (
    <div className="flex items-center justify-center px-6">
      <div className="text-center max-w-4xl gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link href="#">
            Over 10,000+ new research papers added <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className='mt-6 text-3xl leading-[1.2] font-bold text-balance sm:text-4xl lg:text-5xl'>
          Digital Document Library
          <br />
          <span className='relative'>
            Seamless
            <svg
              width='223'
              height='12'
              viewBox='0 0 223 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='absolute inset-x-0 bottom-0 w-full translate-y-1/2 max-sm:hidden'
            >
              <path
                d='M1.11716 10.428C39.7835 4.97282 75.9074 2.70494 114.894 1.98894C143.706 1.45983 175.684 0.313587 204.212 3.31596C209.925 3.60546 215.144 4.59884 221.535 5.74551'
                stroke='url(#paint0_linear_10365_68643)'
                strokeWidth='2'
                strokeLinecap='round'
              />
              <defs>
                <linearGradient
                  id='paint0_linear_10365_68643'
                  x1='18.8541'
                  y1='3.72033'
                  x2='42.6487'
                  y2='66.6308'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stopColor='var(--primary)' />
                  <stop offset='1' stopColor='var(--primary-foreground)' />
                </linearGradient>
              </defs>
            </svg>
          </span>{' '}
          Knowledge Management!
        </h1>
        <p className='mt-6 text-muted-foreground'>
          Access a world-class collection of digital books, academic journals,
          <br />
          and multimedia resources. Empowering researchers and students worldwide.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Get Started <ArrowUpRight className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="size-5" /> Watch Demo
          </Button>
        </div>
        <div className="mt-12">
          <LogoCloud />
        </div>
      </div>
    </div>
  );
}


import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href='/' className={cn('font-bold text-lg flex items-center gap-1.5', className)}>
      <svg
        viewBox='0 0 64 64'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-10 h-10'
      >
        <defs>
          <mask id='logo-mask'>
            <rect width='64' height='64' fill='white' />
            <rect x='22' y='14' width='36' height='36' rx='6' fill='black' />
          </mask>
        </defs>
        <rect
          x='14'
          y='22'
          width='36'
          height='36'
          rx='6'
          stroke='currentColor'
          strokeOpacity='0.4'
          strokeWidth='3'
          mask='url(#logo-mask)'
        />
        <rect
          x='22'
          y='14'
          width='36'
          height='36'
          rx='6'
          fill='currentColor'
          fillOpacity='0.02'
          stroke='currentColor'
          strokeWidth='4'
        />
        <circle cx='32' cy='25' r='2.5' fill='currentColor' />
        <rect x='30.5' y='31' width='3' height='11' rx='1.5' fill='currentColor' />
      </svg>
      <span className='hidden md:flex tracking-tight text-xl font-black'>iDoc</span>
    </Link>
  );
};

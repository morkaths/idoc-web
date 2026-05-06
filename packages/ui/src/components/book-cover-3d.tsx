"use client";

import { cn } from "@repo/ui/lib/utils";
import { useReducedMotion } from "motion/react";
import React from "react";

export interface BookCover3dProps {
  /** Additional CSS classes */
  className?: string;
  /** Cover image URL */
  src: string;
  /** Book title for alt text */
  title: string;
  /** Book width in pixels */
  width?: number;
  /** Book aspect ratio (default 2/3) */
  aspectRatio?: number;
}

const BOOK_DEPTH = "25px";
const BOOK_BORDER_RADIUS = "2px 4px 4px 2px";
const DEFAULT_WIDTH = 200;

const BookCover3d = ({
  src,
  title,
  width = DEFAULT_WIDTH,
  aspectRatio = 2 / 3,
  className,
}: BookCover3dProps) => {
  const shouldReduceMotion = useReducedMotion();
  const bookWidth = `${width}px`;
  const bookHeight = `${width / aspectRatio}px`;

  return (
    <div
      className={cn("inline-block w-fit", className)}
      style={{
        perspective: "1200px",
        ["--book-width" as string]: bookWidth,
        ["--book-height" as string]: bookHeight,
        ["--book-depth" as string]: BOOK_DEPTH,
      }}
    >
      {/* Rotate wrapper */}
      <div
        className={cn(
          "relative",
          "[transform-style:preserve-3d]",
          !shouldReduceMotion && [
            "transition-transform duration-500 ease-out",
            "hover:[transform:rotateY(-25deg)_rotateX(5deg)_scale(1.05)]",
            "group-hover:[transform:rotateY(-25deg)_rotateX(5deg)_scale(1.05)]",
          ]
        )}
        style={{
          width: bookWidth,
          height: bookHeight,
        }}
      >
        {/* Front cover */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col",
            "overflow-hidden",
            "[transform:translateZ(0px)]",
            "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)]",
            "bg-muted"
          )}
          style={{
            borderRadius: BOOK_BORDER_RADIUS,
          }}
        >
          <img
            src={src}
            alt={title}
            className="h-full w-full object-cover transition-all duration-300"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              filter: 'contrast(1.08) brightness(1.02)',
            }}
          />

          {/* Spine shadow overlay */}
          <div
            className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-black/20 to-transparent pointer-events-none"
          />

          {/* Surface shine overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"
          />
        </div>

        {/* Page edges (right side) */}
        <div
          aria-hidden
          className={cn(
            "absolute",
            "bg-[linear-gradient(90deg,rgb(240,240,240)_0%,rgb(220,220,220)_100%)]",
            "dark:bg-[linear-gradient(90deg,rgb(60,60,60)_0%,rgb(40,40,40)_100%)]"
          )}
          style={{
            height: `calc(${bookHeight} - 4px)`,
            width: BOOK_DEPTH,
            right: `calc(-1 * ${BOOK_DEPTH} / 2)`,
            top: "2px",
            transform: "rotateY(90deg)",
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
          }}
        />

        {/* Top edges */}
        <div
          aria-hidden
          className={cn(
            "absolute",
            "bg-[linear-gradient(180deg,rgb(240,240,240)_0%,rgb(220,220,220)_100%)]",
            "dark:bg-[linear-gradient(180deg,rgb(60,60,60)_0%,rgb(40,40,40)_100%)]"
          )}
          style={{
            width: `calc(${bookWidth} - 4px)`,
            height: BOOK_DEPTH,
            top: `calc(-1 * ${BOOK_DEPTH} / 2)`,
            left: "2px",
            transform: "rotateX(90deg)",
          }}
        />

        {/* Back cover */}
        <div
          aria-hidden
          className="absolute inset-0 bg-zinc-800"
          style={{
            borderRadius: BOOK_BORDER_RADIUS,
            transform: `translateZ(calc(-1 * ${BOOK_DEPTH}))`,
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
};

export default BookCover3d;

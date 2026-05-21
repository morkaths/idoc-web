"use client";

import React, { useState } from "react";
import { cn } from "@repo/ui/lib/utils";

export interface BookCover3dProps {
  /** Additional CSS classes */
  className?: string;
  /** Additional classes for the outer wrapper padding */
  wrapperClassName?: string;
  /** Cover image URL */
  src?: string;
  /** Book title for alt text */
  title: string;
  /** Optional fallback text when cover image is missing */
  fallbackText?: string;
  /** Book width in pixels */
  width?: number;
  /** Book aspect ratio (default 2/3) */
  aspectRatio?: number;
}

const DEFAULT_WIDTH = 200;
const BOOK_DEPTH = 24;

export default function BookCover3d({
  src,
  title,
  fallbackText,
  width = DEFAULT_WIDTH,
  aspectRatio = 2 / 3,
  className,
  wrapperClassName,
}: BookCover3dProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  const bookWidth = width;
  const bookHeight = width / aspectRatio;
  const displayText = fallbackText ?? title;

  return (
    <div
      className={cn("flex items-center justify-center p-12", wrapperClassName, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative touch-none transition-all duration-500 ease-out"
        style={
          {
            width: `${bookWidth}px`,
            height: `${bookHeight}px`,
            perspective: "1500px",
            transformStyle: "preserve-3d",
            transform: isHovered
              ? "rotateY(-10deg) scale(1.02)"
              : "rotateY(0deg)",
          } as React.CSSProperties
        }
      >
        {/* Front Cover (Mặt trước) - Đã đổi nền thành xám đen */}
        <div
          className="absolute inset-0 bg-background overflow-hidden flex flex-col border border-border transition-transform duration-500 ease-out"
          style={{
            transform: isHovered
              ? `translateZ(${BOOK_DEPTH / 2}px) rotateY(-25deg)`
              : `translateZ(${BOOK_DEPTH / 2}px) rotateY(0deg)`,
            transformOrigin: "left",
            borderRadius: "2px 4px 4px 2px",
            zIndex: 50,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {src && !hasError ? (
            <img
              src={src}
              alt={title}
              className="h-full w-full object-cover"
              onError={() => setHasError(true)}
              style={{
                transform: "translateZ(0)",
              }}
            />
          ) : (
            <div className="relative h-full w-full flex flex-col justify-end p-4 pl-6">
              {/* Dải màu phía trên (chiếm 40%) */}
              <div
                className="absolute top-0 left-0 right-0 h-[40%] z-10 bg-primary"
              />
              {/* Tên sách - Giới hạn 2-3 dòng, hỗ trợ sáng/tối */}
              <div className="z-20 h-[55%] flex items-end">
                <span className="text-sm font-semibold text-foreground/60 select-none line-clamp-3 leading-tight tracking-tight uppercase">
                  {displayText}
                </span>
              </div>
            </div>
          )}

          {/* Spine detail on front */}
          <div className="absolute top-0 left-0 bottom-0 w-2 z-30 flex flex-row justify-end pointer-events-none">
            <div className="w-[1px] h-full bg-white/10" />
            <div className="w-[1px] h-full bg-black/20" />
          </div>
        </div>

        {/* Inner Pages Stacks (Hiệu ứng nhiều trang sách) */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-y-1 right-1 bg-white border border-border/50 transition-transform duration-500 ease-out"
            style={{
              width: `calc(100% - 4px)`,
              left: "2px",
              transform: isHovered
                ? `translateZ(${BOOK_DEPTH / 2 - i * 3}px) rotateY(-${25 - i * 4}deg)`
                : `translateZ(${BOOK_DEPTH / 2 - i * 3}px) rotateY(0deg)`,
              transformOrigin: "left",
              zIndex: 40 - i,
              borderRadius: "1px 3px 3px 1px",
              background: `linear-gradient(to right, #fdfdfd 0%, #ffffff 10%, #fdfdfd 20%, #ffffff 100%)`,
            }}
          />
        ))}

        {/* Main Content Page (Trang nội dung chính - cố định) */}
        <div
          className="absolute inset-y-1 right-1 bg-white border border-border transition-transform duration-500 ease-out"
          style={{
            width: `calc(100% - 4px)`,
            left: "2px",
            transform: `translateZ(-${BOOK_DEPTH / 2 - 2}px)`,
            zIndex: 10,
            borderRadius: "1px 3px 3px 1px",
            background: "linear-gradient(to right, #f0f0f0 0%, #ffffff 5%, #ffffff 100%)",
          }}
        >
          <div className="p-6 opacity-10">
            <div className="h-2 w-3/4 bg-foreground/20 mb-2 rounded" />
            <div className="h-2 w-full bg-foreground/10 mb-2 rounded" />
            <div className="h-2 w-full bg-foreground/10 mb-2 rounded" />
            <div className="h-2 w-2/3 bg-foreground/10 mb-2 rounded" />
          </div>
        </div>

        {/* Back Cover (Mặt sau) - Đã đổi nền thành xám đen */}
        <div
          className="absolute inset-0 border border-border bg-background border-border transition-all duration-500 ease-out"
          style={{
            transform: `translateZ(-${BOOK_DEPTH / 2}px) rotateY(180deg)`,
            borderRadius: "4px 2px 2px 4px",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            zIndex: 5,
          }}
        />

        {/* Right Edge (Cạnh giấy bên phải) */}
        <div
          className="absolute bg-white transition-opacity duration-300"
          style={{
            width: `${BOOK_DEPTH}px`,
            height: `calc(100% - 6px)`,
            right: `-${BOOK_DEPTH / 2}px`,
            top: "3px",
            transform: "rotateY(90deg)",
            background: "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.05) 2px)",
            opacity: isHovered ? 0 : 1,
          }}
        />

        {/* Spine (Gáy sách) - Đổi nền xám đen và dải màu đỏ */}
        <div
          className="absolute bg-background border-y border-border"
          style={{
            width: `${BOOK_DEPTH}px`,
            height: "100%",
            left: `-${BOOK_DEPTH / 2}px`,
            transform: "rotateY(-90deg)",
            zIndex: 5,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[40%] bg-background/50"
          />
        </div>

        {/* Top/Bottom Edges */}
        <div
          className="absolute bg-background"
          style={{
            width: `calc(100% - 4px)`,
            height: `${BOOK_DEPTH}px`,
            top: `-${BOOK_DEPTH / 2}px`,
            left: "2px",
            transform: "rotateX(90deg)",
            background: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.05) 2px)",
          }}
        />
        <div
          className="absolute bg-background"
          style={{
            width: `calc(100% - 4px)`,
            height: `${BOOK_DEPTH}px`,
            bottom: `-${BOOK_DEPTH / 2}px`,
            left: "2px",
            transform: "rotateX(-90deg)",
            background: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.05) 2px)",
          }}
        />
      </div>
    </div>
  );
}

# iDoc Design Documentation

This document outlines the design system, visual foundations, and UI/UX principles governing the iDoc platform.

## 1. Project Vision
iDoc is a high-performance, modern book management and reading platform. The design prioritizes **clarity**, **content-focus**, and **premium aesthetics**, ensuring a seamless experience across all devices.

## 2. Visual Foundations

### 2.1 Color System (OKLCH)
We utilize the **OKLCH** color space to achieve perceptually uniform colors and high-precision contrast ratios. The system supports full native Light and Dark modes.

#### Light Mode (Day)
- **Background**: `oklch(1 0 0)` — Pure white for a clean, paper-like feel.
- **Foreground**: `oklch(0.129 0.042 264.695)` — Deep navy for optimal readability.
- **Primary**: `oklch(0.208 0.042 265.755)` — Professional Indigo used for key actions.
- **Muted**: `oklch(0.554 0.046 257.417)` — Soft grey for secondary information.

#### Dark Mode (Night)
- **Background**: `oklch(0.145 0 0)` — Neutral dark grey to reduce eye strain.
- **Foreground**: `oklch(0.985 0 0)` — Off-white to maintain contrast without being harsh.
- **Primary**: `oklch(0.922 0 0)` — High-visibility white for primary interactions.
- **Surface**: `oklch(0.205 0 0)` — Elevated card and popover backgrounds.

### 2.2 Typography
We employ a multi-font strategy to balance utility and character:
- **Primary Interface Font**: `Inter` (Sans-serif) — Used for readability, data-heavy views, and general UI.
- **Brand & Display Font**: `Manrope` — Used for headings and featured content to add a modern, geometric touch.

#### Type Scale
- **H1 (Hero)**: `text-5xl` (48px) | Bold | Leading-tight
- **H2 (Section)**: `text-4xl` (36px) | Bold
- **Body (Standard)**: `text-base` (16px) | Regular | Leading-normal
- **Meta (Small)**: `text-sm` (14px) | Medium | Muted-foreground

## 3. Design Tokens & Utilities

### 3.1 Shape & Form
- **Border Radius**: Default `--radius` is set to `0.5rem` (8px). 
- **Image Treatment**: Images use a slightly adjusted radius `min(var(--radius), 0.25rem)` to fit within containers gracefully.

### 3.2 Depth & Effects
- **Glassmorphism**: Headers and overlays utilize `backdrop-blur` (vibrancy effects) to maintain spatial context.
- **Elevation**: Subtle shadows (`box-shadow`) are used to indicate interactive layers and card surfaces.

## 4. UI Architecture
The iDoc UI is built upon a **Monorepo** structure, ensuring design consistency across all sub-apps.

- **Framework**: Next.js App Router.
- **Styling**: Tailwind CSS v4 (Modern Utility Engine).
- **Primitives**: Radix UI for accessible, unstyled components.
- **Icons**: Lucide React for consistent, lightweight iconography.

## 5. Design Principles

### 5.1 Mobile-First Orchestration
Layouts are designed for touch-first interaction and small viewports, then progressively enhanced for tablet and desktop experiences.

### 5.2 Micro-interactions
- **Feedback Loops**: All interactive elements (Buttons, Inputs, Links) provide immediate visual feedback on `hover`, `focus`, and `active` states.
- **Fluid Motion**: Page transitions and element entries are animated using `tw-animate-css` or `framer-motion` for a premium feel.

### 5.3 Semantic Structure
Every page follows a strict heading hierarchy (H1 -> H2 -> H3) and uses semantic HTML5 elements to ensure accessibility and SEO performance.

## 6. Directory Overview
- `packages/ui/src/components`: Atomic and molecular UI components (Shadcn pattern).
- `packages/ui/src/styles`: Global design tokens and CSS variable definitions.
- `apps/web/src/app/globals.css`: Application-specific style overrides.

---
*Last updated: May 2026. This document is automatically synchronized with the codebase.*

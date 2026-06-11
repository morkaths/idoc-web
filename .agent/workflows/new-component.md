---
description: How to create a new shared UI component in packages/ui
---

# Create New Shared UI Component

Add reusable components to `packages/ui/src/components/`. These are shared between both admin and web apps.

## Steps

### 1. Create the component file

Create `packages/ui/src/components/{component-name}.tsx`:

```typescript
'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * Props for the ComponentName component.
 */
export interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Description of the prop */
  variant?: 'default' | 'outline';
}

/**
 * A reusable component description.
 */
const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-styles-here',
          variant === 'outline' && 'outline-styles-here',
          className
        )}
        {...props}
      />
    );
  }
);
ComponentName.displayName = 'ComponentName';

export { ComponentName };
```

### 2. Export from barrel

Add to `packages/ui/src/components/index.ts` (or the main barrel export):

```typescript
export { ComponentName } from "./component-name";
```

### 3. Usage in apps

Import using the `@repo/ui` alias:

```typescript
import { ComponentName } from "@repo/ui/components/component-name";
```

## Key conventions

- Use `'use client'` directive if the component has client-side interactivity
- Use `React.forwardRef` for components that wrap DOM elements
- Set `displayName` for DevTools debugging
- Use `cn()` utility (from `clsx` + `tailwind-merge`) for className merging
- Use `class-variance-authority` (CVA) for complex variant systems:

  ```typescript
  import { cva, type VariantProps } from "class-variance-authority";

  const componentVariants = cva("base-classes", {
    variants: {
      variant: {
        default: "default-classes",
        destructive: "destructive-classes",
      },
      size: {
        sm: "small-classes",
        lg: "large-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  });
  ```

- Build on top of **Radix UI** primitives when the component needs accessibility features (dialog, dropdown, tooltip, etc.)
- Always check if the component already exists in `packages/ui/src/components/` before creating a new one
- TailwindCSS 4 classes only — no inline styles

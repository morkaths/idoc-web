# iDoc Web — Tech Stack

This document lists the core technologies, libraries, and tools used across the idoc-web monorepo.

> For system architecture and diagrams, see [ARCHITECTURE.md](./ARCHITECTURE.md).  
> For coding conventions and patterns, see [RULES.md](./RULES.md).

## Runtime & Language
| Technology    | Version  | Purpose                           |
|---------------|----------|-----------------------------------|
| Node.js       | 18+      | Server runtime                    |
| TypeScript    | ~5.9     | Type-safe development             |
| Turbo         | latest   | High-performance build system     |

## Framework & Routing
| Library              | Version  | Purpose                                  |
|----------------------|----------|------------------------------------------|
| Next.js (Web)        | 16.0.8   | React framework (App Router)             |
| Vite (Admin)         | ^7.2.4   | Fast build tool for React CSR            |
| TanStack Router      | ^1.139.3 | Type-safe routing for Admin app          |
| React                | ^19.2.3  | Core UI library                          |

## Data Fetching & State
| Library              | Version  | Purpose                                  |
|----------------------|----------|------------------------------------------|
| TanStack Query       | ^5.90.10 | Async state & server data management     |
| Axios                | ^1.13.2  | Promise-based HTTP client                |
| Zustand              | ^5.0.8   | Lightweight global state management      |
| next-intl            | ^4.8.1   | Internationalization (Web app)           |
| next-themes          | ^0.4.6   | Dark/light mode management               |

## UI & Styling
| Library              | Version  | Purpose                                  |
|----------------------|----------|------------------------------------------|
| TailwindCSS          | ^4.1.17  | Utility-first CSS framework (v4)         |
| Radix UI             | ^1.1.x   | Unstyled, accessible UI primitives       |
| Lucide React         | ^0.555.0 | Modern icon library                      |
| Sonner               | ^2.0.7   | Clean toast notifications                |
| CVA                  | ^0.7.1   | Class Variance Authority (variants)      |
| tailwind-merge       | ^3.4.0   | Merge Tailwind classes without conflicts |

## Forms & Validation
| Library              | Version  | Purpose                                  |
|----------------------|----------|------------------------------------------|
| React Hook Form      | ^7.67.0  | Performant, flexible forms               |
| Zod                  | ^4.1.13  | TypeScript-first schema validation       |
| @hookform/resolvers  | ^5.2.2   | Validation resolvers for Hook Form       |

## Specialized Components
| Library              | Version  | Purpose                                  |
|----------------------|----------|------------------------------------------|
| TanStack Table       | ^8.21.3  | Headless UI for building powerful tables |
| Recharts             | ^3.5.0   | Composable charting library              |
| react-pdf-viewer     | ^3.12.0  | PDF viewing components                   |
| react-reader         | ^2.0.15  | ePub reader component                    |
| input-otp            | ^1.4.2   | Accessible OTP input component           |

## Dev Tools & Quality
| Tool                 | Version  | Purpose                                  |
|----------------------|----------|------------------------------------------|
| ESLint               | ^9.39.1  | Pluggable linting utility (Flat Config)  |
| Prettier             | ^3.6.2   | Opinionated code formatter               |
| Knip                 | ^5.70.2  | Find unused files, dependencies, exports |
| Cypress              | ^15.6.0  | End-to-end testing framework             |
| Faker                | ^10.1.0  | Generate massive amounts of fake data    |

---

## Shared Packages (`packages/`)
| Package | Description |
|---|---|
| `@repo/ui` | Core design system & shared UI components |
| `@repo/tailwind-config` | Centralized TailwindCSS 4 configuration |
| `@repo/eslint-config` | Shared ESLint 9 rules for all workspaces |
| `@repo/typescript-config` | Reusable TypeScript configurations |

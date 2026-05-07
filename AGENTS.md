PROJECT OVERVIEW

App name: Foucs Forge
What it does: Productivity app for time managament and journalizing day-to-day task
Current stage: MVP 
Repo root: /src 
Mode: Local-only / Offline


TECH STACK
Framework:   React Native + Expo
Language:    TypeScript strict
Styling:     NativeWind / StyleSheet
State:       Zustand (in-memory) + MMKV (persistent)
Storage:     MMKV or expo-sqlite (on-device only)
Auth:        None
API:         None

FOLDER STRUCTURE
src/
├── app/              # Pages / routes (Next.js App Router or file-based routing)
├── components/
│   ├── ui/           # Primitives: Button, Input, Modal, Badge — no business logic
│   └── features/     # Domain components: InvoiceCard, UserMenu, CheckoutForm
├── lib/
│   ├── db.ts         # ALL database queries — never inline in components
│   ├── auth.ts       # Auth helpers and session utilities
│   └── utils.ts      # Shared pure utility functions
├── hooks/            # Custom React hooks (useAuth, useToast, useDebounce)
├── store/            # Global state stores (Zustand slices)
├── types/            # Shared TypeScript interfaces and enums
└── styles/           # Global CSS, design tokens, Tailwind config extensions

CODING CONVENTIONS
Naming

Components → PascalCase.tsx
Hooks → useCamelCase.ts
Utilities → camelCase.ts
Types/Interfaces → PascalCase (e.g. InvoiceItem, UserRole)
Constants → SCREAMING_SNAKE_CASE

Imports

Use @/ alias for absolute imports: import { Button } from '@/components/ui/Button'
No barrel index.ts files unless one already exists

Components

Named exports only — no default exports
Define a Props interface directly above each component
Keep components under 150 lines — split if larger
Co-locate styles with the component when using CSS Modules

TypeScript

Strict mode ON — no any, no @ts-ignore without an explanatory comment
Prefer interface for object shapes, type for unions/intersections
Every API response and DB query result must have an explicit return type

Error Handling

All async functions wrapped in try/catch
User-facing errors shown via the useToast hook — never raw alert()
Log errors with the logger utility, not console.log


PATTERNS TO FOLLOW
Server Component (data fetching)
tsx// app/invoices/page.tsx
import { getInvoices } from '@/lib/db'

export default async function InvoicesPage() {
  const invoices = await getInvoices()
  return <InvoiceList invoices={invoices} />
}
Client Component with async action
tsx'use client'
import { useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface Props { id: string }

export function DeleteButton({ id }: Props) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteItem(id)
      toast({ title: 'Deleted successfully', variant: 'success' })
    } catch (err) {
      toast({ title: 'Delete failed', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  )
}
DB query (all queries live in lib/db.ts)
tsexport async function getInvoices(userId: string): Promise<Invoice[]> {
  return db.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

HARD RULES — NEVER DO THESE

❌ Never use axios — use native fetch or the existing API client
❌ Never write DB queries inside components — always use lib/db.ts
❌ Never use useEffect for data fetching — use server components or React Query
❌ Never hardcode color values — use Tailwind tokens or CSS variables
❌ Never use console.log in committed code — use the logger utility
❌ Never use px units — use rem or the Tailwind spacing scale
❌ Never commit secrets — all env vars go in .env.local (gitignored)
❌ Never create a new hook/util without checking if one already exists in /hooks or /lib


DESIGN TOKENS
css--color-primary:   #0f172a;
--color-accent:    #6366f1;
--color-surface:   #f8fafc;
--color-danger:    #ef4444;
--color-success:   #22c55e;
--radius-base:     8px;
--radius-lg:       12px;
--shadow-card:     0 1px 3px rgba(0,0,0,0.08);
--font-sans:       'Geist', system-ui, sans-serif;
--font-mono:       'Geist Mono', monospace;

KEY DEPENDENCIES
json{
  "next": "14.2.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "zustand": "4.x",
  "@supabase/supabase-js": "2.x"
}

INSTRUCTIONS FOR THE AI

Minimal changes — when fixing a bug, touch only what's broken. Do not refactor unrelated code.
Match patterns — always follow the examples in the "Patterns to Follow" section above.
Check before creating — verify a hook or utility doesn't already exist before making a new one.
No unsolicited improvements — don't add features, rename things, or restructure files unless asked.
Ask when ambiguous — if the task has more than one reasonable interpretation, ask first.
Respect hard rules — the "Never Do This" list is non-negotiable.


BUG REPORT FORMAT (use this in chat)
File: src/components/features/[FileName].tsx
Expected: [what should happen]
Actual: [what's happening / error message]
Snippet:
[paste the broken function or component here]
Keeping bug reports in this format minimises back-and-forth and token usage.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js configuration

## Project Overview

This is a **WhatsApp Supervision Copilot** system built with Next.js 15, designed to monitor and analyze WhatsApp conversations for compliance and security purposes.

### Key Technologies
- **Next.js 15** with App Router (`src/app/` directory structure)
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with custom monochrome theme
- **Shadcn/ui** components library
- **Supabase** for database and real-time functionality
- **Lucide React** for icons
- **React 19** with latest features

### Architecture Overview

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout with sidebar
│   ├── page.tsx          # Dashboard page
│   └── ocorrencias/      # Occurrences page
├── components/
│   ├── ui/               # Shadcn/ui components
│   ├── layout/           # Layout components (Sidebar, Header, RefreshButton)
│   └── dashboard/        # Dashboard specific components
├── lib/
│   ├── supabase.ts      # Supabase client and queries
│   ├── utils.ts         # Utility functions
│   └── hooks/           # Custom React hooks
└── types/
    └── database.ts      # TypeScript interfaces for database
```

### Database Schema
- **companies** - Company information
- **occurrences** - Security/compliance incidents
- **messages** - WhatsApp messages
- **groups** - WhatsApp group information
- **people** - User profiles

### Styling & Theme
- **Monochrome design**: Black, white, and gray tones
- **Primary color**: #000000 (black)
- **Background**: #ffffff (white)
- **Sidebar**: Black background with white text
- **Cards**: White with subtle gray borders
- **Responsive design** with mobile-first approach

### Environment Setup
Copy `.env.example` to `.env.local` and configure:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Features Implemented (Stage 1)
- ✅ Dashboard with metrics cards and chart placeholders
- ✅ Occurrences page with filtering and table view
- ✅ Sidebar navigation (Dashboard, Chat, Occurrences, Agent)
- ✅ Supabase integration setup
- ✅ TypeScript interfaces for all database tables
- ✅ Shadcn/ui components (Button, Card, Table, Badge, Input, Select)
- ✅ Monochrome theme implementation
- ✅ Responsive layout with refresh button
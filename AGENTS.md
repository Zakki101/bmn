# Project Background: BMN Dashboard (Pusdatin PU)

The BMN (Barang Milik Negara) Dashboard is a web application designed for monitoring and managing state-owned assets within the Pusat Data dan Teknologi Informasi (Pusdatin) of the Ministry of Public Works (Kementerian Pekerjaan Umum).

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database/ORM**: Prisma with Supabase
- **UI Components**: Radix UI, Lucide React, React Icons
- **Key Libraries**: `@react-pdf/renderer` (PDF generation), `recharts` (Data visualization), `xlsx` (Excel export)

## Development Guidelines
- **Project Structure**: Follow Next.js App Router conventions (`app/`, `components/`, `lib/`, `data/`).
- **Styling**: Use Tailwind CSS 4 variables and `@theme` blocks in `globals.css`. Prefer semantic tokens (`--color-primary`, `--color-secondary`) over hardcoded hex codes.
- **Components**:
  - `Header.tsx`: Shared header with Pusdatin branding.
  - `Sidebar.tsx`: Role-based navigation (Admin/User).
- **Naming Conventions**: Use PascalCase for components and camelCase for functions/variables.
- **Responsiveness**: Ensure all UI elements are fully responsive across desktop, tablet, and mobile.

## Design System (Pusdatin PU Branding)
- **Primary Color**: `#142B6F` (Deep Blue)
- **Secondary Color**: `#FFD739` (Kementerian PU Yellow)
- **Typography**: Inter (System Sans)
- **Icons**: Lucide React for consistent UI iconography.

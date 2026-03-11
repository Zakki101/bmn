# Single Source of Truth (SSoT) - BMN Dashboard

## Core Architecture
The application uses a role-based access control (RBAC) system with "Admin" and "User" roles.

### Routing Overview
- `/`: Landing/Login page.
- `/admin/*`: Protected routes for BMN administrators.
- `/user/*`: Protected routes for general users.

## Data Models (Prisma)
*Note: Refer to `prisma/schema.prisma` for the full schema definitions.*
The project manages:
- **BMN Assets**: Inventory details, conditions, and locations.
- **Peminjaman**: Tracking asset loans and status.
- **Penghapusan**: Workflow for asset disposal/write-offs.

## Component Standards
- **Buttons**: Use `.btn` and `.btn-primary` classes defined in `globals.css`.
- **Containers**: Use `.container-custom` for consistent page alignment.
- **Cards**: Use `.card` for data displays and sections.
- **Scrollbars**: Customized with Pusdatin Yellow (`#FFD739`).

## API & Data Fetching
- Integration with Supabase for authentication and real-time features.
- Prisma for structured database operations.
- Server-side rendering (SSR) where possible for performance.

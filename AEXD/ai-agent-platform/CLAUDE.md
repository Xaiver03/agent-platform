# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Development Commands

```bash
# Development
npm run dev                    # Start Next.js development server
npm run build                  # Build for production
npm run type-check             # TypeScript type checking
npm run lint                   # ESLint code quality check

# Database Operations
npm run db:generate            # Generate Prisma client
npm run db:push               # Push schema changes to database
npm run db:studio             # Open Prisma Studio for database management
npm run db:seed               # Seed database with initial data
npm run db:reset              # Reset and recreate database

# Electron (Desktop App)
npm run electron:dev          # Development with hot reload
npm run electron:build        # Build desktop app for current platform
npm run electron:win          # Build for Windows
npm run electron:mac          # Build for macOS

# Deployment
npm run deploy:build          # Build and generate for deployment
npm run setup:github          # Setup GitHub Actions
```

## Auto-Commit and Push Policy

**IMPORTANT: Always auto-commit and push after every fix or change**
- After fixing any bug or making improvements, immediately commit with descriptive message
- **ALWAYS push to remote repository after committing** - This is mandatory for all changes
- Use consistent commit message format: "fix: [description]" or "feat: [description]"
- Include the Claude Code signature in commit messages
- Every single update, no matter how small, must be pushed to ensure deployment continuity
- Use `git push origin main` after every commit to sync with remote repository

## Architecture Overview

### Core Technology Stack
- **Next.js 14** with App Router - Full-stack React framework
- **TypeScript** - Type-safe development
- **Prisma ORM** with SQLite - Database layer with optimized queries
- **Ant Design** - Enterprise UI components
- **Canvas API** - Custom 3D galaxy visualization engine

### Key Architectural Components

#### 1. 3D Galaxy Visualization Engine
The main feature is a custom-built 3D star system using Canvas API:
- **`components/GalaxyStarSystem.tsx`** - Core 3D rendering engine with physics simulation
- **Star magnitude system** - AI tools display as stars with brightness based on click count (0-19 clicks = dim star, 1000+ = super bright)
- **Performance optimizations** - 30fps target, frame skipping, state debouncing, React.memo usage
- **Real-time physics** - Collision detection, particle systems, orbital mechanics

#### 2. Database Schema and Data Flow
- **Agent model** - Represents AI tools with clickCount for star magnitude, tags for categorization
- **Star Magnitude Config** - Configurable star brightness levels (7 levels from dim to super bright)
- **Optimized queries** - `lib/db.ts` contains performance-optimized Prisma queries with pagination and caching

#### 3. Dual Environment Support
- **Web application** - Standard Next.js deployment
- **Electron desktop app** - Cross-platform desktop version with dynamic database path resolution

## Performance Considerations

### 3D Rendering Performance
The galaxy visualization has been heavily optimized:
- **Frame rate control** - 30fps with frame skipping every 2 frames for physics
- **State update debouncing** - 30ms threshold to prevent excessive re-renders
- **Trail optimization** - Each frame updates for smooth star trails
- **Component memoization** - React.memo prevents unnecessary re-renders

### Database Performance
- **Optimized queries** in `lib/db.ts` with indexed fields
- **Pagination support** for large datasets
- **Tag caching** for search suggestions
- **Connection pooling** handled by Prisma

## Data Models

### Agent (AI Tools)
- `clickCount` determines star magnitude (0-19 = dim, 1000+ = super bright)
- `tags` are comma-separated strings for categorization
- `enabled` boolean controls visibility in frontend
- Performance indexes on `enabled`, `clickCount`, `tags`

### Star Magnitude System
Configurable brightness levels in `StarMagnitudeConfig`:
- Magnitude 1 (1000+ clicks): Super bright star
- Magnitude 7 (0-19 clicks): Dim star
- Each level has size, brightness, glow, and color properties

## Key Development Areas

### Adding New AI Tools
Use the admin interface at `/admin` or seed data in `prisma/seed.ts`. All new agents start with `clickCount: 0` (dim stars).

### Modifying 3D Effects
Main parameters in `GalaxyStarSystem.tsx`:
- Animation frame rate and physics update frequency
- Star trail length and aging
- Collision detection boundaries
- Performance optimization thresholds

### Database Schema Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Update seed data if needed with `npm run db:seed`

### Performance Optimization
The codebase follows these performance patterns:
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Apply `React.memo` for component optimization
- Implement state update debouncing for high-frequency updates

## Environment Setup

### Required Environment Variables
```bash
DATABASE_URL="file:./dev.db"  # SQLite database path
```

### Development Workflow
1. Clone and install dependencies: `npm install`
2. Generate Prisma client: `npm run db:generate`
3. Push schema to database: `npm run db:push`
4. Seed initial data: `npm run db:seed`
5. Start development: `npm run dev`

The application includes a 3D galaxy interface where AI tools appear as stars, with brightness determined by user interaction (click count). The performance has been carefully optimized to maintain smooth 30fps rendering while supporting real-time physics and particle effects.
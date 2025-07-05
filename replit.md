# MK-Tool - Multi-Tool Web Application

## Overview

MK-Tool is a comprehensive multi-tool web application built with React and Express, featuring world clock, calculator, YouTube video player, and enhanced proxy browser with DuckDuckGo search integration. The application is designed as a single-page application (SPA) with a modern, clean Japanese interface using shadcn/ui components and Tailwind CSS for styling.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Type Safety**: Full TypeScript coverage with strict configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Proxy Service**: HTTP proxy middleware for secure web browsing

## Key Components

### Frontend Components
1. **World Clock** (`/components/world-clock.tsx`)
   - Displays time for multiple global cities
   - Real-time updates with timezone support
   - Visual indicators for different time zones

2. **Calculator** (`/components/calculator.tsx`)
   - Full-featured calculator with standard operations
   - Error handling and input validation
   - Clean, intuitive button layout

3. **YouTube Player** (`/components/youtube-player.tsx`)
   - Embedded YouTube video player
   - URL parsing for youtube.com and youtu.be links
   - Responsive iframe implementation

4. **Enhanced Proxy Browser** (`/components/proxy-browser.tsx`)
   - Safe web browsing through advanced proxy
   - DuckDuckGo search integration with privacy focus
   - Quick access buttons for popular sites including DuckDuckGo
   - Enhanced CORS handling and security headers
   - Special handling for search engines and privacy protection

### Backend Services
1. **Proxy Service** (`/server/routes.ts`)
   - HTTP proxy middleware using http-proxy-middleware
   - Security headers manipulation
   - Error handling and logging

2. **Storage Layer** (`/server/storage.ts`)
   - Abstracted storage interface for future database integration
   - In-memory storage implementation for development
   - User management capabilities

## Data Flow

1. **Client-Side Rendering**: React components render in the browser with Vite handling development server and hot module replacement
2. **API Communication**: React Query manages server state and caching for API calls
3. **Proxy Requests**: Client makes requests to `/api/proxy` endpoint, which forwards to target URLs
4. **Database Operations**: Drizzle ORM handles type-safe database queries with PostgreSQL
5. **Session Management**: Express sessions stored in PostgreSQL for user authentication

## External Dependencies

### Core Framework Dependencies
- **@radix-ui/react-***: Headless UI components for accessibility
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

### Utility Dependencies
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **wouter**: Lightweight routing library
- **nanoid**: URL-safe unique string generator

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- TypeScript compilation with strict type checking
- Environment variables for database configuration

### Production Build
1. **Frontend**: Vite builds optimized React bundle to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `npm run db:push`

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- Vite environment variables for client-side configuration

### Hosting Considerations
- Static assets served from Express in production
- Database migrations handled through Drizzle Kit
- Session storage requires persistent PostgreSQL instance

## Changelog

Changelog:
- July 05, 2025. Initial setup
- July 05, 2025. Enhanced proxy functionality with DuckDuckGo search integration
- July 05, 2025. Rebranded application to "MK-Tool" with Japanese localization

## User Preferences

Preferred communication style: Simple, everyday language.
Application name: MK-Tool (requested by user)
Language: Japanese interface and content
Features requested: DuckDuckGo search integration in proxy browser inspired by mikancat-taki/Nebula repository
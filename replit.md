# Oceanus - AI-Driven Marine Data Platform

## Overview

Oceanus is a comprehensive React-based frontend application for oceanographic, fisheries, and molecular biodiversity data analysis. The platform provides AI-powered insights and interactive visualizations for marine research data, with a focus on role-based access control and scientific data management. It serves researchers, policy analysts, and administrators working with ocean data, fish data, otoliths, and eDNA samples.

The application features a modern web interface built with React and TypeScript, offering real-time data exploration, interactive maps, AI-driven species prediction tools, and comprehensive reporting capabilities. The platform is designed to handle complex marine datasets while providing an intuitive user experience for both technical and non-technical users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a modern React architecture using TypeScript with a component-based design pattern. The UI is built using shadcn/ui components with Radix UI primitives, providing a consistent and accessible interface. The styling system uses Tailwind CSS with custom CSS variables for theming, supporting both dark and light modes with dark as the default.

State management is handled through a combination of Zustand for authentication state and TanStack Query (React Query) for server state management and caching. The routing system uses Wouter for client-side navigation with protected routes based on user roles.

### Backend Architecture
The server is built with Express.js and follows a REST API pattern. The application uses a modular route structure with centralized error handling and request logging middleware. Authentication is implemented using JWT-like tokens with role-based access control supporting four user types: admin, researcher, policy_user, and guest.

The server includes mock data storage for development purposes, implemented through an in-memory storage class that simulates database operations. This allows for rapid development and testing without requiring a full database setup initially.

### Data Storage Solutions
The application is configured to use PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes tables for users, datasets, and analyses with proper relationships and constraints. The schema supports JSON metadata fields for flexible data storage.

For development and testing, the application includes a comprehensive mock storage implementation that provides realistic data and API responses, allowing full functionality without requiring database setup.

### Authentication and Authorization
The authentication system implements JWT-based authentication with role-based access control. Users are categorized into four distinct roles with different permission levels:
- Admin: Full system access and user management capabilities
- Researcher: Data upload, analysis, and dashboard access
- Policy User: Data visualization and reporting capabilities
- Guest: Read-only data exploration

The system includes session management with configurable expiration times, automatic token refresh, and secure logout functionality. Route protection is implemented at the component level with unauthorized access handling.

### Component Architecture
The UI follows a hierarchical component structure with a main Layout component that handles authentication checks and navigation. The sidebar navigation adapts based on user roles, showing only accessible features. The application uses a breadcrumb system for navigation context and includes responsive design patterns for mobile and desktop usage.

Form handling is implemented using React Hook Form with Zod schema validation, providing type-safe form management and validation. The application includes comprehensive error handling with toast notifications for user feedback.

## External Dependencies

### UI and Styling
- **Radix UI**: Provides accessible, unstyled UI primitives for building the component system
- **Tailwind CSS**: Utility-first CSS framework for styling and responsive design
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **class-variance-authority**: Utility for creating variant-based component APIs

### Data Management
- **TanStack React Query**: Handles server state management, caching, and data synchronization
- **Zustand**: Lightweight state management for client-side state like authentication
- **React Hook Form**: Form handling with performance optimization and validation
- **Zod**: Schema validation for type-safe data handling

### Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM for PostgreSQL database operations
- **@neondatabase/serverless**: PostgreSQL client optimized for serverless environments
- **connect-pg-simple**: PostgreSQL session store for Express.js sessions

### Development and Build Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Type system for enhanced development experience and code reliability
- **ESBuild**: Fast JavaScript bundler for production builds

### Visualization and Charts
- **Recharts**: React charting library for data visualization components
- **React Dropzone**: File upload interface with drag-and-drop functionality
- **Embla Carousel**: Lightweight carousel component for image galleries

### Utilities and Helpers
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Utility for conditional CSS class construction
- **nanoid**: Unique ID generation for client-side operations
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:ci` - Run all tests with coverage
- `npm run type-check` - Run TypeScript compiler check
- `npm run format` - Format code with Prettier

## Project Architecture

This is a React + TypeScript + Vite project using the standard Vite React template structure:

- **Build System**: Vite with @vitejs/plugin-react for Fast Refresh
- **TypeScript Configuration**: Split config with `tsconfig.json` as project root, `tsconfig.app.json` for app code, and `tsconfig.node.json` for Vite config
- **Entry Point**: `src/main.tsx` renders the App component into the DOM root
- **Main Component**: `src/App.tsx` contains the main application logic
- **Styling**: CSS modules pattern with `App.css` and `index.css`

## Code Quality

- ESLint configured with React and TypeScript rules
- TypeScript strict mode enabled with additional linting options (noUnusedLocals, noUnusedParameters, etc.)
- Prettier for code formatting
- Comprehensive testing setup with Vitest, React Testing Library, and Playwright

## Key Dependencies

- React 19.1.1 with TypeScript support
- Vite 7.1.2 as build tool and dev server
- ESLint 9.33.0 with TypeScript and React plugins

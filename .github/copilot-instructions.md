# Project Guidelines

## Code Style
- TypeScript strict mode with explicit types (see [src/types/DocumentNodes.ts](src/types/DocumentNodes.ts) for AST definitions)
- Tailwind CSS utility classes with conditional theme context (dark/light mode)
- ESLint with React hooks and TypeScript rules (`npm run lint`)

## Architecture
- React 19 + Vite frontend with Lexical editor for rich text documents
- Context-based state management (DocumentsContext for CRUD, ThemeContext for UI)
- All data persisted in localStorage (single-user, no backend)
- Component structure: pages/layouts/components/hooks/contexts

## Build and Test
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build` (includes TypeScript check)
- Lint: `npm run lint`
- Preview: `npm run preview`
- No test suite configured

## Conventions
- Spanish comments and UI labels (verify if intentional for i18n)
- Lexical plugins return null; use registerCommand for side effects
- Auto-save via context useEffect on state changes
- Framer Motion for layout transitions and animations
- Custom hooks for reusable logic (useDocuments, useLexicalEditor, etc.)</content>
<parameter name="filePath">c:\Users\Sfabr\source\DocsSource\.github\copilot-instructions.md
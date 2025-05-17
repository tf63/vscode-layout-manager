# Copilot Instructions

This project is a VSCode extension that provides a layout management system.
Users can create, read, update, and delete layouts using commands and views.
Commands are also available with keyboard shortcuts.
Specifications are defined in `docs/specification.md`.

## Specifications

- Use `typescript` for all code
- Use `pnpm` for package management
- Use `docs/specification.md` for specifications
- Use `package.json` for project metadata

## Project Structure

- Use `src` for all source code
    - Use `src/commands` for all command code
    - Use `src/views` for all view code
    - Use `src/services` for all service code
    - Use `src/repositories` for all repository code
    - Use `src/models` for all model code
    - Use `src/utils` for all utility code
    - Use `src/constants` for all constant code
    - Use `src/types` for all type definitions
- Use `docs` for all documentation

## Coding Style

- Don't use `any` type
- Don't use `console.log`
- Don't use unnecessary return types that could be inferred by TypeScript
- Don't use `import * as 'module'`. Use `import { name } from 'module'` for imports
- Don't use default exports. Use named exports
- Use `async/await` for asynchronous code
- Use `try/catch` for error handling
- Use `let` only when reassigning a variable
- Use `===` and `!==` for equality checks
- Use `!= null` for null checks
- Use `export type` for type exports
- Use `export interface` for interface exports
- Use `??` and `?.` for nullish coalescing and optional chaining
- Use comments for large classes and functions
- Use `TODO: ` or `FIXME: ` for unfinished code

- Use `const` for all variables as much as possible

## Coding Standards

- Use `pnpm lint` for linting. You must fix all linting errors.
    - Only files you modified should be linted
- Use `pnpm format` for formatting. You must fix all formatting errors.
    - Only files you modified should be formatted

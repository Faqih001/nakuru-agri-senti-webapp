# Working with Supabase Edge Functions

This document provides guidance for working with Supabase Edge Functions in this project.

## TypeScript Configuration

Supabase Edge Functions use Deno runtime, which is different from Node.js. To make TypeScript work with Deno modules:

1. We've set up specific configuration files:
   - `deno.jsonc` - Main Deno configuration
   - `import_map.json` - Maps module specifiers to URLs
   - `jsconfig.json` and `tsconfig.json` - TypeScript configuration for Deno

2. We use direct URL imports with version pinning in the `deps.ts` file with `@ts-expect-error` comments to suppress TypeScript errors for Deno-specific imports.

## Development Process

When developing Edge Functions:

1. Use the Supabase CLI to serve functions locally:

```bash
supabase functions serve
```

1. Import dependencies from the `deps.ts` file rather than importing directly:

```typescript
import { serve, createClient } from "../deps.ts";
```

1. Follow Deno's best practices for imports and TypeScript usage.

## Deployment

Deploy functions using the Supabase CLI:

```bash
supabase functions deploy your-function-name
```

Or deploy all functions:

```bash
supabase functions deploy
```

## Troubleshooting

If you encounter TypeScript errors with Deno imports:

1. Make sure VS Code is using the Deno extension for Edge Functions
2. Use the configured import map
3. Add `@ts-expect-error` comments for URL imports when necessary

For more information, see the [Supabase Edge Functions documentation](https://supabase.com/docs/guides/functions).

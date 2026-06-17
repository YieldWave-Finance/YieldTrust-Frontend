## Summary

Updates the frontend metadata in app/layout.tsx to reflect YieldTrust branding, improving SEO and user-facing discoverability.

## Changes
- **Title**: Changed from "Create Next App" to "YieldTrust Dashboard"
- **Description**: Updated to describe the escrow and grant dashboard platform
- **Viewport**: Moved to separate Viewport export (Next.js 16 requirement) with device-width and initial-scale=1
- **Theme Color**: Set to #2563eb (brand blue)

## Verification
- npm run build — passes with zero errors, zero warnings
- npm run lint — passes
- Metadata renders correctly in the browser head

Closes #3

## Summary

Replaces the default Next.js starter page with a branded YieldTrust dashboard skeleton as described in #2.

## Changes
- **Header**: YieldTrust branding with logo (YT) and navigation links (Dashboard, Grants, Escrow, Settings)
- **Introduction**: Short welcome text explaining YieldTrust's purpose and expected user workflow
- **Summary Cards**: Three semantic cards for Active Grants, Escrow Status, and Legal Hold states (placeholder values, ready for API integration)
- **Escrow Table**: Responsive table with columns for Grant, Recipient, Amount, Status, and Release — populated with placeholder rows marked "Awaiting Data"
- **Reusable components**: SummaryCard, Th, and Td helpers for consistent styling
- **Responsive**: Tailwind CSS grid adapts from 1 column (mobile) to 3 columns (desktop) for summary cards

## Verification
- npm run build — passes with zero errors, zero warnings
- npm run lint — passes
- Responsive layout tested via Tailwind breakpoints

Closes #2

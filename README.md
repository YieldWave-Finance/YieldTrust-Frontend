# AgriTrust-Frontend

Next.js web application for the AgriTrust Protocol, providing a decentralized dashboard for agricultural trust fund management, milestone tracking, and yield treasury analytics.

## 🚀 Key Features
* **Trust Fund Dashboard:** Modern user interface for creating and managing trust funds and tracking participant status.
* **Milestone & Proof Tracking:** Interactive timeline to submit and verify milestone completion proofs.
* **Treasury Analytics:** Real-time visibility into yield-generating treasury positions and dispute resolution workflows.

## 🛠️ Tech Stack
* **Language/Framework:** Next.js (React) / TypeScript
* **Key Dependencies:** `next`, `react`, `tailwindcss`

## 🎨 Theming & Dark Mode
The application uses Tailwind CSS v4 with a structured theme system configured in `app/globals.css`. It supports dark mode based on the user's system preferences (`prefers-color-scheme: dark`).

### Available CSS Variables:
- `--background`: The primary background color.
- `--foreground`: The primary text color.
- `--accent`: The primary accent color used for highlights and interactive elements.
- `--accent-foreground`: The text color to be used on top of the accent color.

These variables are mapped to Tailwind utility classes (e.g., `bg-background`, `text-accent`).

## 📦 Getting Started

### Prerequisites
Ensure you have the required toolchains installed:
* Node.js **v20.19.0 or v22.x** (see `engines` field in `package.json`)
* npm (bundled with Node.js)

### Installation & Local Setup
```bash
# Clone the repository (if running manually)
git clone https://github.com/AgriTrust-Protocol/AgriTrust-Frontend

# Install exact dependency versions from the lock file
npm ci

# Start development server
npm run dev
```
### Dependency Auditing
Run a security audit before deploying or after adding new packages:

```bash
# Report vulnerabilities at high severity and above
npm audit --audit-level=high

# Interactive fix for auto-resolvable issues
npm audit fix
```

### Full CI Check Locally
Run the same checks the CI pipeline runs, all in one command:

```bash
npm run ci
```

This executes `npm ci && npm run lint && npm run build` in sequence.

## 🤝 Contributing
Contributions are highly welcome. Please ensure your commits are cryptographically signed using GPG or SSH keys. For major structural changes, please open an issue first to discuss your proposal.

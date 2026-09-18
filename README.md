



Build three real AI tools (dynamic generation via Lovable AI, structured prompts, Zod-validated outputs — never hardcoded/placeholder/canned responses):

1. Smart Email Generator — fields: purpose, recipient/context, key points, optional instructions; tone picker (Formal/Friendly/Persuasive); returns editable subject + body with regenerate, copy, clear.
2. Meeting Notes Summarizer — paste notes; AI returns summary, action items, decisions, deadlines; editable with regenerate, copy, clear.
3. AI Task Planner — inputs: tasks, priorities, working hours, deadlines; choose daily or weekly; AI returns a timeline-style schedule; editable with regenerate.

Plus a Dashboard overview with quick-access cards and a Settings view. Show loading and error states; surface AI errors directly, no fake fallbacks. Show the responsible-AI disclaimer throughout: "AI-generated content may contain errors. Always review and verify AI outputs before sending emails, making decisions, or acting on AI recommendations."

---

A modern, responsive SaaS web application that helps professionals automate everyday workplace tasks using AI. Built with a premium **gold-and-black** visual identity, the app delivers genuinely AI-powered, dynamically generated results — no hardcoded, placeholder, or simulated responses.

---

## Project Overview

The **AI Workplace Productivity Assistant** is a frontend-focused AI productivity platform that lets users generate professional emails, summarize meeting notes, and build personalized work schedules on the fly. Every output is produced by a real AI model based on the user's actual input.

- Premium, clean, professional SaaS dashboard.
- Gold-and-black primary colour scheme with modern cards, forms, buttons, tabs, subtle shadows, and smooth interactions.
- Responsive across desktop, tablet, and mobile.
- Icon-based sidebar navigation.
- Editable AI-generated outputs with regenerate, copy, and clear controls.
- Session-only data — nothing is saved, no accounts, no history, no database.
- A visible responsible-AI disclaimer throughout the workspace.

> **Responsible AI disclaimer**
> AI-generated content may contain errors. Always review and verify AI outputs before sending emails, making decisions, or acting on AI recommendations.

---

## Features Implemented

### Dashboard
A professional overview showing each AI tool with clear descriptions and quick-access buttons.

### Smart Email Generator
- User provides **purpose**, **recipient/context**, **key points**, and optional **instructions**.
- Tone options: **Formal**, **Friendly**, **Persuasive**.
- Real AI generation produces a unique, send-ready email from the user's input.
- Editable output with **regenerate**, **copy**, and **clear** controls.

### Meeting Notes Summarizer
- User pastes or enters meeting notes.
- Real AI analysis dynamically produces:
  - Meeting Summary
  - Action Items
  - Decisions
  - Deadlines
- Results are based specifically on the user's notes — never predefined samples.
- Editable output with **regenerate**, **copy**, and **clear** controls.

### AI Task Planner / Scheduler
- User enters **tasks**, **priorities**, **available working hours**, and **deadlines**.
- Real AI generation creates a personalized **daily** or **weekly** schedule.
- Schedule is displayed in a clean timeline-style interface.
- Editable output with **regenerate** support.

### Settings
- Privacy explanation and configuration details.
- Responsible-AI disclaimer.

### Critical AI Requirement
- No hardcoded, generic, placeholder, or fake responses.
- All outputs are generated dynamically using an AI model based on the user's actual input.
- Structured AI prompts guide the model behind each tool.

### Data & Privacy
- No custom backend. No database. No persistent storage.
- No authentication or user accounts.
- No saved prompts, generated content, emails, notes, tasks, or history.
- Data exists only temporarily while the user is using the application.

---

## Technologies and Tools Used

| Category | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/) (React 19, full-stack) |
| Build tool | [Vite](https://vitejs.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| UI library | [React](https://react.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| UI components | [Radix UI](https://www.radix-ui.com/) primitives, [shadcn/ui](https://ui.shadcn.com/) patterns, [Lucide](https://lucide.dev/) icons |
| Forms & validation | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| AI generation | [Vercel AI SDK](https://sdk.vercel.ai/) with the `openai/gpt-6-astra` model via the Lovable AI Gateway |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Charts | [Recharts](https://recharts.org/) |

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) recommended)
- npm

### Install and run locally

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

The dev server starts on `http://localhost:8080`.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

### AI configuration
The app uses the Lovable AI Gateway with the `openai/gpt-6-astra` model. The AI key is kept server-side and is never exposed to the browser. If an AI key is required in your environment, configure it through your project's environment variables (see the Settings view in the app for details).

---

## Author

**Zime Mcineka**

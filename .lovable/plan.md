# AI Workplace Productivity Assistant

## Build
- Replace the placeholder with a responsive black-and-gold SaaS dashboard and icon sidebar.
- Add five in-page views: overview, email generator, meeting summarizer, task planner, and settings.
- Make each tool accept detailed input, show loading and error states, and return editable results with regenerate, copy, and clear controls.
- Present schedules as a structured timeline and meeting analysis in clearly separated summary, action, decision, and deadline sections.
- Keep all entered and generated content only in current page memory; add no accounts, history, database, or persistent storage.
- Show the responsible-AI disclaimer throughout the workspace.

## AI connection
- Use Lovable AI through a private server endpoint so the AI key is never exposed in the browser.
- Use structured prompts and validated structured responses tailored to each tool.
- Surface safe AI service errors directly and never substitute canned output.

## Quality
- Add app-specific page metadata.
- Verify generation flows, editing/copy/clear actions, and responsive layouts in the running preview.

## Technical details
- TanStack Start server route for streaming-capable AI requests using `openai/gpt-6-astra`.
- React state only for temporary content; no database or browser storage.
- Semantic Tailwind design tokens for the gold-and-black visual system.

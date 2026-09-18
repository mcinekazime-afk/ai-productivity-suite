import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardList,
  Copy,
  FileText,
  LayoutDashboard,
  Mail,
  Menu,
  PanelLeftClose,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkle,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";
import { useState, type ComponentType, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateWorkplaceContent } from "@/lib/workplace-ai.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      { name: "description", content: "AI-powered email writing, meeting summaries, and intelligent work planning." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Create professional emails, meeting insights, and personalized schedules with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkplaceApp,
});

type View = "dashboard" | "email" | "meeting" | "planner" | "settings";
type Generated = Awaited<ReturnType<typeof generateWorkplaceContent>>;

const nav: Array<{ id: View; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "email", label: "Email Generator", icon: Mail },
  { id: "meeting", label: "Meeting Summarizer", icon: FileText },
  { id: "planner", label: "Task Planner", icon: CalendarDays },
  { id: "settings", label: "Settings", icon: Settings },
];

const toolCards = [
  { id: "email" as const, icon: Mail, eyebrow: "WRITE", title: "Smart Email Generator", description: "Turn a brief into a polished, professional email in your chosen tone.", detail: "Formal · Friendly · Persuasive" },
  { id: "meeting" as const, icon: FileText, eyebrow: "DISTILL", title: "Meeting Notes Summarizer", description: "Extract the signal from long notes, including decisions and next steps.", detail: "Summary · Actions · Deadlines" },
  { id: "planner" as const, icon: CalendarDays, eyebrow: "PLAN", title: "AI Task Planner", description: "Build a realistic daily or weekly schedule around your priorities.", detail: "Priorities · Time blocks · Focus" },
];

function WorkplaceApp() {
  const [view, setView] = useState<View>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const selectView = (next: View) => {
    setView(next);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex lg:flex-col ${collapsed ? "w-20" : "w-64"}`}>
        <Brand compact={collapsed} />
        <Navigation view={view} compact={collapsed} onSelect={selectView} />
        <div className="mt-auto p-4">
          {!collapsed && <div className="mb-3 rounded-md border border-sidebar-border bg-sidebar-accent p-3 text-xs leading-relaxed text-sidebar-muted">Your content is temporary and is never saved.</div>}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar" className="text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <PanelLeftClose className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-overlay lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-72 bg-sidebar" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></Button></div>
            <Navigation view={view} onSelect={selectView} />
          </aside>
        </div>
      )}

      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></Button>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Workspace</p>
              <h1 className="text-sm font-semibold sm:text-base">{nav.find((item) => item.id === view)?.label}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-success" /> AI ready</div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
          {view === "dashboard" && <Dashboard onSelect={selectView} />}
          {view === "email" && <EmailTool />}
          {view === "meeting" && <MeetingTool />}
          {view === "planner" && <PlannerTool />}
          {view === "settings" && <SettingsView />}
        </main>
        <Disclaimer />
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={`flex h-20 items-center gap-3 px-5 ${compact ? "justify-center px-0" : ""}`}><div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-gold"><WandSparkles className="size-5" /></div>{!compact && <div><div className="font-display text-lg font-bold">WORKMATE<span className="text-primary">AI</span></div><div className="text-[10px] font-semibold uppercase text-sidebar-muted">Productivity suite</div></div>}</div>;
}

function Navigation({ view, compact = false, onSelect }: { view: View; compact?: boolean; onSelect: (view: View) => void }) {
  return <nav className="space-y-1 px-3 pt-5">{nav.map((item) => { const Icon = item.icon; return <Button key={item.id} variant="ghost" onClick={() => onSelect(item.id)} title={compact ? item.label : undefined} className={`h-11 w-full justify-start px-3 ${compact ? "justify-center" : ""} ${view === item.id ? "bg-sidebar-accent text-primary" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}><Icon className="size-4" />{!compact && <span>{item.label}</span>}</Button>; })}</nav>;
}

function Dashboard({ onSelect }: { onSelect: (view: View) => void }) {
  return <div className="animate-in fade-in duration-500">
    <div className="mb-10 max-w-3xl"><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase text-primary"><Sparkle className="size-4" /> AI-powered workspace</div><h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">Make your workday <span className="text-primary">flow.</span></h2><p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Move from blank page to finished work with focused AI tools for the tasks that consume your day.</p></div>
    <div className="grid gap-4 md:grid-cols-3">{toolCards.map((tool, index) => { const Icon = tool.icon; return <article key={tool.id} className="group flex min-h-72 flex-col rounded-lg border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-gold"><div className="flex items-start justify-between"><div className="flex size-11 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary"><Icon className="size-5" /></div><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span></div><p className="mt-8 text-[11px] font-bold text-primary">{tool.eyebrow}</p><h3 className="mt-2 text-xl font-semibold">{tool.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{tool.description}</p><p className="mt-auto pt-6 text-xs text-muted-foreground">{tool.detail}</p><Button onClick={() => onSelect(tool.id)} variant="ghost" className="mt-3 justify-between px-0 text-primary hover:bg-transparent hover:text-primary/80">Open tool <ArrowRight /></Button></article>; })}</div>
    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]"><div className="rounded-lg border border-border bg-surface-raised p-5"><div className="flex items-center gap-3"><ShieldCheck className="size-5 text-primary" /><div><p className="font-medium">Private by design</p><p className="mt-1 text-sm text-muted-foreground">Nothing you enter is saved to a profile, history, or database.</p></div></div></div><div className="flex min-w-56 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 p-5 text-sm font-semibold text-primary">3 focused AI tools</div></div>
  </div>;
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-7"><p className="text-xs font-bold uppercase text-primary">{eyebrow}</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>;
}

function EmailTool() {
  const generate = useServerFn(generateWorkplaceContent);
  const [form, setForm] = useState({ purpose: "", recipient: "", keyPoints: "", instructions: "", tone: "Formal" as "Formal" | "Friendly" | "Persuasive" });
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const run = async (event?: FormEvent) => { event?.preventDefault(); setLoading(true); setError(""); try { const output = await generate({ data: { tool: "email", ...form } }); if ("subject" in output) setResult(output); } catch (e) { setError(readError(e)); } finally { setLoading(false); } };
  return <div><PageIntro eyebrow="Compose with confidence" title="Smart Email Generator" description="Give the assistant the context. Get a polished message that sounds intentional, not automated."/><div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"><form onSubmit={run} className="workspace-panel space-y-5"><Field label="Purpose"><Input required value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Follow up on a proposal" /></Field><Field label="Recipient & context"><Textarea required value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} placeholder="Who are you writing to, and what do they need to know?" className="min-h-24" /></Field><Field label="Key points"><Textarea required value={form.keyPoints} onChange={(e) => setForm({ ...form, keyPoints: e.target.value })} placeholder="One point per line works best" className="min-h-32" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Tone"><Select value={form.tone} onValueChange={(value) => setForm({ ...form, tone: value as typeof form.tone })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Formal">Formal</SelectItem><SelectItem value="Friendly">Friendly</SelectItem><SelectItem value="Persuasive">Persuasive</SelectItem></SelectContent></Select></Field><Field label="Optional instructions"><Input value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Keep it under 150 words" /></Field></div>{error && <ErrorNotice message={error} />}<GenerateButton loading={loading} label="Generate email" /></form><OutputShell title="Email draft" hasResult={!!result} onRegenerate={() => run()} onClear={() => setResult(null)} onCopy={() => copyText(result ? `Subject: ${result.subject}\n\n${result.body}` : "")} loading={loading}>{result && <div className="space-y-4"><Field label="Subject"><Input value={result.subject} onChange={(e) => setResult({ ...result, subject: e.target.value })} /></Field><Field label="Message"><Textarea value={result.body} onChange={(e) => setResult({ ...result, body: e.target.value })} className="min-h-80 leading-7" /></Field></div>}</OutputShell></div></div>;
}

function MeetingTool() {
  const generate = useServerFn(generateWorkplaceContent); const [notes, setNotes] = useState(""); const [result, setResult] = useState<{ summary: string; actionItems: string[]; decisions: string[]; deadlines: string[] } | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const run = async (event?: FormEvent) => { event?.preventDefault(); setLoading(true); setError(""); try { const output = await generate({ data: { tool: "meeting", notes } }); if ("summary" in output) setResult(output); } catch (e) { setError(readError(e)); } finally { setLoading(false); } };
  const editList = (key: "actionItems" | "decisions" | "deadlines", value: string) => result && setResult({ ...result, [key]: value.split("\n").filter(Boolean) });
  return <div><PageIntro eyebrow="Turn talk into action" title="Meeting Notes Summarizer" description="Transform raw notes into a clear record of what happened, what matters, and what comes next."/><div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"><form onSubmit={run} className="workspace-panel flex flex-col"><Field label="Meeting notes"><Textarea required minLength={20} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your meeting notes, transcript, or rough bullets here…" className="min-h-96 flex-1 leading-7" /></Field><div className="mt-3 text-right text-xs text-muted-foreground">{notes.length.toLocaleString()} characters</div>{error && <ErrorNotice message={error} />}<div className="mt-5"><GenerateButton loading={loading} label="Analyze notes" /></div></form><OutputShell title="Meeting intelligence" hasResult={!!result} onRegenerate={() => run()} onClear={() => setResult(null)} onCopy={() => copyText(result ? meetingText(result) : "")} loading={loading}>{result && <div className="space-y-5"><Field label="Meeting summary"><Textarea value={result.summary} onChange={(e) => setResult({ ...result, summary: e.target.value })} className="min-h-36 leading-6" /></Field><ResultList title="Action items" value={result.actionItems.join("\n")} onChange={(v) => editList("actionItems", v)} /><ResultList title="Decisions" value={result.decisions.join("\n")} onChange={(v) => editList("decisions", v)} /><ResultList title="Deadlines" value={result.deadlines.join("\n")} onChange={(v) => editList("deadlines", v)} /></div>}</OutputShell></div></div>;
}

function PlannerTool() {
  const generate = useServerFn(generateWorkplaceContent); const [form, setForm] = useState({ tasks: "", priorities: "", hours: "09:00–17:00", deadlines: "", period: "Daily" as "Daily" | "Weekly" }); const [result, setResult] = useState<{ title: string; schedule: Array<{ time: string; task: string; detail: string; priority: "High" | "Medium" | "Low" }>; recommendations: string[] } | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const run = async (event?: FormEvent) => { event?.preventDefault(); setLoading(true); setError(""); try { const output = await generate({ data: { tool: "planner", ...form } }); if ("schedule" in output) setResult(output); } catch (e) { setError(readError(e)); } finally { setLoading(false); } };
  const setScheduleText = (index: number, key: "time" | "task" | "detail", value: string) => result && setResult({ ...result, schedule: result.schedule.map((item, i) => i === index ? { ...item, [key]: value } : item) });
  return <div><PageIntro eyebrow="Protect your focus" title="AI Task Planner" description="Build a practical schedule around the work that matters, your real availability, and approaching deadlines."/><div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"><form onSubmit={run} className="workspace-panel space-y-5"><Field label="Tasks"><Textarea required value={form.tasks} onChange={(e) => setForm({ ...form, tasks: e.target.value })} placeholder="List the tasks you need to complete" className="min-h-36" /></Field><Field label="Priorities"><Textarea required value={form.priorities} onChange={(e) => setForm({ ...form, priorities: e.target.value })} placeholder="What must happen first?" className="min-h-24" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Plan type"><Select value={form.period} onValueChange={(value) => setForm({ ...form, period: value as typeof form.period })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Daily">Daily schedule</SelectItem><SelectItem value="Weekly">Weekly schedule</SelectItem></SelectContent></Select></Field><Field label="Working hours"><Input required value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></Field></div><Field label="Deadlines"><Textarea value={form.deadlines} onChange={(e) => setForm({ ...form, deadlines: e.target.value })} placeholder="Add dates or time constraints" className="min-h-24" /></Field>{error && <ErrorNotice message={error} />}<GenerateButton loading={loading} label="Build my schedule" /></form><OutputShell title="Your schedule" hasResult={!!result} onRegenerate={() => run()} onClear={() => setResult(null)} onCopy={() => copyText(result ? plannerText(result) : "")} loading={loading}>{result && <div><Input value={result.title} onChange={(e) => setResult({ ...result, title: e.target.value })} className="mb-6 text-lg font-semibold" /> <div className="relative space-y-3 before:absolute before:bottom-3 before:left-[4.55rem] before:top-3 before:w-px before:bg-border">{result.schedule.map((item, index) => <div key={`${item.time}-${index}`} className="relative grid grid-cols-[4rem_1fr] gap-5"><Input aria-label="Time" value={item.time} onChange={(e) => setScheduleText(index, "time", e.target.value)} className="h-9 border-0 bg-transparent px-0 text-right text-xs text-primary shadow-none" /><div className="relative rounded-md border border-border bg-surface-raised p-4 before:absolute before:-left-[1.05rem] before:top-5 before:size-2 before:rounded-full before:bg-primary"><div className="flex items-center justify-between gap-3"><Input aria-label="Task" value={item.task} onChange={(e) => setScheduleText(index, "task", e.target.value)} className="h-auto border-0 bg-transparent p-0 font-semibold shadow-none" /><span className={`priority-${item.priority.toLowerCase()}`}>{item.priority}</span></div><Textarea aria-label="Details" value={item.detail} onChange={(e) => setScheduleText(index, "detail", e.target.value)} className="mt-2 min-h-14 resize-none border-0 bg-transparent p-0 text-sm text-muted-foreground shadow-none" /></div></div>)}</div>{result.recommendations.length > 0 && <div className="mt-6 border-t border-border pt-5"><p className="mb-3 text-xs font-bold uppercase text-primary">Planner notes</p>{result.recommendations.map((note) => <p key={note} className="mb-2 flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{note}</p>)}</div>}</div>}</OutputShell></div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-xs font-semibold uppercase text-muted-foreground">{label}</Label>{children}</div>; }
function GenerateButton({ loading, label }: { loading: boolean; label: string }) { return <Button disabled={loading} type="submit" size="lg" className="w-full bg-primary text-primary-foreground shadow-gold hover:bg-primary/90">{loading ? <><RefreshCw className="animate-spin" /> Thinking…</> : <><WandSparkles /> {label}</>}</Button>; }
function ErrorNotice({ message }: { message: string }) { return <div className="flex gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{message}</div>; }
function ResultList({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) { return <Field label={title}><Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="None identified" className="min-h-24 leading-6" /></Field>; }

function OutputShell({ title, hasResult, loading, onCopy, onClear, onRegenerate, children }: { title: string; hasResult: boolean; loading: boolean; onCopy: () => void; onClear: () => void; onRegenerate: () => void; children: React.ReactNode }) {
  return <section className="workspace-panel min-h-[34rem]"><div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><div><p className="text-xs font-bold uppercase text-primary">AI output</p><h3 className="mt-1 text-lg font-semibold">{title}</h3></div>{hasResult && <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={onRegenerate} disabled={loading} aria-label="Regenerate" title="Regenerate"><RefreshCw /></Button><Button variant="ghost" size="icon" onClick={onCopy} aria-label="Copy" title="Copy"><Copy /></Button><Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear" title="Clear"><Trash2 /></Button></div>}</div>{loading && !hasResult ? <div className="flex min-h-96 flex-col items-center justify-center text-center"><div className="mb-5 flex size-14 items-center justify-center rounded-md border border-primary/30 bg-primary/10"><WandSparkles className="size-6 animate-pulse text-primary" /></div><p className="font-medium">Creating your result</p><p className="mt-2 text-sm text-muted-foreground">Analyzing your input and shaping a professional response…</p></div> : hasResult ? children : <div className="flex min-h-96 flex-col items-center justify-center text-center"><div className="mb-5 flex size-14 items-center justify-center rounded-md border border-border bg-surface-raised"><ClipboardList className="size-6 text-muted-foreground" /></div><p className="font-medium">Your result will appear here</p><p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Complete the brief and let AI create a tailored first draft.</p></div>}</section>;
}

function SettingsView() { return <div><PageIntro eyebrow="Workspace preferences" title="Settings" description="Review how this focused workspace handles AI and your information."/><div className="grid gap-4 md:grid-cols-2"><div className="workspace-panel"><ShieldCheck className="size-6 text-primary"/><h3 className="mt-5 text-lg font-semibold">Session-only privacy</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Your prompts and generated results remain in the current page only. Refreshing or closing it clears your work.</p></div><div className="workspace-panel"><WandSparkles className="size-6 text-primary"/><h3 className="mt-5 text-lg font-semibold">Lovable AI connected</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">The workspace is securely connected to AI. No personal API key is needed or exposed in your browser.</p><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-success"><span className="size-2 rounded-full bg-success"/> Service ready</div></div></div></div>; }
function Disclaimer() { return <footer className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-10"><div className="flex gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary"/><p>AI-generated content may contain errors. Always review and verify AI outputs before sending emails, making decisions, or acting on AI recommendations.</p></div></footer>; }

function readError(error: unknown) { const message = error instanceof Error ? error.message : "AI generation failed. Please try again."; return message.replace(/^Error:\s*/, ""); }
async function copyText(value: string) { if (typeof navigator !== "undefined") await navigator.clipboard.writeText(value); }
function meetingText(value: { summary: string; actionItems: string[]; decisions: string[]; deadlines: string[] }) { return `SUMMARY\n${value.summary}\n\nACTION ITEMS\n${value.actionItems.join("\n")}\n\nDECISIONS\n${value.decisions.join("\n")}\n\nDEADLINES\n${value.deadlines.join("\n")}`; }
function plannerText(value: { title: string; schedule: Array<{ time: string; task: string; detail: string; priority: string }>; recommendations: string[] }) { return `${value.title}\n\n${value.schedule.map((item) => `${item.time} — ${item.task} [${item.priority}]\n${item.detail}`).join("\n\n")}\n\nNOTES\n${value.recommendations.join("\n")}`; }

"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Github, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  importFromGithub,
  type GithubImportResult,
} from "@/app/actions/github-import";

export type ImportFields = {
  title: string;
  githubUrl: string;
  liveUrl: string;
  tagline: string;
  description: string;
  techStack: string[];
  tagNames: string[];
};

export type GithubImportDialogProps = {
  onApply: (fields: ImportFields) => void;
};

export function GithubImportDialog({ onApply }: GithubImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GithubImportResult | null>(null);
  const [showReadme, setShowReadme] = useState(false);
  const [isPending, startTransition] = useTransition();

  function fetchRepo() {
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const data = await importFromGithub(url);
        setResult(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Couldn't import from GitHub.",
        );
      }
    });
  }

  function apply() {
    if (!result) return;
    const desc = result.description ?? "";
    onApply({
      title: result.title,
      githubUrl: result.url,
      liveUrl: result.homepage ?? "",
      tagline: desc.length <= 200 ? desc : "",
      description: desc.length > 200 ? desc : "",
      techStack: result.techStack,
      tagNames: result.topics,
    });
    setOpen(false);
    setTimeout(() => {
      setUrl("");
      setResult(null);
      setShowReadme(false);
      setError(null);
    }, 200);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Github className="size-4" />
          Import from GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import from GitHub</DialogTitle>
          <DialogDescription>
            Paste a public repo URL. We&apos;ll prefill description, topics,
            tech stack, and links — you can edit before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="https://github.com/you/your-repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                fetchRepo();
              }
            }}
            autoFocus
          />
          <Button
            type="button"
            onClick={fetchRepo}
            disabled={isPending || url.trim() === ""}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Fetch
          </Button>
        </div>

        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-sm">
                {result.owner}/{result.repo}
              </p>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Sparkles className="size-3" />
                Ready
              </span>
            </div>
            <PreviewRow label="Title" value={result.title} />
            <PreviewRow
              label="Description"
              value={result.description ?? "—"}
            />
            <PreviewRow label="Homepage" value={result.homepage ?? "—"} />
            <PreviewRow
              label="Topics"
              value={result.topics.length > 0 ? result.topics.join(", ") : "—"}
            />
            <PreviewRow
              label="Tech stack"
              value={
                result.techStack.length > 0
                  ? result.techStack.join(", ")
                  : "—"
              }
            />
            {result.readme ? (
              <div>
                <button
                  type="button"
                  onClick={() => setShowReadme((s) => !s)}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronDown
                    className={cn(
                      "size-3 transition-transform",
                      showReadme ? "" : "-rotate-90",
                    )}
                  />
                  README preview
                </button>
                {showReadme ? (
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-md bg-secondary p-3 text-xs leading-relaxed">
                    {result.readme.slice(0, 4000)}
                    {result.readme.length > 4000 ? "\n…" : ""}
                  </pre>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={apply} disabled={!result}>
            Apply to form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="line-clamp-2 break-all text-sm text-foreground">
        {value}
      </span>
    </div>
  );
}

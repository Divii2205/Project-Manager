"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Github, Loader2 } from "lucide-react";

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
        setResult(await importFromGithub(url));
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Could not read that repository. Check the URL and try again.",
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
          <Github />
          Import from GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import from GitHub</DialogTitle>
          <DialogDescription>
            Paste a public repository URL. Fields you have already filled in
            are left alone; empty ones get the values from the repo.
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
            aria-label="Repository URL"
            autoFocus
          />
          <Button
            type="button"
            onClick={fetchRepo}
            disabled={isPending || url.trim() === ""}
          >
            {isPending ? <Loader2 className="animate-spin" /> : null}
            Read repo
          </Button>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-sm border border-destructive/30 bg-destructive/[0.05] px-3 py-2 text-[0.8125rem] text-destructive"
          >
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
              <p className="truncate font-mono text-xs">
                {result.owner}/{result.repo}
              </p>
              <span className="shrink-0 text-xs text-primary">
                Ready to apply
              </span>
            </div>
            <dl className="px-4 py-1">
              <PreviewRow label="Title" value={result.title} />
              <PreviewRow label="Description" value={result.description} />
              <PreviewRow label="Homepage" value={result.homepage} />
              <PreviewRow
                label="Topics"
                value={result.topics.join(", ") || null}
              />
              <PreviewRow
                label="Tech stack"
                value={result.techStack.join(", ") || null}
              />
            </dl>
            {result.readme ? (
              <div className="border-t border-border px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => setShowReadme((s) => !s)}
                  aria-expanded={showReadme}
                  className="flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform",
                      showReadme ? "" : "-rotate-90",
                    )}
                  />
                  README
                </button>
                {showReadme ? (
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-sm bg-secondary/60 p-3 font-mono text-[0.6875rem] leading-relaxed">
                    {result.readme.slice(0, 4000)}
                    {result.readme.length > 4000 ? "\n…" : ""}
                  </pre>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
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

function PreviewRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-b border-border py-2 last:border-b-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-[0.8125rem]">
        {value ? (
          <span className="line-clamp-2 break-words text-foreground">
            {value}
          </span>
        ) : (
          <span className="text-muted-foreground/50">not set</span>
        )}
      </dd>
    </div>
  );
}

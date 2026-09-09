"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { JSONContent } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section } from "@/components/section";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { TagChipInput } from "@/components/projects/tag-chip-input";
import {
  GithubImportDialog,
  type ImportFields,
} from "@/components/projects/github-import-dialog";
import {
  PRIORITY_META,
  PRIORITY_ORDER,
  STATUS_META,
  STATUS_ORDER,
} from "@/lib/lifecycle";

/* Dates and urls stay as strings here so react-hook-form can bind them
   directly; `projectInputSchema` on the server does the real coercion. */
const formSchema = z.object({
  title: z.string().trim().min(1, "Give the project a title").max(200),
  status: z.enum(STATUS_ORDER),
  tagline: z.string().trim().max(200),
  description: z.string().trim().max(5000),
  techStack: z.array(z.string().trim().min(1).max(40)).max(20),
  startDate: z.string(),
  targetEndDate: z.string(),
  actualEndDate: z.string(),
  priority: z.enum(PRIORITY_ORDER),
  githubUrl: z.string(),
  liveUrl: z.string(),
  designUrl: z.string(),
  docsUrl: z.string(),
  notes: z.unknown().nullable(),
  progress: z.coerce.number().int().min(0).max(100),
  tagNames: z.array(z.string().trim().min(1).max(40)).max(20),
});

export type ProjectFormValues = z.infer<typeof formSchema>;

type Status = (typeof STATUS_ORDER)[number];

// Changing the stage snaps progress to that stage's canonical position, so the
// dropdown always feels like it did something. Paused and abandoned are
// orthogonal to progress, so they leave it alone.
function progressForStatus(status: Status, current: number): number {
  switch (status) {
    case "IDEA":
      return 0;
    case "PLANNING":
      return 10;
    case "IN_PROGRESS":
      return 50;
    case "SHIPPED":
      return 100;
    default:
      return current;
  }
}

// Dragging the bar infers the stage back, but never overwrites an explicit
// decision to pause or abandon.
function statusForProgress(progress: number, current: Status): Status {
  if (current === "PAUSED" || current === "ABANDONED") return current;
  if (progress <= 0) return "IDEA";
  if (progress >= 100) return "SHIPPED";
  if (progress < 10) return "PLANNING";
  return "IN_PROGRESS";
}

export type ProjectFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
};

export function ProjectForm({ mode, defaultValues, onSubmit }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "IDEA",
      tagline: "",
      description: "",
      techStack: [],
      startDate: "",
      targetEndDate: "",
      actualEndDate: "",
      priority: "MEDIUM",
      githubUrl: "",
      liveUrl: "",
      designUrl: "",
      docsUrl: "",
      notes: null,
      progress: 0,
      tagNames: [],
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => {
    // ProseMirror builds mark attrs with Object.create(null) and Server
    // Actions reject null-prototype objects, so round-trip through JSON to
    // give every nested object a plain prototype back.
    const safe: ProjectFormValues = {
      ...values,
      notes:
        values.notes === null || values.notes === undefined
          ? null
          : JSON.parse(JSON.stringify(values.notes)),
    };
    startTransition(async () => {
      await onSubmit(safe);
    });
  });

  function applyImport(fields: ImportFields) {
    const opts = { shouldDirty: true } as const;
    if (fields.title && !getValues("title")) setValue("title", fields.title, opts);
    if (fields.githubUrl) setValue("githubUrl", fields.githubUrl, opts);
    if (fields.liveUrl && !getValues("liveUrl")) {
      setValue("liveUrl", fields.liveUrl, opts);
    }
    if (fields.tagline && !getValues("tagline")) {
      setValue("tagline", fields.tagline, opts);
    }
    if (fields.description && !getValues("description")) {
      setValue("description", fields.description, opts);
    }
    if (fields.techStack.length > 0) {
      setValue(
        "techStack",
        merge(getValues("techStack"), fields.techStack),
        opts,
      );
    }
    if (fields.tagNames.length > 0) {
      setValue("tagNames", merge(getValues("tagNames"), fields.tagNames), opts);
    }
  }

  return (
    <form onSubmit={submit}>
      <Section
        title="Basics"
        description="What you are building, in one line and a few sentences."
        aside={
          <div className="pt-1">
            <GithubImportDialog onApply={applyImport} />
          </div>
        }
      >
        <Field label="Title" htmlFor="title" error={errors.title?.message} required>
          <Input
            id="title"
            placeholder="Neon Ledger"
            aria-invalid={errors.title ? "true" : "false"}
            {...register("title")}
          />
        </Field>

        <Field
          label="Tagline"
          htmlFor="tagline"
          hint="Optional"
          error={errors.tagline?.message}
        >
          <Input
            id="tagline"
            placeholder="A calm home for side projects"
            {...register("tagline")}
          />
        </Field>

        <Field
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
        >
          <Textarea
            id="description"
            rows={5}
            placeholder="What is it, who is it for, and why does it matter?"
            {...register("description")}
          />
        </Field>
      </Section>

      <Section
        title="Stage and priority"
        description="Moving the stage sets progress to match, and dragging progress moves the stage back."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stage" error={errors.status?.message}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    const next = val as Status;
                    field.onChange(next);
                    const current = clamp(Number(getValues("progress")) || 0);
                    const nextProgress = progressForStatus(next, current);
                    if (nextProgress !== current) {
                      setValue("progress", nextProgress, { shouldDirty: true });
                    }
                  }}
                >
                  <SelectTrigger aria-label="Stage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_ORDER.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_META[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Priority" error={errors.priority?.message}>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_ORDER.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PRIORITY_META[p].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <Controller
          control={control}
          name="progress"
          render={({ field }) => {
            const value = clamp(Number(field.value) || 0);
            return (
              <Field
                label="Progress"
                hint={`${value}%`}
                error={errors.progress?.message}
              >
                <Slider
                  value={[value]}
                  min={0}
                  max={100}
                  step={1}
                  aria-label="Progress"
                  onValueChange={([v]) => {
                    const next = v ?? 0;
                    field.onChange(next);
                    const currentStatus = getValues("status") as Status;
                    const nextStatus = statusForProgress(next, currentStatus);
                    if (nextStatus !== currentStatus) {
                      setValue("status", nextStatus, { shouldDirty: true });
                    }
                  }}
                />
              </Field>
            );
          }}
        />
      </Section>

      <Section title="Timeline" description="All three dates are optional.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Started" error={errors.startDate?.message}>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  ariaLabel="Start date"
                />
              )}
            />
          </Field>
          <Field label="Target" error={errors.targetEndDate?.message}>
            <Controller
              control={control}
              name="targetEndDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  ariaLabel="Target end date"
                />
              )}
            />
          </Field>
          <Field label="Completed" error={errors.actualEndDate?.message}>
            <Controller
              control={control}
              name="actualEndDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  ariaLabel="Actual end date"
                />
              )}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Tech and tags"
        description="Press Enter or comma to add an entry. Backspace removes the last one."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tech stack" error={errors.techStack?.message}>
            <Controller
              control={control}
              name="techStack"
              render={({ field }) => (
                <TagChipInput
                  ariaLabel="Tech stack"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Next.js, TypeScript, Postgres"
                />
              )}
            />
          </Field>
          <Field label="Tags" error={errors.tagNames?.message}>
            <Controller
              control={control}
              name="tagNames"
              render={({ field }) => (
                <TagChipInput
                  ariaLabel="Tags"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="side-project, ai, weekend"
                />
              )}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Links"
        description="Anywhere this project lives. Each one becomes a shortcut on the ledger."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GitHub" htmlFor="githubUrl" error={errors.githubUrl?.message}>
            <Input
              id="githubUrl"
              type="url"
              inputMode="url"
              placeholder="https://github.com/you/repo"
              {...register("githubUrl")}
            />
          </Field>
          <Field label="Live site" htmlFor="liveUrl" error={errors.liveUrl?.message}>
            <Input
              id="liveUrl"
              type="url"
              inputMode="url"
              placeholder="https://your-app.com"
              {...register("liveUrl")}
            />
          </Field>
          <Field label="Design" htmlFor="designUrl" error={errors.designUrl?.message}>
            <Input
              id="designUrl"
              type="url"
              inputMode="url"
              placeholder="https://figma.com/file/..."
              {...register("designUrl")}
            />
          </Field>
          <Field label="Docs" htmlFor="docsUrl" error={errors.docsUrl?.message}>
            <Input
              id="docsUrl"
              type="url"
              inputMode="url"
              placeholder="https://notion.so/..."
              {...register("docsUrl")}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Notes"
        description="Open questions, todos, and anything worth remembering next time. Links stay clickable when you read it back."
      >
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <TiptapEditor
              value={(field.value as JSONContent | null) ?? null}
              onChange={field.onChange}
            />
          )}
        />
      </Section>

      <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-border bg-background/90 py-4 backdrop-blur">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : null}
          {mode === "create" ? "Create project" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function clamp(n: number): number {
  return Math.min(100, Math.max(0, n));
}

function merge(current: string[] | undefined, incoming: string[]): string[] {
  return Array.from(new Set([...(current ?? []), ...incoming])).slice(0, 20);
}

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, htmlFor, hint, error, required, children }: FieldProps) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={htmlFor}>
          {label}
          {required ? (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          ) : null}
        </Label>
        {hint ? (
          <span className="tabular text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

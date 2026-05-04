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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { TagChipInput } from "@/components/projects/tag-chip-input";
import { STATUS_VALUES, PRIORITY_VALUES } from "@/lib/projects";

// Form-level schema mirrors projectInputSchema but with strings for dates and
// urls so RHF can bind <input type="date"> and <input type="url"> directly.
const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  status: z.enum(STATUS_VALUES),
  tagline: z.string().trim().max(200),
  description: z.string().trim().max(5000),
  techStack: z.array(z.string().trim().min(1).max(40)).max(20),
  startDate: z.string(),
  targetEndDate: z.string(),
  actualEndDate: z.string(),
  priority: z.enum(PRIORITY_VALUES),
  githubUrl: z.string(),
  liveUrl: z.string(),
  designUrl: z.string(),
  docsUrl: z.string(),
  notes: z.unknown().nullable(),
  progress: z.coerce.number().int().min(0).max(100),
  tagNames: z.array(z.string().trim().min(1).max(40)).max(20),
});

export type ProjectFormValues = z.infer<typeof formSchema>;

const STATUS_LABEL: Record<(typeof STATUS_VALUES)[number], string> = {
  IDEA: "Idea",
  PLANNING: "Planning",
  IN_PROGRESS: "In progress",
  SHIPPED: "Shipped",
  PAUSED: "Paused",
  ABANDONED: "Abandoned",
};

const PRIORITY_LABEL: Record<(typeof PRIORITY_VALUES)[number], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

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
    startTransition(async () => {
      await onSubmit(values);
    });
  });

  const submitLabel =
    mode === "create" ? "Create project" : "Save changes";

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
          <CardDescription>
            What are you building, in one line and a few sentences?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Title"
            htmlFor="title"
            error={errors.title?.message}
            required
          >
            <Input id="title" {...register("title")} placeholder="My next big idea" />
          </Field>

          <Field
            label="Tagline"
            htmlFor="tagline"
            hint="A short hook (optional)"
            error={errors.tagline?.message}
          >
            <Input id="tagline" {...register("tagline")} placeholder="A calm tool for tracking projects" />
          </Field>

          <Field
            label="Description"
            htmlFor="description"
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={4}
              {...register("description")}
              placeholder="What is it, who is it for, why does it matter?"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status & priority</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Field label="Status" error={errors.status?.message}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_VALUES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_VALUES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PRIORITY_LABEL[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field
            label="Progress"
            htmlFor="progress"
            hint="0–100"
            error={errors.progress?.message}
          >
            <Input
              id="progress"
              type="number"
              min={0}
              max={100}
              step={1}
              {...register("progress")}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>All dates are optional.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Field label="Start date" htmlFor="startDate" error={errors.startDate?.message}>
            <Input id="startDate" type="date" {...register("startDate")} />
          </Field>
          <Field
            label="Target end"
            htmlFor="targetEndDate"
            error={errors.targetEndDate?.message}
          >
            <Input id="targetEndDate" type="date" {...register("targetEndDate")} />
          </Field>
          <Field
            label="Actual end"
            htmlFor="actualEndDate"
            error={errors.actualEndDate?.message}
          >
            <Input id="actualEndDate" type="date" {...register("actualEndDate")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tech & tags</CardTitle>
          <CardDescription>
            Type and press Enter or comma to add. Backspace removes the last entry.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="GitHub"
            htmlFor="githubUrl"
            error={errors.githubUrl?.message}
          >
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/you/repo"
              {...register("githubUrl")}
            />
          </Field>
          <Field
            label="Live URL"
            htmlFor="liveUrl"
            error={errors.liveUrl?.message}
          >
            <Input
              id="liveUrl"
              type="url"
              placeholder="https://your-app.com"
              {...register("liveUrl")}
            />
          </Field>
          <Field
            label="Design"
            htmlFor="designUrl"
            error={errors.designUrl?.message}
          >
            <Input
              id="designUrl"
              type="url"
              placeholder="https://figma.com/..."
              {...register("designUrl")}
            />
          </Field>
          <Field
            label="Docs"
            htmlFor="docsUrl"
            error={errors.docsUrl?.message}
          >
            <Input
              id="docsUrl"
              type="url"
              placeholder="https://notion.so/..."
              {...register("docsUrl")}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>
            Ideas, todos, future improvements — links are clickable in view mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
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
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor, JSONContent } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";

import { tiptapExtensions } from "@/components/editor/tiptap-extensions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type TiptapEditorProps = {
  value: JSONContent | null | undefined;
  onChange: (value: JSONContent | null) => void;
  className?: string;
};

export function TiptapEditor({ value, onChange, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: tiptapExtensions,
    content: value ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[220px] px-3 py-2.5 focus:outline-none",
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.isEmpty ? null : e.getJSON());
    },
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "h-[17.5rem] rounded-sm border border-input bg-card",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "tiptap-content rounded-sm border border-input bg-card",
        "transition-colors focus-within:border-foreground/25",
        "focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-ring",
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1 py-1">
      <Tool
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </Tool>
      <Tool
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </Tool>
      <Tool
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough />
      </Tool>
      <Tool
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code />
      </Tool>

      <Divider />

      <Tool
        label="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </Tool>
      <Tool
        label="Subheading"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 />
      </Tool>
      <Tool
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </Tool>
      <Tool
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </Tool>
      <Tool
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote />
      </Tool>

      <Divider />

      <LinkTool editor={editor} />

      <div className="ml-auto flex items-center gap-0.5">
        <Tool
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 />
        </Tool>
        <Tool
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 />
        </Tool>
      </div>
    </div>
  );
}

/** Replaces `window.prompt`, which is the one piece of browser chrome the
 *  app cannot style. */
function LinkTool({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState("");
  const active = editor.isActive("link");

  useEffect(() => {
    if (!open) return;
    const current = editor.getAttributes("link").href as string | undefined;
    setHref(current ?? "");
  }, [open, editor]);

  function apply() {
    const url = href.trim();
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Link"
          aria-pressed={active}
          className={cn(active && "bg-primary/10 text-primary")}
        >
          <LinkIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <div className="flex gap-1.5">
          <Input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
            placeholder="https://"
            inputMode="url"
            aria-label="Link URL"
            autoFocus
          />
          <Button type="button" size="sm" onClick={apply}>
            {href.trim() === "" && active ? "Remove" : "Apply"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Tool({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(active && "bg-primary/10 text-primary hover:bg-primary/15")}
    >
      {children}
    </Button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-4 w-px bg-border" />;
}

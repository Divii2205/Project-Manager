"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";

import { tiptapExtensions } from "@/components/editor/tiptap-extensions";
import { cn } from "@/lib/utils";

export type TiptapViewerProps = {
  content: JSONContent | null | undefined;
  className?: string;
};

export function TiptapViewer({ content, className }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: tiptapExtensions,
    content: content ?? "",
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className={cn("tiptap-content", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}

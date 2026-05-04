import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export const tiptapExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      target: "_blank",
      rel: "noopener noreferrer",
      class:
        "text-primary underline underline-offset-4 hover:opacity-80 transition-opacity",
    },
  }),
];

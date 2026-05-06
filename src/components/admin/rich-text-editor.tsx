"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import History from "@tiptap/extension-history";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Highlighter,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react";

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// ─── Toolbar button ───────────────────────────────────────────────────────────
function ToolBtn({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-colors cursor-pointer border-0 ${
        active
          ? "bg-accent/15 text-accent"
          : "text-muted hover:text-foreground hover:bg-white/5"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-px h-5 bg-border mx-1 shrink-0" />;
}

// ─── Editor ──────────────────────────────────────────────────────────────────
export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: Props) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
      Bold,
      Italic,
      Underline,
      Strike,
      Highlight.configure({ multicolor: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      HorizontalRule,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-accent underline underline-offset-2" },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      History,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "outline-none min-h-[320px] prose-editor",
      },
    },
    immediatelyRender: false
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-background focus-within:border-accent transition-colors">
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-card">
        {/* History */}
        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={15} />
        </ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </ToolBtn>

        <Divider />

        {/* Inline marks */}
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <BoldIcon size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <ItalicIcon size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter size={15} />
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered list"
        >
          <ListOrdered size={15} />
        </ToolBtn>

        <Divider />

        {/* Blocks */}
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Code size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus size={15} />
        </ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn
          onClick={editor.isActive("link") ? removeLink : addLink}
          active={editor.isActive("link")}
          title={editor.isActive("link") ? "Remove link" : "Add link"}
        >
          <LinkIcon size={15} />
        </ToolBtn>

        <Divider />

        {/* Clear formatting */}
        <ToolBtn
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Clear formatting"
        >
          <RemoveFormatting size={15} />
        </ToolBtn>
      </div>

      {/* ── Content area ────────────────────────────────── */}
      <div className="px-5 py-4">
        <EditorContent editor={editor} />
      </div>

      {/* Prose styles injected globally via a style tag */}
      <style>{`
        .prose-editor h1 { font-size: 1.875rem; font-weight: 300; margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--foreground); line-height: 1.2; letter-spacing: -0.02em; }
        .prose-editor h2 { font-size: 1.5rem; font-weight: 300; margin-top: 1.25rem; margin-bottom: 0.5rem; color: var(--foreground); line-height: 1.3; }
        .prose-editor h3 { font-size: 1.25rem; font-weight: 400; margin-top: 1rem; margin-bottom: 0.5rem; color: var(--foreground); }
        .prose-editor p { color: var(--foreground); line-height: 1.75; margin-bottom: 0.75rem; font-weight: 300; font-size: 0.9375rem; }
        .prose-editor ul, .prose-editor ol { padding-left: 1.5rem; margin-bottom: 0.75rem; color: var(--foreground); }
        .prose-editor ul { list-style-type: disc; }
        .prose-editor ol { list-style-type: decimal; }
        .prose-editor li { margin-bottom: 0.25rem; font-weight: 300; font-size: 0.9375rem; line-height: 1.7; }
        .prose-editor blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; margin: 1rem 0; color: var(--muted); font-style: italic; }
        .prose-editor pre { background: var(--card); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
        .prose-editor code { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--accent); }
        .prose-editor pre code { color: var(--foreground); }
        .prose-editor hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
        .prose-editor mark { background-color: rgba(16,185,129,0.2); color: var(--foreground); border-radius: 2px; padding: 0 2px; }
        .prose-editor strong { font-weight: 600; }
        .prose-editor em { font-style: italic; }
        .prose-editor s { text-decoration: line-through; }
        .prose-editor .is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--muted); opacity: 0.5; pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  );
}

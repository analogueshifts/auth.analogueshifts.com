"use client";

import { Color } from "@tiptap/extension-color";
import "./tiptap.css";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";

import Image from "next/image";
import Bold from "@/assets/images/job-seeker-kyc/bold.svg";
import Italic from "@/assets/images/job-seeker-kyc/italic.svg";
import UnderlineImg from "@/assets/images/job-seeker-kyc/underline.svg";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (editor) {
    editor.setOptions({
      editorProps: {
        attributes: {
          class:
            "px-6 z-30 py-4 scroll-hidden -translate-y-3 text-sm font-medium max-h-[150px] w-[540px] max-w-[calc(100vw-48px)] min-h-[150px] border-[#D2D2D2] border-t-[#0000000F] overflow-y-auto rounded-b-2xl outline-none border text-[#7B7B7B] ",
        },
      },
    });
  }

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`flex w-[540px] max-w-[calc(100vw-48px)] overflow-x-auto gap-x-3 gap-y-3 px-6 pt-6 pb-5 top-0 z-40  bg-white rounded-t-2xl border-tremor-border-boulder200 border-b-0 border-x border-t`}
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${editor.isActive("bold") ? "" : ""} px-2 `}
      >
        <Image src={Bold} alt="" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${editor.isActive("italic") ? "" : ""} px-2`}
      >
        <Image src={Italic} alt="" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`${editor.isActive("underline") ? "" : ""} px-2`}
      >
        <Image src={UnderlineImg} alt="" />
      </button>
    </div>
  );
};

// Define prop types for Tiptap component
interface TiptapProps {
  changed: (value: string) => void;
  initialData: string;
}

const extensions = [
  Color.configure({ types: [ListItem.name] }), // Adjust here
  TextStyle, // No need to configure types here
  Underline,
  Placeholder.configure({
    placeholder: "Tell us a little about yourself",
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const Tiptap: React.FC<TiptapProps> = ({ changed, initialData }) => {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={initialData}
      onUpdate={({ editor }) => {
        const html = editor.getHTML();
        changed(html);
      }}
    ></EditorProvider>
  );
};

export default Tiptap;

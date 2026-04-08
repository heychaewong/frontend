"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPost } from "@/lib/api";


export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await createPost({ title, content, author });
      router.push("/community");
    } catch (error) {
      alert("게시글 작성에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">글 작성</h1>
      <div className="grid gap-3 max-w-2xl">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자를 입력하세요"
          className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={8}
          className="px-3 py-2 rounded-lg border border-gray-200 resize-y outline-none focus:ring-2 focus:ring-blue-200"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/community")}
            className="px-3 py-2 rounded-lg border border-gray-200 cursor-pointer bg-white hover:bg-gray-50"
          >
            ← 목록으로
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-3 py-2 rounded-lg border border-gray-200 bg-white ${
              submitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"
            }`}
          >
            {submitting ? "작성 중..." : "작성"}
          </button>
        </div>
      </div>
    </div>
  );
}

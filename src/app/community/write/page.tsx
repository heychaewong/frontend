"use client";
import { useRouter } from "next/navigation";
import {useState} from "react";
import { createPost } from "@/lib/api";

// TODO: 필요한 import를 추가하세요
// - useState (react)
// - useRouter (next/navigation)
// - getPosts, savePosts (lib/mockData)
// - Post 타입 (types/post)

export default function WritePage() {
  // TODO: title, content 상태를 만드세요


  // TODO: handleSubmit 함수를 구현하세요
  // 1. 새로운 Post 객체 생성 (id는 Date.now().toString())
  // 2. getPosts()로 기존 목록 가져오기
  // 3. 새 글을 배열에 추가
  // 4. savePosts()로 저장
  // 5. router.push("/community")로 이동
const router = useRouter();

const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [author, setAuthor] = useState("익명");
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async () => {
  if (!title.trim() || !content.trim()) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  setSubmitting(true);
  try {
    await createPost({title, content, author});
    router.push("/community");
  } catch (error) {
    alert("게시글 작성에 실패했습니다.");
    setSubmitting(false);
  }
};

  return (
    <div>
      <div style={{ padding: 16 }}></div>
      <h1>글 작성</h1>
      <div style={{ display: "grid", gap: 10, maxWidth: 720}}>
        <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="작성자를 입력하세요"
        style={{
          padding: "10px 12px", 
          borderRadius: 8, 
          border: "1px solid #e5e5e5",
         }}
        />
        <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        style={{
           padding: "10px 12px", 
           borderRadius: 8, 
           border: "1px solid #e5e5e5",
          }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={8}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #e5e5e5",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: 8}}>
          <button
            type="button"
            onClick={() => router.push("/community")}
            style={{ 
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e5e5e5", 
              cursor: "pointer", 
              background: "white"
            }}
          >
            ← 목록으로          
          </button>

          <button 
            type="button"
            onClick={handleSubmit} 
            disabled={submitting} // submitting: true->버튼 클릭 불가, false->클릭 가능
          style={{ 
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #e5e5e5",
            cursor: submitting ? "not-allowed" : "pointer", // true면 클릭 불가 표시, flase면 클릭 가능 표시
            background: "white",
            }}
          >
          {submitting ? "작성 중..." : "작성"}
          </button>
        </div>
      </div>
      {/* TODO: 제목 input */}
      {/* TODO: 내용 textarea */}
      {/* TODO: 작성 버튼 (클릭 시 handleSubmit 호출) */}
    </div>
  );
}
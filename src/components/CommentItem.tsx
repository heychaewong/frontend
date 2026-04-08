"use client";

import { Comment } from "@/types/post";

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void; // 삭제 함수 prop 추가가
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  // 날짜 문자열(ISO)을 한국어 로케일 기준으로 사람이 읽기 좋게 변환합니다.
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleString("ko-KR");
  };

  const handleDelete = () => {
    const ok = confirm("정말 삭제하시겠습니까?"); // 확인 다이얼로그
    if (!ok) return;
    onDelete(comment.id); // 부모한테 삭제 요청
  }

  return (
    <div style={{ padding: 12, border: "1px solid #e5e5e5", borderRadius: 8 }}>
      <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
        작성자: {comment.author} | 작성일: {formatDate(comment.createdAt)}
      </p>
      <p>{comment.content}</p>
      <button
        type="button"
        onClick={handleDelete}
        style={{
          padding: "4px 8px",
          borderRadius: 8,
          border: "1px solid #e5e5e5",
          cursor: "pointer",
          background: "white",
        }}
      >
        삭제
      </button>    
    </div>
  );
}

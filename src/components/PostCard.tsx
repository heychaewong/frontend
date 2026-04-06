// Next.js App Router에서 이 컴포넌트를 "클라이언트 컴포넌트"로 사용하겠다는 선언입니다.
// (브라우저에서만 동작하는 훅/useRouter 등을 사용할 수 있게 됨)
"use client";

// 게시글(Post) 데이터의 타입 정의를 가져옵니다.
import { Post } from "@/types/post";
// App Router의 라우팅 훅입니다. 이벤트(클릭 등)에서 특정 URL로 이동할 때 사용합니다.
import { useRouter } from "next/navigation";

// 이 컴포넌트가 받는 props의 타입을 정의합니다.
interface PostCardProps {
  // 렌더링할 게시글 1개
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // push/back 등을 호출하기 위한 router 객체를 만듭니다.
  const router = useRouter();

  // ISO 문자열(createdAt)을 사람이 읽기 좋은 형태로 변환하는 유틸 함수입니다.
  // 예) "2026-03-20T09:00:00.000Z" → "2026. 3. 20. 오전 6:00:00" (환경에 따라 표시 형식은 달라질 수 있음)
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    // 날짜 파싱이 실패하면(Invalid Date) 원본 문자열을 그대로 보여줍니다.
    if (Number.isNaN(date.getTime())) return isoString;
    // 한국 로케일 기준으로 날짜/시간 문자열로 표시합니다.
    return date.toLocaleString("ko-KR");
  };

  // 카드 클릭(또는 키보드 Enter/Space) 시 상세 페이지로 이동시키는 핸들러입니다.
  const handleClick = () => {
    // 동적 라우트: /community/[id] 로 이동
    router.push(`/community/${post.id}`);
  };

  return (
    <div
      // div를 "클릭 가능한 카드"로 쓰기 때문에 접근성을 위해 button 역할을 부여합니다.
      role="button"
      // 키보드 포커스가 가능하도록 설정합니다. (Tab으로 카드에 포커스 이동 가능)
      tabIndex={0}
      // 마우스 클릭 시 상세 페이지로 이동
      onClick={handleClick}
      // 키보드로도 동작하게(Enter/Space) 처리합니다.
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      // 간단한 카드 스타일(테두리/여백/커서)을 인라인으로 적용합니다.
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        padding: 16,
        cursor: "pointer",
      }}
    >

      <h2>{post.title}</h2>
      {/* 게시글 작성자 */}
      <p>작성자: {post.author}</p>
      {/* 게시글 작성일(ISO → 로케일 문자열) */}
      <p>작성일: {formatDate(post.createdAt)}</p>
      <p>
        {/* 좋아요 수 / 댓글 수(목록 API의 commentCount) */}
        좋아요: {post.likes} / 댓글: {post.commentCount}
      </p>
    </div>
  );
}

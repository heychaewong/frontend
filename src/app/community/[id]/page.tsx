"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useRouter 추가 필요 (뒤로가기용)

import CommentItem from "@/components/CommentItem";
import { fetchPost } from "@/lib/api";
import { PostDetail } from "@/types/post";

export default function PostDetailPage() {
  // URL /community/[id]에서 id 값을 가져옵니다.
  const params = useParams();
  const id = params.id as string;
  const router = useRouter(); // 뒤로가기용

  // 선택된 게시글을 담을 state입니다.
  const [post, setPost] = useState<PostDetail | null>(null); // post -> postdetail
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  // 댓글 입력값 state입니다.
  const [commentContent, setCommentContent] = useState("");

  // 마운트/ID 변경 시 localStorage에서 해당 게시글을 찾아옵니다.
  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPost(id); // getPosts().find() -> API 호출로 교체체
        setPost(data);
      } catch (err) {
        setError("게시글을 불러올 수 없습니다."); // 실패 시 에러 상태에 저장
      } finally {
        setLoading(false); // 성공/실패 상관없이 로딩 종료료
      }
    };
    loadPost();
  }, [id]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleString("ko-KR");
  };

  // 좋아요 버튼 핸들러입니다.
  const handleLike = () => {
    if (!post) return;

    // 1) likes +1
    const updatedPost: Post = { ...post, likes: post.likes + 1 };

    // 2) 저장: 전체 posts 중 해당 id만 교체
    const posts = getPosts();
    const nextPosts = posts.map((p) => (p.id === id ? updatedPost : p));
    savePosts(nextPosts);

    // 3) 화면 업데이트
    setPost(updatedPost);
  };

  // 댓글 작성 핸들러입니다.
  const handleComment = () => {
    if (!post) return;
    if (!commentContent.trim()) return;

    // 1) 새 Comment 객체 생성
    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentContent,
      author: "익명",
      createdAt: new Date().toISOString(),
    };

    // 2) post.comments에 추가
    const updatedPost: Post = {
      ...post,
      comments: [...post.comments, newComment],
    };

    // 3) 저장
    const posts = getPosts();
    const nextPosts = posts.map((p) => (p.id === id ? updatedPost : p));
    savePosts(nextPosts);

    // 4) 화면 업데이트
    setPost(updatedPost);
    setCommentContent("");
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>게시글 상세</h1>
      {!post ? (
        <p>해당 게시글을 찾을 수 없어요.</p>
      ) : (
        <>
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <h2 style={{ marginTop: 0 }}>{post.title}</h2>
            <p style={{ margin: "4px 0", color: "#555" }}>
              작성자: {post.author} | 작성일: {formatDate(post.createdAt)}
            </p>
            <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{post.content}</p>

            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                onClick={handleLike}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  cursor: "pointer",
                  background: "white",
                }}
              >
                좋아요
              </button>
              <span style={{ marginLeft: 10 }}>좋아요 수: {post.likes}</span>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 16 }}>댓글</h2>

            <div style={{ display: "grid", gap: 10 }}>
              {post.comments.length === 0 ? (
                <p style={{ color: "#777" }}>아직 댓글이 없어요.</p>
              ) : (
                post.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
                placeholder="댓글을 입력하세요"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  resize: "vertical",
                }}
              />
              <button
                type="button"
                onClick={handleComment}
                style={{
                  marginTop: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  cursor: "pointer",
                  background: "white",
                }}
              >
                댓글 작성
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

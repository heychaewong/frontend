"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CommentItem from "@/components/CommentItem";
import { fetchPost, toggleLike, deletePost, createComment, deleteComment } from "@/lib/api";
import { PostDetail } from "@/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPost(id);
        setPost(data);
      } catch (err) {
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleString("ko-KR");
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      const updated = await toggleLike(id);
      setPost(updated);
    } catch (err) {
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    try {
      await deletePost(id);
      router.push("/community");
    } catch (err) {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handleComment = async () => {
    if (!commentContent.trim() || !commentAuthor.trim()) {
      alert("작성자와 댓글 내용을 입력해주세요.");
      return;
    }
    try {
      const newComment = await createComment(id, {
        content: commentContent,
      });
      setPost((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
      );
      setCommentContent("");
      setCommentAuthor("");
    } catch (err) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setPost((prev) =>
        prev
          ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) }
          : prev
      );
    } catch (err) {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return (
    <div className="p-4">
      <p>{error}</p>
      <a href="/community" className="text-blue-500 hover:underline">← 목록으로</a>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">게시글 상세</h1>

      {/* 버튼 영역 */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => router.push("/community")}
          className="px-3 py-2 rounded-lg border border-gray-200 cursor-pointer bg-white hover:bg-gray-50"
        >
          ← 목록으로
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-3 py-2 rounded-lg border border-gray-200 cursor-pointer bg-white hover:bg-red-50 hover:text-red-500"
        >
          삭제
        </button>
      </div>

      {!post ? (
        <p className="text-gray-500">해당 게시글을 찾을 수 없어요.</p>
      ) : (
        <>
          {/* 게시글 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mt-0">{post.title}</h2>
            <p className="text-gray-500 my-1">
              작성자: {post.author} | 작성일: {formatDate(post.createdAt)}
            </p>
            <p className="mt-3 whitespace-pre-wrap">{post.content}</p>

            <div className="mt-3">
              <button
                type="button"
                onClick={handleLike}
                className="px-3 py-2 rounded-lg border border-gray-200 cursor-pointer bg-white hover:bg-red-50 hover:text-red-500"
              >
                좋아요
              </button>
              <span className="ml-3">좋아요 수: {post.likes}</span>
            </div>
          </div>

          {/* 댓글 */}
          <div className="mt-5">
            <h2 className="text-base font-semibold">댓글</h2>

            <div className="grid gap-3">
              {post.comments.length === 0 ? (
                <p className="text-gray-400">아직 댓글이 없어요.</p>
              ) : (
                post.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} onDelete={handleCommentDelete} />
                ))
              )}
            </div>

            {/* 댓글 입력 */}
            <div className="mt-3 grid gap-2">
              <input
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="작성자를 입력하세요"
                className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
              />
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
                placeholder="댓글을 입력하세요"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 resize-y outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={handleComment}
                className="mt-2 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer bg-white hover:bg-gray-50"
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
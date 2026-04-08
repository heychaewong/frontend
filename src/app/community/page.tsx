"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { fetchPosts } from "@/lib/api";
import { Post } from "@/types/post";

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // 로딩 및 에러 상태 UI 개선
  if (loading) return <div className="p-4 text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
      
      <div className="my-4 flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/community/write")}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
        >
          글 작성
        </button>
      </div>

      <div className="grid gap-3">
        {posts.length === 0 ? (
          <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            게시글이 없습니다.
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
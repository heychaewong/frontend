"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { fetchPosts } from "@/lib/api";       // ✅ 교체
import { Post } from "@/types/post";

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // ✅ 추가

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

  if (loading) return <div>로딩 중...</div>;  
  if (error) return <div>{error}</div>;    

  return (
    <div style={{ padding: 16 }}>
      <h1>커뮤니티</h1>
      <div style={{ margin: "12px 0 16px" }}>
        <button
          type="button"
          onClick={() => router.push("/community/write")}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #e5e5e5",
            cursor: "pointer",
            background: "white",
          }}
        >
          글 작성
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {posts.length === 0 && <div>게시글이 없습니다.</div>}  
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
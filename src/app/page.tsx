export default function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">환영합니다! 👋</h1>
      <p className="mt-2 text-gray-600">커뮤니티에서 다양한 이야기를 나눠보세요.</p>
      <a
        href="/community"
        className="inline-block mt-4 px-3 py-2 rounded-lg border border-gray-200 bg-white text-black no-underline hover:bg-gray-50"
        >
        커뮤니티 바로가기 →
      </a>
    </div>
  );
}
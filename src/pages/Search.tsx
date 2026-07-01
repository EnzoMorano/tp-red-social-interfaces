import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import type { Post } from "../interfaces/types";
import { getPosts } from "../services/api";
import { PostCard } from "../components/PostCard";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getPosts()
      .then((data) => {
        const filtrados = data.filter((post: Post) => {
          if (query.startsWith("#")) {
            const tagBuscado = query.slice(1).toLowerCase();
            return post.tags?.some((tag) =>
              tag.nombre.toLowerCase().includes(tagBuscado)
            );
          }
          return post.descripcion
            .toLowerCase()
            .includes(query.toLowerCase());
        });
        setPosts(filtrados);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, [query]);

  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 px-2">
          <FiSearch className="text-gray-400 text-xl" />
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Resultados para "{query}"
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[30vh]">
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
              Buscando...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-sm">
            No se encontraron publicaciones para "{query}"
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </main>
  );
}

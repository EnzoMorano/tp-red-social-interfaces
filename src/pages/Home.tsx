import { useEffect, useMemo, useState } from "react";
import { FiStar } from "react-icons/fi";
import type { Post } from "../interfaces/types";
import { getPosts } from "../services/api";
import { PostCard } from "../components/PostCard";

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  

  useEffect(() => {
    getPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los posts:", error);
        setLoading(false);
      });
  }, []);

  const postDestacado = useMemo(() => {
    if (posts.length === 0) return null;
    return posts.reduce((max, p) =>
      (p.comments?.length ?? 0) > (max.comments?.length ?? 0) ? p : max,
    );
  }, [posts]);

  const postsRestantes = useMemo(() => {
    if (!postDestacado) return posts;
    return posts.filter((p) => p.id !== postDestacado.id);
  }, [posts, postDestacado]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Cargando feed de publicaciones...
        </p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 px-4 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 px-2 flex justify-between items-center">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Inicio
          </h1>
        </header>

        {postDestacado && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4 px-2">
              <FiStar className="text-yellow-500 text-lg" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Publicación destacada
              </h2>
            </div>
            <PostCard post={postDestacado} featured />
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">
            Publicaciones recientes
          </h2>

          {postsRestantes.length === 0 && !postDestacado ? (
            <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-sm">
              No hay publicaciones todavía. ¡Sé el primero en postear!
            </div>
          ) : (
            postsRestantes.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>
      </div>
    </main>
  );
};

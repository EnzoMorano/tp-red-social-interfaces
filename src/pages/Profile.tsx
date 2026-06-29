import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";
import type { Post } from "../interfaces/types";
import { getPostsByUser } from "../services/api";

export default function Profile() {
  const { user, logout } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError("");

    getPostsByUser(user.id)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        const mensaje =
          err instanceof Error ? err.message : "Error al cargar el perfil";
        setError(mensaje);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Cargando perfil...
        </p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 px-4 transition-colors duration-200">
      <div className="max-w-2xl mx-auto space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Perfil de usuario
            </p>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {user?.nickName}
            </h1>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </section>

        {error && (
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 text-red-500">
            {error}
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white px-1">
            Tus publicaciones
          </h2>

          {posts.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-sm">
              Todavía no publicaste nada.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5"
              >
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap mb-3">
                  {post.descripcion}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {post.comments?.length ?? 0} comentarios
                </p>

                <Link
                  to={`/post/${post.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Ver más
                </Link>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

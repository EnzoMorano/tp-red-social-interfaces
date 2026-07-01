import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiLogOut, FiCalendar, FiMail } from "react-icons/fi";
import { useUser } from "../context/userContext";
import type { Post } from "../interfaces/types";
import { getPostsByUser, getUserById } from "../services/api";

export default function Profile() {
  const { user, logout } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<{
    nickname: string;
    nombre?: string;
    apellido?: string;
    fecha_nacimiento?: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError("");

    Promise.all([getPostsByUser(user.id), getUserById(user.id)])
      .then(([postsData, userInfo]) => {
        setPosts(postsData);
        setUserData(userInfo);
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
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
              {(userData?.nickname || user?.nickname || "U")
                .substring(0, 2)
                .toUpperCase()}
            </div>

            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {userData?.nombre
                  ? `${userData.nombre} ${userData.apellido || ""}`
                  : userData?.nickname || user?.nickname || "Usuario"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{userData?.nickname || user?.nickname}
              </p>

              {userData?.fecha_nacimiento && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-2">
                  <FiCalendar className="text-xs" />
                  <span>
                    {new Date(userData.fecha_nacimiento).toLocaleDateString(
                      "es-AR"
                    )}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <FiLogOut />
              Cerrar sesión
            </button>
          </div>
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
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5 hover:shadow-md transition-all duration-200"
              >
                {post.fecha && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    {new Date(post.fecha).toLocaleString("es-AR", {
                      timeZone: "America/Argentina/Buenos_Aires",
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                )}

                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap mb-3">
                  {post.descripcion}
                </p>

                {post.tags?.length ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        #{tag.nombre}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {post.comments?.length ?? 0} comentarios
                  </span>

                  <Link
                    to={`/post/${post.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Ver más
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

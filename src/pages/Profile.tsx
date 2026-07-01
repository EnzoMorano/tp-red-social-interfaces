import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiCalendar,
  FiUserPlus,
  FiUserMinus,
  FiX,
} from "react-icons/fi";
import { useUser } from "../context/userContext";
import type { Post, User, Seguidor } from "../interfaces/types";
import {
  getPostsByUser,
  getUserById,
  getUsers,
  getFollowing,
  getFollowers,
  followUser,
  unfollowUser,
} from "../services/api";

export default function Profile() {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const [siguiendo, setSiguiendo] = useState(false);
  const [seguidoresCount, setSeguidoresCount] = useState(0);
  const [mostrarSeguidores, setMostrarSeguidores] = useState(false);
  const [seguidores, setSeguidores] = useState<Seguidor[]>([]);
  const [cargandoSeguidores, setCargandoSeguidores] = useState(false);

  const esPropio = !nickname || nickname === user?.nickname;

  const perfilId = esPropio ? user?.id : userData?.id;

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError("");

    if (esPropio) {
      Promise.all([getPostsByUser(user.id), getUserById(user.id)])
        .then(([postsData, userInfo]) => {
          setPosts(postsData);
          setUserData(userInfo);
          setSeguidoresCount(
            userInfo.seguidoresCount ?? userInfo.seguidores ?? 0,
          );
          setLoading(false);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Error al cargar el perfil",
          );
          setLoading(false);
        });
    } else {
      getUsers()
        .then((users: User[]) => {
          const encontrado = users.find(
            (u) => u.nickname?.toLowerCase() === nickname!.toLowerCase(),
          );
          if (!encontrado) {
            setError("Usuario no encontrado");
            setLoading(false);
            return;
          }
          const targetId = encontrado.id;
          Promise.all([
            getPostsByUser(targetId),
            getUserById(targetId),
            getFollowing(user.id),
          ])
            .then(([postsData, userInfo, following]) => {
              setPosts(postsData);
              setUserData({ ...userInfo, nickname: encontrado.nickname });
              setSeguidoresCount(
                userInfo.seguidoresCount ?? userInfo.seguidores ?? 0,
              );
              setSiguiendo(
                following.some(
                  (f: { nickname: string }) =>
                    f.nickname?.toLowerCase() === encontrado.nickname.toLowerCase(),
                ),
              );
              setLoading(false);
            })
            .catch((err) => {
              setError(
                err instanceof Error
                  ? err.message
                  : "Error al cargar el perfil",
              );
              setLoading(false);
            });
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Error al cargar el perfil",
          );
          setLoading(false);
        });
    }
  }, [user, nickname]);

  const abrirSeguidores = async () => {
    if (!perfilId) return;
    setCargandoSeguidores(true);
    setMostrarSeguidores(true);
    try {
      const data = await getFollowers(perfilId);
      setSeguidores(data.seguidores ?? data.followers ?? data);
    } catch {
      setSeguidores([]);
    }
    setCargandoSeguidores(false);
  };

  const handleFollow = async () => {
    if (!user || !userData?.id) return;
    try {
      if (siguiendo) {
        await unfollowUser(userData.id, user.id);
        setSiguiendo(false);
        setSeguidoresCount((prev) => Math.max(0, prev - 1));
      } else {
        await followUser(userData.id, user.id);
        setSiguiendo(true);
        setSeguidoresCount((prev) => prev + 1);
      }
    } catch {
      setError("Error al cambiar el estado de seguimiento");
    }
  };

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

              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={abrirSeguidores}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <strong className="text-gray-900 dark:text-white">
                    {seguidoresCount}
                  </strong>{" "}
                  seguidores
                </button>
              </div>

              {userData?.fecha_nacimiento && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-2">
                  <FiCalendar className="text-xs" />
                  <span>
                    {new Date(userData.fecha_nacimiento).toLocaleDateString(
                      "es-AR",
                    )}
                  </span>
                </div>
              )}
            </div>

            {esPropio ? (
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <FiLogOut />
                Cerrar sesión
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFollow}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                {siguiendo ? <FiUserMinus /> : <FiUserPlus />}
                {siguiendo ? "Dejar de seguir" : "Seguir"}
              </button>
            )}
          </div>
        </section>

        {error && (
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 text-red-500">
            {error}
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white px-1">
            {esPropio
              ? "Tus publicaciones"
              : `Publicaciones de ${userData?.nickname}`}
          </h2>

          {posts.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-sm">
              {esPropio
                ? "Todavía no publicaste nada."
                : "Este usuario no tiene publicaciones."}
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

      {mostrarSeguidores && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setMostrarSeguidores(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm mx-4 p-5 max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Seguidores
              </h3>
              <button
                onClick={() => setMostrarSeguidores(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1">
              {cargandoSeguidores ? (
                <p className="text-center text-gray-400 py-8">Cargando...</p>
              ) : seguidores.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  No tiene seguidores.
                </p>
              ) : (
                seguidores.map((s, i) => {
                  const nick = s.nickname || s.seguidor?.nickname;
                  const nombre = s.nombre || s.seguidor?.nombre;
                  const apellido = s.apellido || s.seguidor?.apellido;
                  return (
                    <div
                      key={s.id ?? i}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => {
                        if (nick) {
                          navigate(`/profile/${nick}`);
                          setMostrarSeguidores(false);
                        }
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {(nick || "U").substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-md text-dark  dark:text-gray-500">
                          @{nick}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

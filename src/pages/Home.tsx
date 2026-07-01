import { useEffect, useMemo, useState } from "react";
import { FiStar } from "react-icons/fi";
import type { Post } from "../interfaces/types";
import { getPosts, getUsers  } from "../services/api";
import { PostCard } from "../components/PostCard";
import { BannerBienvenida } from "../components/BannerBienvenida";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersCount, setUsersCount] = useState<number>(0);
  const navigate = useNavigate();

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

  useEffect(() => {
  getUsers()
    .then((users) => {
      setUsersCount(users.length);
    })
    .catch((error) => {
      console.error("Error cargando usuarios", error);
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
      <main className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 px-4">
    <div className="max-w-6xl  mx-auto  grid  grid-cols-1  lg:grid-cols-[260px_1fr]  gap-6">

  {/* COLUMNA IZQUIERDA */}
      <aside className=" hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 self-start space-y-8 sticky top-20 ">

    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
      UNaHur Anti-Social Net
    </h2>


    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
      Una comunidad para compartir ideas,
      publicaciones y conectar con otros usuarios.
    </p>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500" dark:text-gray-400>
          Usuarios
        </span>

        <span className="font-bold text-gray-900 dark:text-white">
          {usersCount}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500 dark:text-gray-400">
          Posts
        </span>

        <span className="font-bold text-gray-900 dark:text-white">
          {posts.length}
        </span>
      </div>
    </div>


      {/* Sobre / tendencias */}
      <div>
        <h2 className=" font-bold text-lg text-gray-900  dark:text-white  mb-3">
          🔥 Tendencias
        </h2>
        <div className="flex flex-wrap gap-2">
          <span className="  bg-blue-100 dark:bg-blue-900  text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
            #programacion
          </span>
          <span className="  bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200  px-3 py-1 rounded-full text-sm">
            #universidad
          </span>
          <span className=" bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full  text-sm">
            #musica
          </span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
            #viajes
          </span>
        </div>
      </div>



      {/* Estado */}
      <div className=" border-t border-gray-200 dark:border-gray-700 pt-5">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
           Estado
        </h2>
        <p className="text-sm text-gray-600  dark:text-gray-300">
          Todos los servicios funcionan correctamente.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Versión 1.0
        </p>
      </div>

      {/* Privacidad */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
        <h2 className="font-bold text-lg text-gray-900  dark:text-white  mb-3">
           Privacidad
        </h2>
        <p className="text-sm  text-gray-600  dark:text-gray-300  leading-relaxed">
          Tu información está protegida.
          Compartí contenido respetando
          las normas de la comunidad.
        </p>

      <button
        onClick={() => navigate("/privacidad")}
        className=" mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
          Ver políticas →
      </button>
      </div>
    </aside>


    <section>       
          <BannerBienvenida
            postsCount={posts.length}
            usersCount={usersCount}
          />

      <header className="mb-4 px-2">
        <h1 className=" text-xl font-extrabold   text-gray-900  dark:text-white">
          Inicio
        </h1>
  
      </header>

        {postDestacado && (
          <section className="mb-4">
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
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 px-2">
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
            </section>

      </div>
    </main>
  );
};

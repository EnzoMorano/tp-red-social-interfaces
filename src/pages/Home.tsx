import { useEffect, useState } from "react";
import type { Post } from "../interfaces/types";
import { getPosts } from "../services/api"; // Importamos la función limpia
import  {PostCard}  from "../components/PostCard";

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

        {posts.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-sm">
            No hay publicaciones todavía. ¡Sé el primero en postear!
          </div>
        ) : (
          posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))
        )}
      </div>
    </main>
  ); 
};

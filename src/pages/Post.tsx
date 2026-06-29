import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/userContext";
import type { Post } from "../interfaces/types";
import { createComment, getPostById } from "../services/api";

export default function Post() {
  const { id } = useParams();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    async function cargar() {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        setPost(await getPostById(id));
      } catch {
        setError("Error al cargar la publicación");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [id]);

  async function enviarComentario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!text.trim()) {
      setCommentError("El comentario es obligatorio");
      return;
    }

    if (!user || !id) return;

    try {
      await createComment({
        descripcion: text.trim(),
        userId: user.id,
        postId: Number(id),
      });

      setText("");
      setCommentError("");
      setPost(await getPostById(id));
    } catch {
      setCommentError("No se pudo crear el comentario");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Cargando publicación...
        </p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <main className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-red-500 shadow-sm">
          {error || "No se encontró la publicación"}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {post.user?.nickname || "Anónimo"}
          </h1>

          {post.fecha && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{post.fecha}</p>}

          <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap mt-4 mb-4">
            {post.descripcion}
          </p>

          {post.images?.length ? (
            <div className="grid gap-3 mb-4">
              {post.images.map((image, index) => (
                <img
                  key={`${image.url}-${index}`}
                  src={image.url}
                  alt={`Imagen ${index + 1}`}
                  className="w-full rounded-lg object-cover max-h-96 border border-gray-200 dark:border-gray-700"
                />
              ))}
            </div>
          ) : null}

          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200"
                >
                  #{tag.nombre}
                </span>
              ))}
            </div>
          ) : null}
        </article>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Comentarios</h2>

          {!post.comments?.length ? (
            <p className="text-gray-500 dark:text-gray-400">Todavía no hay comentarios.</p>
          ) : (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 p-4">
                  <p className="text-gray-700 dark:text-gray-200">{comment.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          {user ? (
            <form className="space-y-4" onSubmit={enviarComentario}>
              <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Escribí un comentario
              </label>

              <textarea
                id="commentText"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setCommentError("");
                }}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />

              {commentError && <p className="text-red-500 text-sm">{commentError}</p>}

              <button type="submit" className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md">
                Comentar
              </button>
            </form>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Iniciá sesión para comentar.</p>
          )}
        </section>
      </div>
    </main>
  );
}
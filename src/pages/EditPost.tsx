import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { useUser } from "../context/userContext";
import {
  getPostById,
  updatePost,
  createPostImages,
  deletePostImage,
  getTags,
  createTag,
  linkTagToPost,
  unlinkTagFromPost,
  API_URL,
} from "../services/api";
import type { Post } from "../interfaces/types";

export default function EditPost() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState<string[]>([""]);
  const [tags, setTags] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [error, setError] = useState("");
  const [noAutor, setNoAutor] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id || !user) return;

    getPostById(id)
      .then((p: Post) => {
        if (p.user?.nickname !== user.nickname) {
          setNoAutor(true);
          setCargandoDatos(false);
          return;
        }
        setPost(p);
        setDescripcion(p.descripcion || "");
        setTags((p.tags || []).map((t) => t.nombre).join(", "));
        const urls = (p.images || []).map((img) => img.url || img.URL || "");
        setImagenes(urls.length ? [...urls, ""] : [""]);
        setCargandoDatos(false);
      })
      .catch(() => {
        setError("Error al cargar la publicación");
        setCargandoDatos(false);
      });
  }, [id, user]);

  function cambiarImagen(index: number, valor: string) {
    const nuevas = [...imagenes];
    nuevas[index] = valor;
    if (valor.trim() && index === imagenes.length - 1) {
      nuevas.push("");
    }
    setImagenes(nuevas);
  }

  function eliminarImagen(index: number) {
    if (!post) return;
    const img = post.images?.[index];
    if (img?.id) {
      deletePostImage(img.id).catch(() => {});
    }
    const nuevasImagenes = (post.images || []).filter((_, i) => i !== index);
    const nuevasURLs = imagenes.filter((_, i) => {
      const esExistente = i < (post.images || []).length;
      if (esExistente && i === index) return false;
      return true;
    });
    setPost({ ...post, images: nuevasImagenes });
    setImagenes(nuevasURLs.length === 0 ? [""] : nuevasURLs);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id || !descripcion.trim() || !post) return;

    setCargando(true);
    setError("");

    try {
      await updatePost(Number(id), { descripcion: descripcion.trim() });

      const imagenesValidas = imagenes.filter(
        (img) =>
          img.trim() &&
          !post.images?.some((i) => (i.url || i.URL) === img.trim()),
      );
      for (const img of imagenesValidas) {
        await createPostImages({ URL: img.trim(), postId: Number(id) });
      }

      const tagsExistentes = await getTags();
      for (const oldTag of post.tags || []) {
        try {
          await unlinkTagFromPost(Number(id), oldTag.id);
        } catch {}
      }
      if (tags.trim()) {
        const listaTags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        for (const nombre of listaTags) {
          const norm = nombre.toLowerCase();
          let tag = tagsExistentes.find(
            (t: any) => (t.nombre || "").toLowerCase() === norm,
          );
          if (!tag) {
            tag = await createTag({ nombre });
          }
          const tagId = tag?.id ?? tag?.tagId;
          if (tagId) {
            try {
              await linkTagToPost(Number(id), tagId);
            } catch {}
          }
        }
      }

      navigate(`/post/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setCargando(false);
    }
  }

  if (cargandoDatos) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Cargando publicación...
        </p>
      </div>
    );
  }

  if (noAutor) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
        <div className="max-w-lg mx-auto text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-red-500 font-semibold">
            No tenés permiso para editar esta publicación.
          </p>
          <button
            onClick={() => navigate(`/post/${id}`)}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Volver a la publicación
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate(`/post/${id}`)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 cursor-pointer"
        >
          <FiArrowLeft /> Volver a la publicación
        </button>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Editar publicación
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                setError("");
              }}
              rows={6}
              placeholder="¿Qué estás pensando?"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Imágenes
              </p>

              {post.images?.map((img, i) => {
                const src = (img.url || img.URL || "").startsWith("http")
                  ? img.url || img.URL
                  : `${API_URL}${img.url || img.URL}`;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <img
                      src={src}
                      alt=""
                      className="w-12 h-12 rounded object-cover shrink-0"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
                      {img.url || img.URL}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarImagen(i)}
                      className="text-red-500 hover:text-red-700 cursor-pointer shrink-0"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}

              {imagenes.map((imagen, index) => {
                const esExistente = index < (post?.images?.length ?? 0);
                if (esExistente) return null;
                return (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`URL de imagen ${index + 1}`}
                      value={imagen}
                      onChange={(e) => cambiarImagen(index, e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index < imagenes.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nuevas = imagenes.filter((_, j) => j !== index);
                          setImagenes(nuevas.length === 0 ? [""] : nuevas);
                        }}
                        className="px-3 bg-red-500 text-white rounded-lg cursor-pointer"
                      >
                        X
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Etiquetas (separadas por coma)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="musica, arte, fotos"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={cargando}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold disabled:opacity-50 cursor-pointer"
            >
              <FiSave />
              {cargando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

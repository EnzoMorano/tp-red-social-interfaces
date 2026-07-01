import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { createPost, createPostImages, createTag, getTags } from "../services/api";

export default function CreatePost() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState([""]);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [tagsDisponibles, setTagsDisponibles] = useState<any[]>([]);
const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([]);

  useEffect(() => {
    getTags()
      .then((data) => {
        setTagsDisponibles(data);
      })
      .catch((error) => {
        console.error("Error cargando tags:", error);
      });
  }, []); 

  function cambiarImagen(index: number, valor: string) {
    const nuevas = [...imagenes];
    nuevas[index] = valor;
    if (valor.trim() && index === imagenes.length - 1) {
      nuevas.push("");
    }
    setImagenes(nuevas);
  }

  function eliminarImagen(index: number) {
    const nuevas = imagenes.filter((_, i) => i !== index);
    if (nuevas.length === 0) nuevas.push("");
    setImagenes(nuevas);
  }

  function seleccionarTag(nombre:string){
    setTagsSeleccionados((prev)=>{
      if(prev.includes(nombre)){
        return prev.filter(
          tag => tag !== nombre
        );

      }
      return [
        ...prev,
        nombre
      ];
    });
  }

  async function enviarPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (descripcion.trim().length < 10) {
      setError("La descripción debe tener al menos 10 caracteres");
      return;
    }

    if (!user?.nickname) {
      setError("Tu sesión expiró, volvé a iniciar sesión");
      return;
    }

    setCargando(true);

    try {
      // Resolver IDs de tags creándolos si no existen
      const tagIds: number[] = [];
      if (tags.trim()) {
        const listaTags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

      for (const nombre of listaTags) {
        const tagExistente = tagsDisponibles.find(
          (tag) =>
            tag.nombre.toLowerCase() === nombre.toLowerCase()
        );
        if (tagExistente?.id) {
          // ya existe, usamos ese
          tagIds.push(tagExistente.id);

        } else {
          // no existe, lo creamos
          try {
            const tag = await createTag({ nombre });
            const id = tag?.id ?? tag?.tagId;
            if(id){
              tagIds.push(id);
            }
          } catch {}
        }
      }
      }

      const idsTagsSeleccionados = tagsSeleccionados
        .map(nombre =>
          tagsDisponibles.find(
            tag => tag.nombre === nombre
          )?.id
        )
        .filter(Boolean) as number[];


      const postCreado = await createPost({
        descripcion: descripcion.trim(),
        userNickname: user.nickname,
        tagIds: [
          ...tagIds,
          ...idsTagsSeleccionados
        ],
      });

      const imagenesValidas = imagenes
        .map((i) => i.trim())
        .filter((i) => i.startsWith("http"));

      for (const url of imagenesValidas) {
        await createPostImages({ URL: url, postId: postCreado.id });
      }

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error creando publicación"
      );
    } finally {
      setCargando(false);
    }
  }

  <div>

    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      Elegir etiquetas existentes
    </p>
      <div className="flex flex-wrap gap-2">
        {
        tagsDisponibles.map((tag, index)=>(

          <button
            key={`${tag.nombre}-${index}`}
            type="button"
            onClick={() => seleccionarTag(tag.nombre)}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer transition ${
              tagsSeleccionados.includes(tag.nombre)
              ? "bg-blue-600 text-white"
              : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
            }`}>
            #{tag.nombre}
          </button>
          ))
        }
      </div>
    </div>

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            Crear publicación
          </h1>

          <form onSubmit={enviarPost} className="space-y-4">
            <textarea
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                setError("");
              }}
              rows={6}
              placeholder="¿Qué estás pensando? (mínimo 10 caracteres)"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="space-y-3">
              {imagenes.map((imagen, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`URL de imagen ${index + 1}`}
                    value={imagen}
                    onChange={(e) => cambiarImagen(index, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3"
                  />
                  {imagenes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarImagen(index)}
                      className="px-3 bg-red-500 text-white rounded-lg"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="Etiquetas separadas por coma: musica, arte, fotos"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Elegir etiquetas existentes
          </p>
          <div className="flex flex-wrap gap-2">
              {
              tagsDisponibles.map((tag)=>(
          <button
              key={tag.id}
              type="button"
              onClick={() => seleccionarTag(tag.nombre)}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer transition ${
              tagsSeleccionados.includes(tag.nombre)
              ? "bg-blue-600 text-white"
              : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
              }`}
              >
              #{tag.nombre}
          </button>
          ))
          }
          </div>
      </div>       

            <button
              type="submit"
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
            >
              {cargando ? "Publicando..." : "Publicar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

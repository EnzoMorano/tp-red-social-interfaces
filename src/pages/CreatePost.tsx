import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { createPost, createPostImages, createTag, getTags, linkTagToPost } from "../services/api";


export default function CreatePost() {

  const { user } = useUser();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState([""]);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);


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

    if (nuevas.length === 0) {
      nuevas.push("");
    }

    setImagenes(nuevas);
  }

  async function enviarPost(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (!descripcion.trim()) {
      setError("El post no puede estar vacío");
      return;
    }


    if (!user) {
      return;
    }


    setCargando(true);

    try {

      const postCreado = await createPost({
        descripcion: descripcion.trim(),
        userNickname: user.nickname
      });

      if (tags.trim()) {
        const listaTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

        const tagsExistentes = await getTags();

        for (const nombre of listaTags) {
          let tag = tagsExistentes.find(
            (t: any) => t.nombre.toLowerCase() === nombre.toLowerCase(),
          );

          if (!tag) {
            tag = await createTag({ nombre });
          }

          await linkTagToPost(postCreado.id, tag.id);
        }
      }


      const imagenesValidas = imagenes.filter(img => img.trim());


      for (const img of imagenesValidas) {

        await createPostImages({
          URL: img.trim(),
          postId: postCreado.id
        });

      }




    navigate("/");


    } catch(error){

      setError(
        error instanceof Error
        ? error.message
        : "Error creando publicación"
      );

    } finally {

      setCargando(false);

    }

  }


  return (

    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">

      <div className="max-w-2xl mx-auto">

        <section className="
          bg-white dark:bg-gray-800
          rounded-xl shadow-sm
          p-6
        ">


          <h1 className="
            text-2xl font-bold
            text-gray-900 dark:text-white
            mb-5
          ">
            Crear publicación
          </h1>



          <form
            onSubmit={enviarPost}
            className="space-y-4"
          >


            <textarea

              value={descripcion}

              onChange={(e)=>{
                setDescripcion(e.target.value);
                setError("");
              }}

              rows={6}

              placeholder="¿Qué estás pensando?"

              className="
                w-full
                rounded-lg
                border
                border-gray-300
                dark:border-gray-600
                bg-white
                dark:bg-gray-900
                text-gray-900
                dark:text-white
                p-4
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "

            />

            <div className="space-y-3">

              {imagenes.map((imagen, index) => (

                <div key={index} className="flex gap-2">

                  <input
                    type="text"
                    placeholder={`URL de imagen ${index + 1}`}
                    value={imagen}
                    onChange={(e)=>{
                      cambiarImagen(index, e.target.value);
                    }}
                    className="
                    flex-1
                    rounded-lg
                    border
                    border-gray-300
                    dark:border-gray-600
                    bg-white
                    dark:bg-gray-900
                    text-gray-900
                    dark:text-white
                    p-3
                    "
                  />


                  {imagenes.length > 1 && (

                    <button
                      type="button"
                      onClick={()=> eliminarImagen(index)}
                      className="
                      px-3
                      bg-red-500
                      text-white
                      rounded-lg
                      "
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

            onChange={(e)=>{
              setTags(e.target.value);
            }}

            className="
            w-full
            rounded-lg
            border
            border-gray-300
            dark:border-gray-600
            bg-white
            dark:bg-gray-900
            text-gray-900
            dark:text-white
            p-3
            "

            />



            {error && (

              <p className="text-red-500 text-sm">
                {error}
              </p>

            )}



            <button

              disabled={cargando}

              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-5
                py-3
                rounded-lg
                font-semibold
              "

            >

              {cargando
                ? "Publicando..."
                : "Publicar"
              }


            </button>


          </form>


        </section>


      </div>


    </main>

  );

}
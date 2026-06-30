import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { createPost } from "../services/api";


export default function CreatePost() {

  const { user } = useUser();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);


  async function enviarPost(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (!descripcion.trim()) {
      setError("El post no puede estar vacío");
      return;
    }


    if (!user) {
      return;
    }


    try {

      setCargando(true);
      setError("");

      await createPost({
        descripcion: descripcion.trim(),
        userNickname: user.nickname
      });

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
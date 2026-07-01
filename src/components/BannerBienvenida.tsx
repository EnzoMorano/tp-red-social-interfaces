import { FiUsers, FiFileText, FiZap, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

interface BannerBienvenidaProps {
    postsCount: number;
    usersCount: number;
}

export const BannerBienvenida = ({
    postsCount,
    usersCount

}: BannerBienvenidaProps) => {


  const navigate = useNavigate();
  const { user } = useUser();


  const irACrearPost = () => {

    if (user) {
      navigate("/create-post");
    } else {
      navigate("/login");
    }

  };
  return (
    <section
      className="mb-6 rounded-2xl p-8 shadow-md border border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 text-white transition-all duration-1000 hover:scale-[1.02] hover:shadow-xl">
      <h2
        className="text-3xl text-center font-extrabold mb-3 ">
        Bienvenido a UnaHur Anti-Social Net
      </h2>


      <p className="text-blue-100 max-w-xl ">
        Compartí tus ideas, descubrí publicaciones
        y conectate con otros usuarios.
      </p>

    <button
        onClick={irACrearPost}
        className="mt-6 flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-bold transition hover:scale-105 cursor-pointer">
        Crear publicación
    <FiArrowRight />
    </button>

      <div className="flex gap-4 mt-5">

    <div className=" flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
        <FiUsers />
        <span>{usersCount} usuarios</span>
    </div>


    <div className=" flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
        <FiFileText />
        <span>{postsCount} publicaciones</span>
    </div>

    </div>

    </section>
  );
};
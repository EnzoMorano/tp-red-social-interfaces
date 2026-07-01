import { FiMessageSquare, FiEdit } from "react-icons/fi";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import type { Post } from "../interfaces/types";
import { useState } from "react";
import { useUser } from "../context/userContext";
import { API_URL, formatFecha } from "../services/api";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export const PostCard = ({ post, featured }: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const nicknameValido = post.user?.nickname || "Anónimo";
  const [liked, setLiked] = useState(false);
  const [animando, setAnimando] = useState(false);

  const bgColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-yellow-500",
  ];
  const charCodeSum = nicknameValido
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarBg = bgColors[charCodeSum % bgColors.length];
  return (
      <article className={`border border-gray-100 dark:border-gray-700/50 rounded-xl p-5 mb-4 shadow-sm hover:shadow-xl hover:-translate-y-1 dark:hover:bg-gray-800/80 transition-all duration-200 cursor-pointer animate-fade-scale ${      featured
        ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700/50 shadow-md"
        : "bg-white dark:bg-gray-800"
    }`}>
      <div className="flex gap-3.5">
        <div
          className={`w-12 h-12 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-base shadow-inner shrink-0`}
        >
          {nicknameValido.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex-1">
          <Link to={`/post/${post.id}`} className="block">
            <div className="flex items-center gap-2 mb-1">
              <Link
                to={`/profile/${nicknameValido.toLowerCase()}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-gray-900 dark:text-gray-100 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {nicknameValido}
              </Link>
              <Link
                to={`/profile/${nicknameValido.toLowerCase()}`}
                onClick={(e) => e.stopPropagation()}
                className="text-gray-500 dark:text-gray-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                @{nicknameValido.toLowerCase()}
              </Link>
              {(post.createdAt || post.fecha) && (
                <span className="text-gray-400 dark:text-gray-500 text-xs ml-auto">
                  {formatFecha(post.createdAt || post.fecha)}
                </span>
              )}
              {user?.nickname === nicknameValido && (
                <Link
                  to={`/edit-post/${post.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ml-1"
                >
                  <FiEdit className="text-sm" />
                </Link>
              )}
            </div>

            <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed mb-4 whitespace-pre-wrap">
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
            {post.images?.[0] && (() => {
              const imgUrl = post.images[0].url || post.images[0].URL;
              const src = imgUrl?.startsWith("http") ? imgUrl : `${API_URL}${imgUrl}`;
              return (
                <img
                  src={src}
                  alt="Imagen del post"
                  className="w-full rounded-xl mt-4 mb-2 object-cover max-h-96"
                />
              );
            })()}
          </Link>

          <div className="flex justify-between max-w-sm text-gray-500 dark:text-gray-400 text-sm font-medium mt-4">
            <Link
              to={`/post/${post.id}#comentario`}
              className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer p-1"
            >
              <FiMessageSquare className="text-base" />
              <span>Comentar ({post.comments?.length})</span>
            </Link>
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }
                setLiked(!liked);
                setAnimando(true);
                setTimeout(() => setAnimando(false), 300);
              }}
              className={`flex items-center gap-2 transition-colors cursor-pointer p-1 ${
                liked
                  ? "text-red-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              }`}
            >
              {liked ? (
                <IoMdHeart
                  className={`text-base ${animando ? "animate-[like-pop_0.3s_ease]" : ""}`}
                />
              ) : (
                <IoIosHeartEmpty className="text-base" />
              )}
              <span>Me gusta</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;

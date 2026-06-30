import { FiHeart, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { Post } from "../interfaces/types";
import { useState } from "react";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const nicknameValido = post.user?.nickname || "Anónimo";
  const [liked, setLiked] = useState(false);

  const bgColors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-yellow-500"];
  const charCodeSum = nicknameValido.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarBg = bgColors[charCodeSum % bgColors.length];
  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-5 mb-4 shadow-sm hover:shadow-md dark:hover:bg-gray-800/80 transition-all duration-200 cursor-pointer">
      <div className="flex gap-3.5">

        <div className={`w-12 h-12 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-base shadow-inner shrink-0`}>
          {nicknameValido.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex-1">
          <Link to={`/post/${post.id}`} className="block">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900 dark:text-gray-100 text-[15px]">
                {nicknameValido}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                @{nicknameValido.toLowerCase()}
              </span>
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
              {post.images?.[0]?.url && (
                <img
                  src={post.images[0].url}
                  alt="Imagen del post"
                  className="w-full rounded-xl mt-4 mb-2 object-cover max-h-96"/>
              )}
          </Link>

          {post.comments && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              💬 {post.comments.length} comentarios
            </p>
          )}

          <div className="flex justify-between max-w-sm text-gray-500 dark:text-gray-400 text-sm font-medium mt-4">
            <Link
              to={`/post/${post.id}#comentario`}
              className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer p-1"
            >
              <FiMessageSquare className="text-base" />
              <span>Comentar</span>
            </Link>
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 transition-colors cursor-pointer p-1 ${
                liked 
                  ? "text-red-500" 
                  : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              }`}
            >
              <FiHeart className="text-base" />
              <span>{liked ? "Me gusta" : "Me gusta"}</span>
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};

export default PostCard;

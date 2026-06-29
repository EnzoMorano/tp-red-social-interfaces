import { FiHeart, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { Post } from "../interfaces/types";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const nicknameValido = post.user?.nickname || "Anónimo";

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
          </Link>

          <div className="flex justify-between max-w-sm text-gray-500 dark:text-gray-400 text-sm font-medium">
            <button className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer p-1">
              <FiMessageSquare className="text-base" />
              <span>Comentar</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500 dark:hover:text-green-400 transition-colors cursor-pointer p-1">
              <FiShare2 className="text-base" />
              <span>Compartir</span>
            </button>
            <button className="flex items-center gap-2 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer p-1">
              <FiHeart className="text-base" />
              <span>Me gusta</span>
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};

export default PostCard;

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ModeContext";
import { useUser } from "../context/userContext";
import {
  FiMoon,
  FiSun,
  FiLogOut,
  FiBell,
  FiChevronDown,
  FiTrash2,
  FiEdit,
} from "react-icons/fi";
import logoClaro from "../assets/logo claro.png";
import logoOscuro from "../assets/logo oscuro.png";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tema, toggleTema } = useTheme();
  const { user, logout } = useUser();
  const [notifAbierto, setNotifAbierto] = useState(false);
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, texto: "❤️ A alguien le gustó tu publicación" },
    { id: 2, texto: "💬 Tienes un nuevo comentario" },
    { id: 3, texto: "👤 Tienes un nuevo seguidor!" },
  ]);

  useEffect(() => {
    setNotifAbierto(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto gap-2">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img
              src={tema === "light" ? logoOscuro : logoClaro}
              alt="Logo"
              className="w-9 h-9 object-contain"
            />
          </Link>

          {user && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get("q") as string;
                if (q.trim()) {
                  navigate(`/search?q=${encodeURIComponent(q.trim())}`);
                }
              }}
              className="hidden md:block"
            >
              <input
                name="q"
                type="text"
                placeholder="Buscar posts..."
                className="w-64 lg:w-80 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </form>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/create-post"
                className="
                  hidden md:flex
                  items-center gap-2
                  px-4 py-1.5
                  bg-blue-600
                  hover:bg-blue-700
                  hover:-translate-y-1
                  hover:shadow-xl
                  text-white
                  text-sm font-semibold
                  rounded-lg
                  cursor-pointer
                  shadow-lg shadow-blue-500/40
                  transition-all duration-200
                "
              >
                <FiEdit className="text-base" />
                Crear post
              </Link>

              <div className="relative">
                <button
                  onClick={() => setNotifAbierto(!notifAbierto)}
                  className="relative flex items-center cursor-pointer"
                >
                  <FiBell className="text-xl text-gray-700 dark:text-gray-300" />
                  {notificaciones.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {notificaciones.length}
                    </span>
                  )}
                </button>
                {notifAbierto && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
                    <div className="space-y-3">
                      <p className="font-bold text-gray-800 dark:text-white border-b pb-2">
                        Notificaciones
                      </p>
                      {notificaciones.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                          No hay notificaciones todavía.
                        </p>
                      ) : (
                        notificaciones.map((notif) => (
                          <div
                            key={notif.id}
                            className="flex items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg cursor-pointer group"
                          >
                            <span>{notif.texto}</span>
                            <button
                              onClick={() =>
                                setNotificaciones((prev) =>
                                  prev.filter((n) => n.id !== notif.id),
                                )
                              }
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group pb-4 -mb-4 hidden md:block">
                <Link
                  to="/profile"
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {user.nickname}
                  <FiChevronDown className="text-xs" />
                </Link>
                <div className="absolute right-0 top-full hidden group-hover:block pt-1">
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-500 hover:text-red-700 bg-white dark:bg-gray-800 text-sm font-semibold rounded-lg shadow-lg cursor-pointer whitespace-nowrap"
                  >
                    <FiLogOut /> Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 text-sm font-semibold rounded-lg cursor-pointer"
              >
                Registrate
              </Link>
            </div>
          )}

          <button
            onClick={toggleTema}
            className="flex items-center cursor-pointer"
          >
            {tema === "light" ? (
              <FiMoon className="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
            ) : (
              <FiSun className="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
            )}
          </button>

          <button
            onClick={() => setMenuMobileAbierto(!menuMobileAbierto)}
            className="md:hidden flex items-center cursor-pointer p-1"
          >
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuMobileAbierto ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuMobileAbierto && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-3 bg-white dark:bg-gray-900">
          {user && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get("q") as string;
                if (q.trim()) {
                  navigate(`/search?q=${encodeURIComponent(q.trim())}`);
                  setMenuMobileAbierto(false);
                }
              }}
            >
              <input
                name="q"
                type="text"
                placeholder="Buscar posts... (# para tags)"
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </form>
          )}

          {user ? (
            <>
              <Link
                to="/create-post"
                onClick={() => setMenuMobileAbierto(false)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg"
              >
                <FiEdit /> Crear post
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuMobileAbierto(false)}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Perfil ({user?.nickname})
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuMobileAbierto(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600 dark:text-red-500 text-sm font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <FiLogOut /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuMobileAbierto(false)}
                className="block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg text-center"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuMobileAbierto(false)}
                className="block px-4 py-2 border border-blue-600 text-blue-600 text-sm font-semibold rounded-lg text-center"
              >
                Registrate
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;

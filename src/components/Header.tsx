import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ModeContext";
import { useUser } from "../context/userContext";
import {
  FiMoon,
  FiSun,
  FiPlusCircle,
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
  const { tema, toggleTema } = useTheme();
  const { user, logout } = useUser();
  const [notifAbierto, setNotifAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, texto: "❤️ A alguien le gustó tu publicación" },
    { id: 2, texto: "💬 Tienes un nuevo comentario" },
    { id: 3, texto: "👤 Tienes un nuevo seguidor!" },
  ]);

  useEffect(() => {
    setNotifAbierto(false);
  }, [location.pathname]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <Link to="/">
          <img
            src={tema === "light" ? logoOscuro : logoClaro}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/create-post"
                className="
                  flex items-center gap-2
                  px-4 py-1.5
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  text-sm
                  font-semibold
                  rounded-lg
                  cursor-pointer
                  shadow-lg
                  shadow-blue-500/40
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

              <div className="relative group pb-4 -mb-4">
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
                    <FiLogOut />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
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
        </div>
      </div>
    </header>
  );
}

export default Header;

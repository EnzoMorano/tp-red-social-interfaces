import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ModeContext";
import { useUser } from "../context/userContext";
import {
  FiMoon,
  FiSun,
  FiLogOut,
  FiBell,
  FiChevronDown,
  FiEdit,
} from "react-icons/fi";
import logo from "../assets/logo.png";

function Header() {
  const { tema, toggleTema } = useTheme();
  const { user, logout } = useUser();
  const [notifAbierto, setNotifAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg cursor-pointer shadow-lg shadow-blue-500/40">
                <FiEdit className="text-base" />
                Crear post
              </button>

              <div className="relative">
                <button
                  onClick={() => setNotifAbierto(!notifAbierto)}
                  className="flex items-center cursor-pointer"
                >
                  <FiBell className="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
                </button>
                {notifAbierto && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 whitespace-nowrap z-50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No hay notificaciones todavía.
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenuAbierto(!menuAbierto)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {user.nickName}
                  <FiChevronDown className="text-xs" />
                </button>
                {menuAbierto && (
                  <div className="absolute right-0 top-full mt-2">
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-500 hover:text-red-700 bg-white dark:bg-gray-800 text-sm font-semibold rounded-lg shadow-lg cursor-pointer whitespace-nowrap"
                    >
                      <FiLogOut />
                      Cerrar sesión
                    </button>
                  </div>
                )}
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
              <button className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 text-sm font-semibold rounded-lg cursor-pointer">
                Registrate
              </button>
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

import { useTheme } from "../context/ModeContext";
import logoClaro from "../assets/logo claro.png";
import logoOscuro from "../assets/logo oscuro.png";

function Footer() {
  const { tema } = useTheme();

  const logo = tema === "light"
    ? logoOscuro
    : logoClaro;
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-3">
    <img
      src={logo}
      alt="UNaHur Anti-Social Net"
      className="w-16 h-16 object-contain"/>

        <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 text-center">
          UNaHur Anti-Social Net
        </h2>

        <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
          Una red social para compartir publicaciones, interactuar y conectar
          con la comunidad.
        </p>

        <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <p>© 2026 UNaHur Anti-Social Net - Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

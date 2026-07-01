import { useTheme } from "../context/ModeContext";
import logoClaro from "../assets/logo claro.png";
import logoOscuro from "../assets/logo oscuro.png";

export default function Privacidad() {
    const { tema } = useTheme();

    const logo = tema === "light"
        ? logoOscuro
        : logoClaro;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">

    <div className="flex flex-col items-center mb-8">

    <img
        src={logo}
        alt="UnaHur Anti-Social Net"
        className=" w-24 h-24 object-contain mb-4"
    />
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            UnaHur Anti-Social Net
        </p>
    </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          Política de Privacidad
        </h1>

        <div className="space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              1. Información que recopilamos
            </h2>

            <p>
              UnaHur Anti-Social Net recopila únicamente
              la información necesaria para brindar una
              experiencia de comunidad dentro de la plataforma,
              como nombre de usuario, publicaciones y comentarios.
            </p>

          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              2. Uso de la información
            </h2>

            <p>
              Los datos de los usuarios se utilizan para
              mostrar publicaciones, permitir interacciones
              y mejorar la experiencia dentro de la red social.
            </p>

          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              3. Publicaciones y contenido
            </h2>

            <p>
              Cada usuario es responsable del contenido que
              comparte. Se recomienda mantener un ambiente
              respetuoso dentro de la comunidad.
            </p>

          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              4. Seguridad
            </h2>

            <p>
              Trabajamos para proteger la información de los
              usuarios, aunque ningún sistema conectado a internet
              puede garantizar seguridad absoluta.
            </p>
          </section>
        </div>
      </div>

    </main>
  );
}
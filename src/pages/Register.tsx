import { useState } from "react";
import { useTheme } from "../context/ModeContext";
import logoClaro from "../assets/logo claro.png";
import logoOscuro from "../assets/logo oscuro.png";
import { createUser, getUsers } from "../services/api";
import { useUser } from "../context/userContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);
  const { tema } = useTheme();
  const { login } = useUser();
  const navigate = useNavigate();

  function validarFormulario(): boolean {
    const nuevosErrores: Record<string, string> = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }
    if (!apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    }
    if (!fechaNac.trim()) {
      nuevosErrores.fechaNac = "La fecha de nacimiento es obligatoria";
    }
    if (!nickName.trim()) {
      nuevosErrores.nickName = "El nombre de usuario es obligatorio";
    }
    if (!password.trim()) {
      nuevosErrores.password = "La contraseña es obligatoria";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarEnvio(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      const usuarios = await getUsers();
      const usuario = {
        nombre: nombre,
        apellido: apellido,
        fecha_nacimiento: fechaNac,
        nickname: nickName,
      };

      if (usuarios.find((u: any) => u.nickname === nickName)) {
        setErrores({ nickName: `El usuario "${nickName}" ya está en uso` });
        return;
      }

      const usuarioCreado = await createUser(usuario);

      setEnviado(true);

      login({ id: usuarioCreado.id, nickname: usuarioCreado.nickname });
      navigate("/");
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Error de conexión con el servidor";
      setErrores({ errorServer: mensaje });
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl px-10 py-12">
        <div className="flex flex-col items-center mb-8">
          <img
            src={tema === "light" ? logoOscuro : logoClaro}
            alt="Logo"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Registro
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            UNaHur Anti-Social Net
          </p>
        </div>

        <form className="space-y-5" onSubmit={manejarEnvio} noValidate>
          <div className="flex gap-3">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrores((prev) => ({ ...prev, nombre: "" }));
                }}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errores.nombre ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
              />
              {errores.nombre && (
                <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);
                  setErrores((prev) => ({ ...prev, apellido: "" }));
                }}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errores.apellido ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
              />
              {errores.apellido && (
                <p className="text-red-500 text-sm mt-1">{errores.apellido}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="fechaNac"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Fecha de nacimiento
            </label>
            <input
              type="date"
              id="fechaNac"
              name="fechaNac"
              value={fechaNac}
              onChange={(e) => {
                setFechaNac(e.target.value);
                setErrores((prev) => ({ ...prev, fechaNac: "" }));
              }}
              className={`w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg border ... ${errores.fechaNac ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            />
            {errores.fechaNac && (
              <p className="text-red-500 text-sm mt-1">{errores.fechaNac}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="nickName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nombre de usuario
            </label>
            <input
              type="text"
              id="nickName"
              name="nickName"
              value={nickName}
              onChange={(e) => {
                setNickName(e.target.value);
                setErrores((prev) => ({ ...prev, nickName: "" }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errores.nickName ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            />
            {errores.nickName && (
              <p className="text-red-500 text-sm mt-1">{errores.nickName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrores((prev) => ({ ...prev, password: "" }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errores.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            />
            {errores.password && (
              <p className="text-red-500 text-sm mt-1">{errores.password}</p>
            )}
          </div>

          {enviado && (
            <p className="font-bold text-green-500 text-center">
              ¡Registro exitoso!
            </p>
          )}
          {errores.errorServer && (
            <p className="text-red-500 text-center">{errores.errorServer}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            Registrarse
          </button>
        </form>
        <div className="text-center mt-5">
          <button
            type="button"
            className="text-sm text-gray-900 dark:text-gray-100 bg-transparent border-none"
          >
            ¿Ya tienes cuenta?{" "}
            <Link to="/login">
              <p className="text-sm text-blue-600 hover:text-blue-800 underline transition-all duration-200 cursor-pointer bg-transparent border-none">
                Inicia sesion
              </p>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

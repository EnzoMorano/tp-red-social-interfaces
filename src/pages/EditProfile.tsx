import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useUser } from "../context/userContext";
import { getUserById, getUsers, updateUser } from "../services/api";

export default function EditProfile() {
  const { user, login } = useUser();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nickname, setNickname] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [exito, setExito] = useState("");

  useEffect(() => {
    if (!user) return;
    getUserById(user.id)
      .then((data) => {
        setNombre(data.nombre || "");
        setApellido(data.apellido || "");
        setNickname(data.nickname || "");
        setFechaNacimiento(
          data.fecha_nacimiento
            ? data.fecha_nacimiento.split("T")[0]
            : "",
        );
        setCargandoDatos(false);
      })
      .catch(() => {
        setErrores({ carga: "Error al cargar los datos del perfil" });
        setCargandoDatos(false);
      });
  }, [user]);

  function validarFormulario(): boolean {
    const nuevos: Record<string, string> = {};
    if (!nombre.trim()) nuevos.nombre = "El nombre es obligatorio";
    if (!apellido.trim()) nuevos.apellido = "El apellido es obligatorio";
    if (!nickname.trim()) nuevos.nickname = "El nickname es obligatorio";
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    if (!validarFormulario()) return;

    try {
      const usuarios = await getUsers();
      const duplicado = usuarios.find(
        (u: any) =>
          u.nickname?.toLowerCase() === nickname.trim().toLowerCase() &&
          u.id !== user.id,
      );
      if (duplicado) {
        setErrores((prev) => ({
          ...prev,
          nickname: `El usuario "${nickname.trim()}" ya está en uso`,
        }));
        setCargando(false);
        return;
      }
    } catch {
      // si falla la verificación, continuamos de todos modos
    }

    setCargando(true);
    setExito("");

    try {
      const actualizado = await updateUser(user.id, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        nickname: nickname.trim(),
        fecha_nacimiento,
      });

      login({
        id: user.id,
        nickname: actualizado.nickname || nickname.trim(),
      });

      setExito("¡Perfil actualizado con éxito!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setErrores({
        submit:
          err instanceof Error ? err.message : "Error al actualizar el perfil",
      });
    } finally {
      setCargando(false);
    }
  }

  if (cargandoDatos) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Cargando datos...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 cursor-pointer"
        >
          <FiArrowLeft /> Volver al perfil
        </button>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Editar perfil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrores((prev) => ({ ...prev, nombre: "" }));
                }}
                className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${errores.nombre ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
              />
              {errores.nombre && (
                <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);
                  setErrores((prev) => ({ ...prev, apellido: "" }));
                }}
                className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${errores.apellido ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
              />
              {errores.apellido && (
                <p className="text-red-500 text-sm mt-1">{errores.apellido}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setErrores((prev) => ({ ...prev, nickname: "" }));
                }}
                className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${errores.nickname ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
              />
              {errores.nickname && (
                <p className="text-red-500 text-sm mt-1">{errores.nickname}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                value={fecha_nacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errores.submit && (
              <p className="text-red-500 text-sm">{errores.submit}</p>
            )}
            {errores.carga && (
              <p className="text-red-500 text-sm">{errores.carga}</p>
            )}

            {exito && (
              <p className="font-bold text-green-500 text-center text-sm">
                {exito}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold disabled:opacity-50 cursor-pointer"
            >
              <FiSave />
              {cargando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
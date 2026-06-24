import type { Post } from "../interfaces/types";

const API_URL = "http://localhost:3000";

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function createUser(userData: {
  nombre: string;
  apellido: string;
  nickname: string;
  fecha_nacimiento: string;
}) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "No se pudo crear el usuario");
  }
  return res.json();
}

// ------------------
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error("Error al obtener las publicaciones");
  
  const data = await res.json();
  return data.posts || data;
}
import type { Post } from "../interfaces/types";

const API_URL = "http://localhost:3000";

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function getUserById(id: number) {
  const res = await fetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error("Error al obtener el usuario");
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

export async function getPostById(id: string | number): Promise<Post> {
  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) throw new Error("Error al obtener la publicación");

  return res.json();
}

export async function getCommentsByPost(postId: string | number) {
  const res = await fetch(`${API_URL}/comments/post/${postId}`);
  if (!res.ok) throw new Error("Error al obtener los comentarios");

  const data = await res.json();
  return data.comments || data;
}

export async function createComment(data: {
  descripcion: string;
  userId: number;
  postId: number;
}) {
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "No se pudo crear el comentario");
  }

  return res.json();
}

export async function getPostsByUser(userId: string | number): Promise<Post[]> {
  const res = await fetch(`${API_URL}/users/${userId}/posts`);
  if (!res.ok) throw new Error("Error al obtener los posts del usuario");

  return res.json();
}


export async function createPost(data: {
  descripcion: string;
  userNickname: string;
  tagIds?: number[];
}) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      error.message || "No se pudo crear la publicación"
    );
  }

  return res.json();
}

export async function createPostImages(data: {
  URL: string;
  postId: number;
}) {
  const res = await fetch(`${API_URL}/postImages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let mensaje = "No se pudo guardar la imagen";
    try {
      const err = await res.json();
      mensaje = err.message || err.error || JSON.stringify(err);
    } catch {
      mensaje = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(mensaje);
  }

  return res.json();
}


// ------------------
// Followers
export async function followUser(userId: number, seguidorId: number) {
  const res = await fetch(`${API_URL}/users/${userId}/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seguidorId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "No se pudo seguir al usuario");
  }
  return res.json();
}

export async function unfollowUser(userId: number, seguidorId: number) {
  const res = await fetch(`${API_URL}/users/${userId}/follow`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seguidorId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "No se pudo dejar de seguir");
  }
  return res.json();
}

export async function getFollowers(userId: number) {
  const res = await fetch(`${API_URL}/users/${userId}/followers`);
  if (!res.ok) throw new Error("Error al obtener seguidores");
  return res.json();
}

export async function getFollowing(userId: number) {
  const res = await fetch(`${API_URL}/users/${userId}/following`);
  if (!res.ok) throw new Error("Error al obtener seguidos");
  return res.json();
}

export async function linkTagToPost(postId: number, tagId: number) {
  const res = await fetch(`${API_URL}/posts/${postId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagId }),
  });
  if (!res.ok) {
    let mensaje = "No se pudo vincular el tag";
    try {
      const err = await res.json();
      mensaje = err.message || err.error || JSON.stringify(err);
    } catch {
      mensaje = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(mensaje);
  }
  return res.json();
}

export async function createTag(data: {
  nombre: string;
}) {
  const res = await fetch(`${API_URL}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });


  if (!res.ok) {
    throw new Error("No se pudo crear el tag");
  }


  return res.json();
}

export async function getTags() {
  const res = await fetch(`${API_URL}/tags`);
  if (!res.ok) throw new Error("Error obteniendo tags");
  const data = await res.json();
  return data.tags ?? data;
}
export interface User {
  nickname: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
}

export interface Post {
  id: number;
  descripcion: string;
  fecha?: string;
  user?: PostUser;
  images?: PostImage[];
  tags?: PostTag[];
  comments?: PostComment[];
}

export interface PostUser {
  nickname: string;
  nombre?: string;
  apellido?: string;
}

export interface PostImage {
  url: string;
  URL?: string;
}

export interface PostTag {
  id: number;
  nombre: string;
}

export interface PostComment {
  id: number;
  descripcion: string;
  fecha: string;
  createdAt: string;
  userId: number;
  postId: number;
  user?: { nickname: string };
}

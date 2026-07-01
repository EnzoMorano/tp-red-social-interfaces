export interface User {
  id: number;
  nickname: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  seguidores?: number;
  siguiendo?: number;
  seguidoresCount?: number;
  siguiendoCount?: number;
}

export interface Seguidor {
  id?: number;
  seguidorId?: number;
  seguidoId?: number;
  createdAt?: string;
  nickname?: string;
  nombre?: string;
  apellido?: string;
  seguidor?: {
    id: number;
    nickname: string;
    nombre: string;
    apellido: string;
  };
  seguido?: {
    id: number;
    nickname: string;
    nombre: string;
    apellido: string;
  };
}

export interface Post {
  id: number;
  descripcion: string;
  fecha?: string;
  createdAt?: string;
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
  id?: number;
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

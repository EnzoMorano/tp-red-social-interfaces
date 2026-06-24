export interface User {
  nickname: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
}

export interface Post {
  descripcion: string;
  userNickname: string;
}
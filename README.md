# UNaHur Anti-Social Net

Frontend de la red social "UNaHur Anti-Social Net", una aplicación web desarrollada con React + TypeScript que consume una API REST para la gestión de usuarios, publicaciones, comentarios, tags, imágenes y sistema de seguidores.

## Tecnologías

- **React 19** con **TypeScript**
- **Vite** como bundler
- **React Router DOM** para navegación
- **Tailwind CSS v4** para estilos
- **React Icons** (Feather, Ionicons) para iconografía
- **Context API** para estado global (usuario, tema)

## Integrantes

| Nombre                | DNI        |
| --------------------- | ---------- |
| Morano Enzo Vicente   | 45.316.915 |
| Martina Surget Albano | 46.440.329 |
| Santiago Ianello      | 46.021.403 |
| Castignani Sebastian  | 47.065.138 |

## API

El backend se encuentra en el siguiente repositorio:  
[https://github.com/EnzoMorano/API-red-social](https://github.com/EnzoMorano/API-red-social)

La API corre por defecto en `http://localhost:3000`.

## Requisitos

- Node.js 18+
- npm

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone <repo-url>
cd red-social

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

El frontend se levanta por defecto en `http://localhost:5173`.

Asegurate de tener la API corriendo en `http://localhost:3000` antes de usar la aplicación.

## Estructura del proyecto

```
src/
├── assets/            # Imágenes (logos)
├── components/        # Componentes reutilizables (Header, Footer, PostCard, etc.)
├── context/           # Contextos (UserContext, ModeContext)
├── interfaces/        # Tipos TypeScript (User, Post, PostTag, etc.)
├── pages/             # Páginas (Home, Login, Register, Profile, Post, etc.)
├── services/          # Llamadas a la API
├── App.tsx            # Configuración de rutas
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales y dark mode
```

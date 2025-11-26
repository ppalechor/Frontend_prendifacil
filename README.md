# Frontend Prendifacil

Aplicación React + Vite para la prendería. Incluye módulos de usuarios, préstamos, intereses, empeños y reportes, con autenticación JWT y control por roles.

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:3000` (ver repo backend)

## Instalación

```bash
npm install
npm run dev
```

Abrir en `http://localhost:5173/`.

## Configuración de entorno

- Crear `.env` (o usar `.envlocal`) con:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

Si no se define, se usa el valor por defecto `http://localhost:3000/api`.

## Autenticación

- Login pide identificación numérica y contraseña.
- Recomendado: contraseña mínima de 8 caracteres.
- El interceptor cierra sesión solo en `401`. Los `403` no fuerzan logout.

## Roles y navegación

- `ADMIN`: ve todos los módulos.
- `CLIENTE`: ve “Mi Perfil”, “Préstamos (míos)”, “Intereses”.

## Comandos útiles

- `npm run dev`: desarrollo con Vite.
- `npm run build`: build de producción.
- `npm run preview`: previsualizar el build.
- `npm run lint`: revisar estilo/código.

## Notas

- Las llamadas al API usan `apiBaseUrl` y cabecera `Authorization` con el token JWT.
- Si ves warnings de `react-hooks/exhaustive-deps`, se pueden reducir envolviendo funciones en `useCallback`.

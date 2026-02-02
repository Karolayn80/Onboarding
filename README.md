# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

// Documentación:
// Instalación de Node.js y error de PowerShell
// Proceso:

// Durante la instalación de Node.js, el sistema presentó un error relacionado con la política de ejecución de scripts en PowerShell, lo cual impedía continuar con la instalación de forma normal.

// Para solucionarlo, se ejecutó el siguiente comando: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
// Este comando ajusta la seguridad de PowerShell permitiendo ejecutar scripts locales y scripts descargados que estén firmados, solo para el usuario actual y sin pedir confirmación.

// Error identificado en PowerShell: “La ejecución de scripts está deshabilitada en este sistema”.

// Creación del proyecto con Vite

// Se procedió a crear el proyecto usando Vite. Inicialmente se presentó un error debido al nombre del proyecto.

// Error encontrado: El nombre del proyecto contenía mayúsculas, lo cual no es permitido por npm/Vite. El problema se solucionó cambiando el nombre a solo minúsculas: compensar_prueba

// Error del compilador (SWC + React Compiler)

// El proyecto estaba configurado con: Vite

// @vitejs/plugin-react-swc

// React Compiler (nuevo compilador de React)

// Actualmente, SWC no es compatible con el nuevo React Compiler, lo que generó errores de compilación.

// Solución aplicada

// Se decidió eliminar SWC y usar Babel, siguiendo estos pasos:

// Desinstalar SWC:

// npm remove @vitejs/plugin-react-swc


// Instalar el plugin estándar:

// npm install -D @vitejs/plugin-react


// Modificar vite.config.js para que quede así:

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

//  export default defineConfig({
//  plugins: [react()],
//  })


// Ejecutar el proyecto:

// npm run dev

// Instalación exitosa de dependencias, no se detectaron vulnerabilidades y el proyecto quedó funcionando correctamente con el plugin adecuado.

// Proceso realizado con Git
// Inicialización del repositorio

// git init

// Configuración del usuario

// git config --global user.name

// git config --global user.email

// Verificación de configuración

// git config --global --list

// Preparación de archivos

// git add .

// Primer commit

// git commit -m "creación del proyecto"

// Cambio de rama principal

// git branch -M main

// Vinculación con GitHub

// git remote add origin

// Verificación del remoto

// git remote -v

// Envío del proyecto a GitHub

// git push -u origin main

// Autenticación vía navegador

// Repositorio subido correctamente


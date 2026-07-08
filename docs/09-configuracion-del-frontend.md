# Documento 09 - Configuración del frontend PIAR

## 1. Información general

- Proyecto: PIAR Frontend
- Alcance: configuración visible en la estructura actual del frontend

## 2. Archivos de configuración principales

### 2.1 index.html

- Archivo principal de carga de la SPA.
- Define el contenedor app.
- Carga estilos y scripts principales.

### 2.2 js/config.js

- Contiene la configuración de conexión con el backend.
- Define la URL base y los endpoints de API.
- Permite habilitar o ajustar la integración externa.

### 2.3 js/data.js

- Define el estado inicial base de la aplicación.
- Sirve como respaldo de datos cuando no se obtiene información desde la API.

## 3. Configuración de entorno observada

### 3.1 Entorno local

- El frontend se puede ejecutar mediante un servidor estático local.
- En la verificación se usó un servidor local para cargar la SPA.

### 3.2 Backend asociado

- La aplicación está configurada para consumir el backend en http://localhost:8080.
- Los endpoints configurados incluyen data, reset y health.

## 4. Configuración visual y recursos

- Se usan hojas de estilo separadas para auth, dashboard, main y responsive.
- Se cargan recursos externos como Bootstrap Icons y Chart.js desde CDN.

## 5. Resumen

La configuración del frontend es sencilla y estática. Se concentra en el archivo de configuración API, el punto de entrada HTML y el archivo de datos iniciales. No se observa un sistema complejo de variables de entorno ni de despliegue automatizado.

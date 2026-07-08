# Documento 02 - Arquitectura del frontend PIAR

## 1. Información general

- Proyecto: PIAR Frontend
- Tipo de aplicación: SPA (Single Page Application)
- Enfoque técnico: interfaz renderizada en el navegador con JavaScript vanilla
- Punto de entrada: index.html

## 2. Objetivo de la arquitectura

La arquitectura del frontend oficial busca separar la interfaz, los datos iniciales, la configuración de API, la lógica de negocio y los estilos en módulos independientes, con el fin de mantener una navegación sencilla dentro de una sola página.

## 3. Estructura arquitectónica

### 3.1 Punto de entrada

- index.html actúa como archivo principal de carga.
- Desde este archivo se cargan los estilos y los scripts de la aplicación.

### 3.2 Estructura de archivos

- css/: estilos de la interfaz por módulos.
- js/: lógica principal, datos iniciales, configuración y capa API.
- assets/: recursos visuales de la interfaz.
- docs/: documentación técnica del proyecto.

## 4. Componentes principales

### 4.1 HTML

- index.html define el contenedor principal de la aplicación.
- El contenido dinámico se renderiza desde JavaScript en el elemento app.

### 4.2 JavaScript

- data.js contiene los datos iniciales del sistema.
- config.js define la configuración de conexión a la API.
- api.js encapsula las solicitudes HTTP.
- app.js orquesta la renderización, navegación y comportamiento de la interfaz.

### 4.3 CSS

- La interfaz separa estilos por responsabilidad en varios archivos CSS.
- Esto permite modularizar la experiencia visual de autenticación y dashboard.

## 5. Flujo de ejecución

1. Se carga index.html.
2. Se cargan los archivos JavaScript en orden.
3. Se inicializa el estado de la aplicación con los datos base.
4. Se renderiza la pantalla de login.
5. El usuario accede a los módulos principales desde la barra lateral.
6. La aplicación actualiza el contenido del DOM sin recargar la página completa.

## 6. Patrón de diseño observado

La arquitectura actual corresponde a un patrón simple de SPA con:

- estado local en memoria,
- almacenamiento en localStorage,
- renderizado dinámico del DOM,
- separación entre datos, configuración, API y vista.

## 7. Limitaciones arquitectónicas

- No existe un framework de interfaz como React, Vue o Angular.
- La lógica está concentrada en un único archivo principal de aplicación.
- La integración con el backend se realiza a través de una capa de API simple.

## 8. Resumen

La arquitectura del frontend oficial es una SPA ligera, modular en archivos, orientada a navegador y basada en JavaScript vanilla. Está organizada para separar datos, lógica, servicios y estilos, aunque su estructura sigue siendo simple y centralizada.

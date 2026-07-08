# Documento 03 - Capas del frontend PIAR

## 1. Información general

- Proyecto: PIAR Frontend
- Enfoque: arquitectura por capas para una SPA simple
- Alcance: descripción de las capas implementadas en el frontend oficial

## 2. Capas identificadas

### 2.1 Capa de presentación

Responsable de la interfaz gráfica visible en el navegador.

- index.html define la estructura base.
- Los módulos principales se pintan dinámicamente mediante JavaScript.
- Los estilos se organizan en archivos CSS separados.

### 2.2 Capa de lógica de interfaz

Responsable de la interacción con el usuario y del renderizado de vistas.

- app.js contiene la lógica de navegación entre módulos.
- Gestiona la carga de vistas como login, dashboard, estudiantes, docentes, PIAR, reportes y configuración.
- Administra eventos de formularios, modales, filtros y renderización de tablas y tarjetas.

### 2.3 Capa de datos

Responsable de contener la información inicial del sistema.

- data.js define el objeto APP_DATA con los datos base del sistema.
- Este objeto alimenta la aplicación al iniciar.
- La información también se persiste en localStorage.

### 2.4 Capa de configuración

Responsable de definir parámetros operativos del frontend.

- config.js contiene la configuración de la API.
- Define el modo de operación, URL base, rutas de endpoints y datos de conexión.

### 2.5 Capa de integración con servicios

Responsable de consumir la API del backend.

- api.js implementa funciones para consultar, guardar, restaurar y verificar salud del backend.
- Se encarga de construir URLs, enviar solicitudes y adaptar respuestas.

### 2.6 Capa de persistencia local

Responsable de guardar estado cuando no hay conexión o cuando se desea respaldo local.

- localStorage se usa para almacenar datos del sistema y usuarios de autenticación.
- Esta capa actúa como respaldo del estado de la aplicación.

## 3. Relación entre capas

La aplicación opera de la siguiente manera:

1. La capa de presentación recibe la solicitud del usuario.
2. La capa de lógica de interfaz decide qué vista renderizar.
3. La capa de datos aporta el contenido inicial.
4. La capa de integración consulta o guarda información en el backend.
5. La capa de persistencia local conserva el estado cuando es necesario.

## 4. Observaciones

La capa de presentación y la capa lógica están fuertemente unidas en el diseño actual, porque la renderización y el comportamiento se gestionan desde el mismo archivo principal de aplicación.

## 5. Resumen

El frontend oficial está organizado en capas simples: presentación, lógica, datos, configuración, integración y persistencia. Esta separación permite comprender el flujo de la aplicación, aunque el diseño sigue siendo ligero y centralizado.

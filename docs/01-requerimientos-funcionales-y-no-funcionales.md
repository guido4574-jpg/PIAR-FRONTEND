# Documento 01 - Requerimientos funcionales y no funcionales del frontend PIAR

## 1. Información general

- Proyecto: PIAR Frontend
- Tipo de aplicación: Single Page Application (SPA)
- Tecnología base: HTML, CSS, JavaScript vanilla
- Ubicación oficial: raíz del repositorio PIAR-FRONTEND
- Ejecución principal: apertura de index.html desde un servidor local o estático

## 2. Alcance del documento

Este documento describe únicamente los requerimientos funcionales y no funcionales que están implementados en el frontend oficial del proyecto PIAR, tal como aparece en la estructura actual del repositorio.

## 3. Requerimientos funcionales

### 3.1 Autenticación y acceso

1. Mostrar una pantalla de inicio de sesión al cargar la aplicación.
2. Permitir el ingreso mediante correo electrónico y contraseña.
3. Mostrar una vista de registro de usuario.
4. Permitir crear una cuenta local mediante formulario de registro.
5. Permitir iniciar sesión con credenciales de prueba pre-cargadas desde los datos del sistema.
6. Mostrar botones de acceso social de prueba para Google y Outlook.
7. Redirigir al usuario a la interfaz principal una vez autenticado.
8. Permitir cerrar sesión desde la interfaz principal.

### 3.2 Dashboard institucional

1. Mostrar un panel principal con resumen institucional.
2. Mostrar tarjetas de métricas para estudiantes, docentes, PIAR activos y observaciones.
3. Mostrar una tabla de seguimientos recientes.
4. Mostrar gráficos de avance promedio y distribución por necesidad.
5. Mostrar una tabla de alertas de revisión.
6. Permitir acceder a otras vistas desde el dashboard.

### 3.3 Gestión de estudiantes

1. Mostrar una vista para consultar estudiantes.
2. Permitir buscar estudiantes por nombre, documento, grado o diagnóstico.
3. Mostrar tarjetas con información básica de cada estudiante.
4. Permitir crear un estudiante nuevo mediante modal.
5. Permitir editar un estudiante existente mediante modal.
6. Permitir ver el perfil completo de un estudiante.
7. Mostrar información de diagnóstico, valoración, fortalezas, barreras y apoyos requeridos.

### 3.4 Gestión de docentes

1. Mostrar una vista para consultar docentes.
2. Permitir buscar docentes por nombre, área o cargo.
3. Mostrar tarjetas con información básica de cada docente.
4. Permitir crear un docente nuevo mediante modal.
5. Permitir editar un docente existente mediante modal.
6. Permitir ver el perfil completo de un docente.

### 3.5 Gestión de PIAR / PR

1. Mostrar una vista para consultar los PIAR o PR registrados.
2. Permitir buscar PIAR por estudiante, docente, estado o periodo.
3. Mostrar tarjetas con información resumida de cada PIAR.
4. Permitir crear un PIAR mediante modal.
5. Permitir ver el detalle completo de un PIAR.
6. Mostrar avances, objetivos, metas, ajustes y observaciones asociadas.

### 3.6 Observaciones y seguimiento

1. Permitir crear observaciones asociadas a un PIAR.
2. Registrar fecha, tipo, autor, avance y nota de la observación.
3. Mostrar observaciones recientes en el dashboard.
4. Mostrar observaciones dentro del detalle del PIAR.

### 3.7 Reportes

1. Mostrar una vista de reportes.
2. Permitir seleccionar tipo de reporte.
3. Permitir filtrar por estudiante, periodo y fecha.
4. Generar un reporte visual en pantalla.
5. Permitir imprimir o guardar en PDF el reporte generado.

### 3.8 Configuración institucional

1. Mostrar una vista de configuración.
2. Permitir editar datos básicos de la institución.
3. Permitir guardar cambios de configuración.
4. Permitir descargar un respaldo JSON local de los datos.
5. Permitir restaurar los datos iniciales del sistema.

## 4. Requerimientos no funcionales

### 4.1 Arquitectura y estructura

1. La aplicación está implementada como una SPA de una sola página.
2. La interfaz se renderiza mediante JavaScript vanilla.
3. El proyecto se organiza en carpetas separadas para HTML, CSS, JavaScript, assets y documentación.

### 4.2 Rendimiento

1. La carga inicial es ligera porque depende de archivos estáticos y scripts del navegador.
2. La interfaz se actualiza dinámicamente sin recargar la página completa.

### 4.3 Persistencia

1. El estado principal se guarda en localStorage.
2. La aplicación incorpora una capa de consumo de API para intentar persistir datos en un backend externo.
3. Si no hay conexión al backend, la aplicación puede continuar con respaldo local.

### 4.4 Compatibilidad

1. La aplicación está diseñada para ejecutarse en navegadores modernos con soporte para JavaScript.
2. Usa Bootstrap Icons y Chart.js como dependencias externas cargadas desde CDN.

### 4.5 Mantenibilidad

1. La lógica de negocio se concentra en archivos JavaScript separados por responsabilidad.
2. Los estilos están divididos por módulos en archivos CSS distintos.
3. La estructura permite separar datos, configuración, API y vista.

### 4.6 Seguridad

1. La aplicación utiliza credenciales de acceso simples para el flujo de demostración.
2. No se implementa autenticación real con token en el frontend tal como está desarrollado.
3. El guardado de datos en localStorage no reemplaza una capa de seguridad del backend.

## 5. Limitaciones identificadas del frontend

1. La autenticación implementada es de tipo local y de demostración.
2. El acceso social mostrado en la interfaz no ejecuta un flujo OAuth real.
3. La persistencia depende en parte de localStorage y en parte de la API externa configurada.
4. No existe un sistema formal de pruebas automatizadas en el frontend actual.
5. No existe un pipeline de build ni despliegue definido en la estructura actual.

## 6. Resumen

El frontend oficial de PIAR implementa una SPA con módulos de autenticación, dashboard, estudiantes, docentes, PIAR, reportes, configuración y observaciones. La arquitectura es sencilla, basada en JavaScript vanilla, HTML estático y estilos separados por módulo. La persistencia y la integración con backend son parciales y dependen de la capa de API configurada, pero la funcionalidad visible está presente en la interfaz.

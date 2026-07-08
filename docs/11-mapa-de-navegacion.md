# Documento 11 - Mapa de navegación del frontend PIAR

## 1. Información general

- Proyecto: PIAR Frontend
- Alcance: navegación visible en la interfaz actual

## 2. Mapa de navegación principal

### 2.1 Inicio

- Pantalla de login.
- Permite ir a registro o iniciar sesión.

### 2.2 Autenticación

- Login con correo y contraseña.
- Registro de usuario.
- Acceso de prueba con Google y Outlook.

### 2.3 Módulos principales

- Dashboard
- Estudiantes
- Docentes
- PIAR / PR
- Reportes
- Configuración

## 3. Flujo de navegación

1. El usuario ingresa a la pantalla de login.
2. Después de autenticarse, entra al Dashboard.
3. Desde el Dashboard puede navegar a cualquiera de los módulos principales.
4. Cada módulo ofrece acciones internas, como crear, editar, ver o generar reportes.
5. El usuario puede cerrar sesión desde la interfaz principal.

## 4. Navegación por módulo

### 4.1 Dashboard

- Acceso desde la barra lateral.
- Muestra resumen y acceso rápido a otras secciones.

### 4.2 Estudiantes

- Acceso desde la barra lateral.
- Permite ver, crear, editar y ver detalle del estudiante.

### 4.3 Docentes

- Acceso desde la barra lateral.
- Permite ver, crear, editar y ver detalle del docente.

### 4.4 PIAR / PR

- Acceso desde la barra lateral.
- Permite ver, crear y ver detalle de PIAR.

### 4.5 Reportes

- Acceso desde la barra lateral.
- Permite generar reportes y visualizarlos en pantalla.

### 4.6 Configuración

- Acceso desde la barra lateral.
- Permite modificar datos institucionales y realizar mantenimiento.

## 5. Resumen

La navegación del frontend oficial está organizada en una SPA con una barra lateral principal que conecta los módulos de autenticación, dashboard, estudiantes, docentes, PIAR, reportes y configuración. El flujo está claramente definido y se realiza dentro de una única vista dinámica.

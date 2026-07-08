# Documento 05 - Codificación de módulos del frontend PIAR

## 1. Información general

- Proyecto: PIAR Frontend
- Enfoque: documentación de los módulos JavaScript implementados

## 2. Módulos principales

### 2.1 data.js

Responsable de definir el estado base inicial del sistema.

- Contiene el objeto APP_DATA.
- Define la estructura institucional, la autenticación base, estudiantes iniciales, docentes, PIAR, reportes, discapacidades, grados y áreas.

### 2.2 config.js

Responsable de centralizar la configuración de conexión con la API.

- Define la URL base del backend.
- Define el modo de operación del frontend.
- Delimita endpoints como data, reset y health.

### 2.3 api.js

Responsable de encapsular la integración con la API.

- Construye URLs de solicitud.
- Genera headers de petición.
- Implementa funciones para consultar, guardar, reiniciar y verificar la salud del backend.
- Adapta datos cuando la configuración lo requiere.

### 2.4 app.js

Responsable de la lógica completa de la interfaz.

- Inicializa la aplicación al cargar el documento.
- Carga el estado inicial desde la API o desde localStorage.
- Renderiza la pantalla de login y la interfaz de aplicación.
- Gestiona la navegación entre Dashboard, Estudiantes, Docentes, PIAR, Reportes y Configuración.
- Controla la apertura y cierre de modales.
- Gestiona formularios y acciones de guardar, editar, ver y reportar.
- Implementa filtros, gráficos y mensajes de notificación.

## 3. Módulos funcionales de la interfaz

### 3.1 Autenticación

- renderLogin
- login
- registerUser
- socialLogin

### 3.2 Navegación

- renderApp
- renderView
- sidebar
- navbar

### 3.3 Vistas principales

- renderDashboard
- renderStudents
- renderTeachers
- renderPIAR
- renderReports
- renderSettings

### 3.4 Modales y formularios

- openStudentModal
- saveStudent
- openTeacherModal
- saveTeacher
- openPIARModal
- savePIAR
- openObservationModal
- saveObservation

### 3.5 Utilidades

- getStudent
- getTeacher
- fullName
- fullTeacherName
- nextId
- formData
- splitList
- getPIARProgress
- getAverageProgress
- countBy
- searchable

## 4. Observación de codificación

El frontend usa JavaScript vanilla con funciones globales y renderizado dinámico sobre el DOM. La organización es clara por responsabilidades, aunque la lógica principal sigue concentrada en un archivo amplio.

## 5. Resumen

La codificación del frontend está organizada en módulos JavaScript bien diferenciados: datos, configuración, API y lógica principal de interfaz. La estructura permite identificar responsabilidades específicas, aunque no existe una arquitectura de componentes como la de frameworks modernos.

# Documentación completa del frontend oficial PIAR

## 1. Requerimientos funcionales y no funcionales del frontend

### 1.1 Información general

- Proyecto: PIAR Frontend
- Tipo de aplicación: Single Page Application (SPA)
- Tecnología base: HTML, CSS y JavaScript vanilla
- Ubicación oficial: raíz del repositorio PIAR-FRONTEND
- Ejecución principal: apertura de index.html desde un servidor local o estático

### 1.2 Requerimientos funcionales

#### Autenticación y acceso
- Mostrar una pantalla de inicio de sesión al cargar la aplicación.
- Permitir el ingreso mediante correo electrónico y contraseña.
- Mostrar una vista de registro de usuario.
- Permitir crear una cuenta local mediante formulario de registro.
- Permitir iniciar sesión con credenciales de prueba pre-cargadas desde los datos del sistema.
- Mostrar botones de acceso social de prueba para Google y Outlook.
- Redirigir al usuario a la interfaz principal una vez autenticado.
- Permitir cerrar sesión desde la interfaz principal.

#### Dashboard institucional
- Mostrar un panel principal con resumen institucional.
- Mostrar tarjetas de métricas para estudiantes, docentes, PIAR activos y observaciones.
- Mostrar una tabla de seguimientos recientes.
- Mostrar gráficos de avance promedio y distribución por necesidad.
- Mostrar una tabla de alertas de revisión.
- Permitir acceder a otras vistas desde el dashboard.

#### Gestión de estudiantes
- Mostrar una vista para consultar estudiantes.
- Permitir buscar estudiantes por nombre, documento, grado o diagnóstico.
- Mostrar tarjetas con información básica de cada estudiante.
- Permitir crear un estudiante nuevo mediante modal.
- Permitir editar un estudiante existente mediante modal.
- Permitir ver el perfil completo de un estudiante.
- Mostrar información de diagnóstico, valoración, fortalezas, barreras y apoyos requeridos.

#### Gestión de docentes
- Mostrar una vista para consultar docentes.
- Permitir buscar docentes por nombre, área o cargo.
- Mostrar tarjetas con información básica de cada docente.
- Permitir crear un docente nuevo mediante modal.
- Permitir editar un docente existente mediante modal.
- Permitir ver el perfil completo de un docente.

#### Gestión de PIAR / PR
- Mostrar una vista para consultar los PIAR o PR registrados.
- Permitir buscar PIAR por estudiante, docente, estado o periodo.
- Mostrar tarjetas con información resumida de cada PIAR.
- Permitir crear un PIAR mediante modal.
- Permitir ver el detalle completo de un PIAR.
- Mostrar avances, objetivos, metas, ajustes y observaciones asociadas.

#### Observaciones y seguimiento
- Permitir crear observaciones asociadas a un PIAR.
- Registrar fecha, tipo, autor, avance y nota de la observación.
- Mostrar observaciones recientes en el dashboard.
- Mostrar observaciones dentro del detalle del PIAR.

#### Reportes
- Mostrar una vista de reportes.
- Permitir seleccionar tipo de reporte.
- Permitir filtrar por estudiante, periodo y fecha.
- Generar un reporte visual en pantalla.
- Permitir imprimir o guardar en PDF el reporte generado.

#### Configuración institucional
- Mostrar una vista de configuración.
- Permitir editar datos básicos de la institución.
- Permitir guardar cambios de configuración.
- Permitir descargar un respaldo JSON local de los datos.
- Permitir restaurar los datos iniciales del sistema.

### 1.3 Requerimientos no funcionales

#### Arquitectura y estructura
- La aplicación está implementada como una SPA de una sola página.
- La interfaz se renderiza mediante JavaScript vanilla.
- El proyecto se organiza en carpetas separadas para HTML, CSS, JavaScript, assets y documentación.

#### Rendimiento
- La carga inicial es ligera porque depende de archivos estáticos y scripts del navegador.
- La interfaz se actualiza dinámicamente sin recargar la página completa.

#### Persistencia
- El estado principal se guarda en localStorage.
- La aplicación incorpora una capa de consumo de API para intentar persistir datos en un backend externo.
- Si no hay conexión al backend, la aplicación puede continuar con respaldo local.

#### Compatibilidad
- La aplicación está diseñada para ejecutarse en navegadores modernos con soporte para JavaScript.
- Usa Bootstrap Icons y Chart.js como dependencias externas cargadas desde CDN.

#### Mantenibilidad
- La lógica de negocio se concentra en archivos JavaScript separados por responsabilidad.
- Los estilos están divididos por módulos en archivos CSS distintos.
- La estructura permite separar datos, configuración, API y vista.

#### Seguridad
- La aplicación utiliza credenciales de acceso simples para el flujo de demostración.
- No se implementa autenticación real con token en el frontend tal como está desarrollado.
- El guardado de datos en localStorage no reemplaza una capa de seguridad del backend.

### 1.4 Limitaciones identificadas
- La autenticación implementada es de tipo local y de demostración.
- El acceso social mostrado en la interfaz no ejecuta un flujo OAuth real.
- La persistencia depende en parte de localStorage y en parte de la API externa configurada.
- No existe un sistema formal de pruebas automatizadas en el frontend actual.
- No existe un pipeline de build ni despliegue definido en la estructura actual.

---

## 2. Arquitectura del frontend

### 2.1 Información general
- Proyecto: PIAR Frontend
- Tipo de aplicación: SPA
- Enfoque técnico: interfaz renderizada en el navegador con JavaScript vanilla
- Punto de entrada: index.html

### 2.2 Objetivo de la arquitectura
La arquitectura del frontend oficial busca separar la interfaz, los datos iniciales, la configuración de API, la lógica de negocio y los estilos en módulos independientes, con el fin de mantener una navegación sencilla dentro de una sola página.

### 2.3 Estructura arquitectónica

#### Punto de entrada
- index.html actúa como archivo principal de carga.
- Desde este archivo se cargan los estilos y los scripts de la aplicación.

#### Estructura de archivos
- css/: estilos de la interfaz por módulos.
- js/: lógica principal, datos iniciales, configuración y capa API.
- assets/: recursos visuales de la interfaz.
- docs/: documentación técnica del proyecto.

### 2.4 Componentes principales

#### HTML
- index.html define el contenedor principal de la aplicación.
- El contenido dinámico se renderiza desde JavaScript en el elemento app.

#### JavaScript
- data.js contiene los datos iniciales del sistema.
- config.js define la configuración de conexión a la API.
- api.js encapsula las solicitudes HTTP.
- app.js orquesta la renderización, navegación y comportamiento de la interfaz.

#### CSS
- La interfaz separa estilos por responsabilidad en varios archivos CSS.
- Esto permite modularizar la experiencia visual de autenticación y dashboard.

### 2.5 Flujo de ejecución
1. Se carga index.html.
2. Se cargan los archivos JavaScript en orden.
3. Se inicializa el estado de la aplicación con los datos base.
4. Se renderiza la pantalla de login.
5. El usuario accede a los módulos principales desde la barra lateral.
6. La aplicación actualiza el contenido del DOM sin recargar la página completa.

### 2.6 Patrón de diseño observado
La arquitectura actual corresponde a un patrón simple de SPA con:
- estado local en memoria,
- almacenamiento en localStorage,
- renderizado dinámico del DOM,
- separación entre datos, configuración, API y vista.

### 2.7 Limitaciones arquitectónicas
- No existe un framework de interfaz como React, Vue o Angular.
- La lógica está concentrada en un único archivo principal de aplicación.
- La integración con el backend se realiza a través de una capa de API simple.

---

## 3. Capas del frontend

### 3.1 Capa de presentación
Responsable de la interfaz gráfica visible en el navegador.

- index.html define la estructura base.
- Los módulos principales se pintan dinámicamente mediante JavaScript.
- Los estilos se organizan en archivos CSS separados.

### 3.2 Capa de lógica de interfaz
Responsable de la interacción con el usuario y del renderizado de vistas.

- app.js contiene la lógica de navegación entre módulos.
- Gestiona la carga de vistas como login, dashboard, estudiantes, docentes, PIAR, reportes y configuración.
- Administra eventos de formularios, modales, filtros y renderización de tablas y tarjetas.

### 3.3 Capa de datos
Responsable de contener la información inicial del sistema.

- data.js define el objeto APP_DATA con los datos base del sistema.
- Este objeto alimenta la aplicación al iniciar.
- La información también se persiste en localStorage.

### 3.4 Capa de configuración
Responsable de definir parámetros operativos del frontend.

- config.js contiene la configuración de la API.
- Define el modo de operación, URL base, rutas de endpoints y datos de conexión.

### 3.5 Capa de integración con servicios
Responsable de consumir la API del backend.

- api.js implementa funciones para consultar, guardar, restaurar y verificar salud del backend.
- Se encarga de construir URLs, enviar solicitudes y adaptar respuestas.

### 3.6 Capa de persistencia local
Responsable de guardar estado cuando no hay conexión o cuando se desea respaldo local.

- localStorage se usa para almacenar datos del sistema y usuarios de autenticación.
- Esta capa actúa como respaldo del estado de la aplicación.

---

## 4. Seguridad implementada

### 4.1 Medidas de seguridad implementadas

#### Autenticación básica de interfaz
- La aplicación muestra un flujo de login y registro.
- Se valida el ingreso contra credenciales pre-cargadas del sistema y contra usuarios almacenados localmente.
- El acceso se controla desde la lógica del frontend.

#### Almacenamiento local de usuarios
- Los usuarios registrados se guardan en localStorage.
- Esto permite que la sesión y el registro permanezcan en el navegador.

#### Respaldo local de datos
- El estado principal se guarda en localStorage.
- Esto permite que la aplicación continúe operando aunque no haya conexión a la API.

#### Protección básica de rutas de interfaz
- La navegación está condicionada al estado de autenticación de la sesión actual.
- La interfaz muestra la vista principal únicamente después del login.

### 4.2 Limitaciones de seguridad detectadas
- No hay autenticación real.
- No hay cifrado de datos en el navegador.
- No hay control de roles robusto.
- No hay validación avanzada de seguridad del lado del frontend.

### 4.3 Seguridad relacionada con API
- La aplicación está preparada para consumir una API externa definida en config.js.
- La capa API puede enviar headers JSON y token si la configuración lo requiere.
- En la implementación actual, la seguridad de la comunicación depende de la infraestructura del backend y del entorno del navegador.

---

## 5. Codificación de módulos

### 5.1 Módulos principales

#### data.js
Responsable de definir el estado base inicial del sistema.

- Contiene el objeto APP_DATA.
- Define la estructura institucional, la autenticación base, estudiantes iniciales, docentes, PIAR, reportes, discapacidades, grados y áreas.

#### config.js
Responsable de centralizar la configuración de conexión con la API.

- Define la URL base del backend.
- Define el modo de operación del frontend.
- Delimita endpoints como data, reset y health.

#### api.js
Responsable de encapsular la integración con la API.

- Construye URLs de solicitud.
- Genera headers de petición.
- Implementa funciones para consultar, guardar, reiniciar y verificar la salud del backend.
- Adapta datos cuando la configuración lo requiere.

#### app.js
Responsable de la lógica completa de la interfaz.

- Inicializa la aplicación al cargar el documento.
- Carga el estado inicial desde la API o desde localStorage.
- Renderiza la pantalla de login y la interfaz de aplicación.
- Gestiona la navegación entre Dashboard, Estudiantes, Docentes, PIAR, Reportes y Configuración.
- Controla la apertura y cierre de modales.
- Gestiona formularios y acciones de guardar, editar, ver y reportar.
- Implementa filtros, gráficos y mensajes de notificación.

### 5.2 Módulos funcionales de la interfaz
- Autenticación: renderLogin, login, registerUser, socialLogin
- Navegación: renderApp, renderView, sidebar, navbar
- Vistas principales: renderDashboard, renderStudents, renderTeachers, renderPIAR, renderReports, renderSettings
- Modales y formularios: openStudentModal, saveStudent, openTeacherModal, saveTeacher, openPIARModal, savePIAR, openObservationModal, saveObservation
- Utilidades: getStudent, getTeacher, fullName, fullTeacherName, nextId, formData, splitList, getPIARProgress, getAverageProgress, countBy, searchable

---

## 6. Librerías utilizadas

### 6.1 Bootstrap Icons
- Biblioteca usada para íconos visuales en botones, navegación y estados.
- Cargada desde CDN en index.html.

### 6.2 Chart.js
- Biblioteca usada para renderizar gráficos en el dashboard.
- Cargada desde CDN en index.html.

### 6.3 Bootstrap Bundle
- Biblioteca JS del framework Bootstrap cargada desde CDN.
- Se incorpora como recurso adicional al proyecto.

### 6.4 Tecnologías nativas del navegador
- DOM API
- localStorage
- Fetch API
- FormData
- Blob y URL.createObjectURL para descarga de respaldo

---

## 7. Control de versiones

### 7.1 Evidencia del control de versiones
- El repositorio del frontend contiene una carpeta .git.
- Esto indica que el proyecto está bajo control de versiones Git.

### 7.2 Prácticas observadas
- El proyecto presenta una estructura organizada por carpetas y archivos de documentación.
- Los cambios pueden mantenerse rastreables mediante commits locales.
- La documentación técnica se almacena en la carpeta docs/ para seguimiento del proyecto.

### 7.3 Limitaciones observadas
- No se encontraron políticas formales de ramas ni flujos de integración continua.
- No se encontraron archivos de configuración de GitHub Actions ni CI.
- No se encontraron convenciones detalladas de commits o releases.

---

## 8. Pruebas funcionales

### 8.1 Pruebas funcionales verificadas

#### Carga inicial
- Verificado: la aplicación carga correctamente el archivo index.html.
- Resultado: la interfaz muestra la pantalla de login.

#### Login
- Verificado: la pantalla de login se renderiza con formulario de correo y contraseña.
- Resultado: la interfaz permite iniciar el flujo de autenticación.

#### Registro
- Verificado: la pantalla ofrece la opción de registrar usuarios.
- Resultado: el flujo de registro está presente en la interfaz.

#### Navegación principal
- Verificado: la barra lateral permite acceder a los módulos principales.
- Resultado: se despliegan las vistas de Dashboard, Estudiantes, Docentes, PIAR, Reportes y Configuración.

#### Dashboard
- Verificado: el dashboard renderiza tarjetas resumen y tablas de contenido.
- Resultado: la vista se muestra correctamente en el navegador.

#### Estudiantes
- Verificado: la vista de estudiantes muestra el botón para crear estudiantes y la lista de tarjetas.
- Resultado: el módulo está presente y responde a la interfaz.

#### Docentes
- Verificado: la vista de docentes se despliega correctamente.
- Resultado: la interfaz permite la gestión visual de docentes.

#### PIAR
- Verificado: la vista de PIAR se renderiza con opciones de creación y búsqueda.
- Resultado: la interfaz está implementada.

#### Reportes
- Verificado: la vista de reportes muestra filtros y opción de generación.
- Resultado: la funcionalidad de reportes está presente.

#### Configuración
- Verificado: la vista de configuración muestra campos institucionales y opciones de mantenimiento.
- Resultado: la interfaz de configuración se despliega.

### 8.2 Limitaciones de pruebas
- No existen pruebas automatizadas de navegador o unitarias registradas.
- No se evidencia un conjunto formal de casos de prueba documentados.
- La validación corresponde a revisión funcional manual del código y de la ejecución en navegador.

---

## 9. Configuración del frontend

### 9.1 Archivos de configuración principales

#### index.html
- Archivo principal de carga de la SPA.
- Define el contenedor app.
- Carga estilos y scripts principales.

#### js/config.js
- Contiene la configuración de conexión con el backend.
- Define la URL base y los endpoints de API.
- Permite habilitar o ajustar la integración externa.

#### js/data.js
- Define el estado inicial base de la aplicación.
- Sirve como respaldo de datos cuando no se obtiene información desde la API.

### 9.2 Configuración de entorno observada

#### Entorno local
- El frontend se puede ejecutar mediante un servidor estático local.
- En la verificación se usó un servidor local para cargar la SPA.

#### Backend asociado
- La aplicación está configurada para consumir el backend en http://localhost:8080.
- Los endpoints configurados incluyen data, reset y health.

### 9.3 Configuración visual y recursos
- Se usan hojas de estilo separadas para auth, dashboard, main y responsive.
- Se cargan recursos externos como Bootstrap Icons y Chart.js desde CDN.

---

## 10. Ambiente de desarrollo

### 10.1 Herramientas observadas

#### Navegador
- La aplicación se ejecuta directamente en un navegador moderno.
- Requiere soporte para JavaScript, DOM y APIs del navegador.

#### Servidor local
- Se puede servir desde un servidor estático simple.
- La ejecución local fue verificada mediante un servidor HTTP simple en el entorno de desarrollo.

#### Editor y repositorio
- El proyecto está alojado en un repositorio local con Git.
- Se puede trabajar desde un editor de texto o desde un entorno de desarrollo integrado.

### 10.2 Requisitos mínimos
- Navegador moderno.
- Acceso local al backend en http://localhost:8080 para la integración API.
- Conexión a Internet para cargar bibliotecas externas desde CDN.

### 10.3 Limitaciones del ambiente
- No se observa un entorno de build ni de compilación.
- No se observa un gestor de paquetes complejo para el frontend.
- La ejecución depende de archivos estáticos y bibliotecas cargadas desde red.

---

## 11. Mapa de navegación del frontend

### 11.1 Mapa de navegación principal

#### Inicio
- Pantalla de login.
- Permite ir a registro o iniciar sesión.

#### Autenticación
- Login con correo y contraseña.
- Registro de usuario.
- Acceso de prueba con Google y Outlook.

#### Módulos principales
- Dashboard
- Estudiantes
- Docentes
- PIAR / PR
- Reportes
- Configuración

### 11.2 Flujo de navegación
1. El usuario ingresa a la pantalla de login.
2. Después de autenticarse, entra al Dashboard.
3. Desde el Dashboard puede navegar a cualquiera de los módulos principales.
4. Cada módulo ofrece acciones internas, como crear, editar, ver o generar reportes.
5. El usuario puede cerrar sesión desde la interfaz principal.

### 11.3 Navegación por módulo
- Dashboard: acceso desde la barra lateral y resumen institucional.
- Estudiantes: ver, crear, editar y ver detalle.
- Docentes: ver, crear, editar y ver detalle.
- PIAR / PR: ver, crear y ver detalle.
- Reportes: generar reportes y visualizarlos en pantalla.
- Configuración: modificar datos institucionales y realizar mantenimiento.

---

## 12. Resumen general

El frontend oficial de PIAR es una SPA ligera, organizada en archivos HTML, CSS y JavaScript, con módulos para autenticación, dashboard, estudiantes, docentes, PIAR, reportes, observaciones y configuración. Su arquitectura es simple, su integración con API es parcial y su seguridad es básica, pero la estructura funcional está presente y documentada.

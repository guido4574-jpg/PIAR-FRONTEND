# Documento 04 - Seguridad implementada en el frontend PIAR

## 1. Información general

- Proyecto: PIAR Frontend
- Alcance: seguridad visible e implementada en la interfaz oficial
- Observación: la seguridad actual es limitada y orientada a demostración

## 2. Medidas de seguridad implementadas

### 2.1 Autenticación básica de interfaz

- La aplicación muestra un flujo de login y registro.
- Se valida el ingreso contra credenciales pre-cargadas del sistema y contra usuarios almacenados localmente.
- El acceso se controla desde la lógica del frontend.

### 2.2 Almacenamiento local de usuarios

- Los usuarios registrados se guardan en localStorage mediante la clave AUTH_USERS_KEY.
- Esto permite que la sesión y el registro permanezcan en el navegador.

### 2.3 Respaldo local de datos

- El estado principal se guarda en localStorage.
- Esto permite que la aplicación continúe operando aunque no haya conexión a la API.

### 2.4 Protección básica de rutas de interfaz

- La navegación está condicionada al estado de autenticación de la sesión actual.
- La interfaz muestra la vista principal únicamente después del login.

## 3. Limitaciones de seguridad detectadas

### 3.1 No hay autenticación real

- No se evidencia un flujo de autenticación con token o sesión segura del backend.
- El login implementado es local y de demostración.

### 3.2 No hay cifrado de datos en el navegador

- Los datos se almacenan en localStorage sin cifrado adicional en la capa frontend.

### 3.3 No hay control de roles robusto

- La interfaz muestra roles básicos como Administrador o Usuario, pero no implementa un sistema de permisos complejo.

### 3.4 No hay validación avanzada de seguridad del lado del frontend

- Las validaciones presentes son principalmente de formulario y de consistencia de datos.
- No se implementa un sistema de protección contra ataques web modernos en este frontend.

## 4. Seguridad relacionada con API

- La aplicación está preparada para consumir una API externa definida en config.js.
- La capa API puede enviar headers JSON y token si la configuración lo requiere.
- En la implementación actual, la seguridad de la comunicación depende de la infraestructura del backend y del entorno del navegador.

## 5. Resumen

La seguridad implementada en el frontend es básica y orientada a la experiencia de uso. Existen mecanismos de autenticación de interfaz, almacenamiento local y control de acceso visual, pero no se observa una implementación robusta de seguridad real de sesión, autorización o protección de datos sensibles.

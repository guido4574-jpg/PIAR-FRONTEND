# Conexion a API externa

La app ya esta preparada para usar una API externa configurable.

Edita este archivo:

`js/config.js`

## API temporal configurada

Actualmente esta conectada para pruebas a:

```text
https://jsonplaceholder.typicode.com/users
```

Esta API es publica, no requiere token y se usa solo para probar consumo dinamico con Fetch API. Como devuelve usuarios genericos, la app los transforma en estudiantes de prueba PIAR.

Importante: JSONPlaceholder no persiste cambios reales. Crear o editar estudiantes queda como respaldo local mientras se implementa el backend propio en Spring Boot.

## Formato esperado

La API debe manejar un objeto JSON completo con esta estructura general:

```json
{
  "institution": {},
  "auth": {},
  "students": [],
  "teachers": [],
  "piars": [],
  "reportTypes": [],
  "discapacidades": [],
  "grados": [],
  "areas": []
}
```

## Endpoints esperados

Por defecto la app llamara:

```text
GET  /data
PUT  /data
POST /reset
GET  /health
```

`POST /reset` y `GET /health` son opcionales para una primera version.

## Configuracion

Ejemplo generico:

```js
window.PIAR_API_CONFIG = {
    mode: "external",
    adapter: "fullPiarData",
    baseUrl: "https://mi-api.com/api",
    token: "Bearer TU_TOKEN",
    endpoints: {
        data: "/data",
        reset: "/reset",
        health: "/health"
    },
    responseDataPath: "",
    headers: {}
};
```

Si la API externa falla, la app usa respaldo local del navegador para no quedar en blanco.

## Nota de seguridad

Si la API usa una clave privada, lo correcto es no ponerla en el navegador. En ese caso se debe crear un backend intermedio para proteger la clave.

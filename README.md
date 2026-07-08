# PIAR Frontend

Frontend oficial del proyecto PIAR basado en una SPA ubicada en la raiz del repositorio.

## Estructura oficial

```text
PIAR-FRONTEND/
|-- index.html
|-- css/
|-- js/
|-- assets/
`-- docs/
```

## Descripcion

La aplicacion frontend oficial de PIAR se ejecuta desde `index.html` y renderiza la interfaz mediante JavaScript vanilla.

El sistema incluye:

- Login y registro de usuario.
- Dashboard institucional.
- Gestion de estudiantes.
- Gestion de docentes.
- Gestion de PIAR / PR.
- Reportes.
- Configuracion institucional.

## Backend oficial

La SPA consume el backend oficial en:

```text
http://localhost:8080
```

La configuracion de API se encuentra en:

```text
js/config.js
```

## Carpetas principales

- `css/`: estilos de la SPA oficial.
- `js/`: datos iniciales, configuracion, capa API y logica principal de la SPA.
- `assets/`: recursos visuales del frontend.
- `docs/`: documentacion tecnica del proyecto.

## Proyecto historico respaldado

La carpeta `frontend-ejs` fue identificada como un ejercicio independiente y no forma parte de la arquitectura oficial PIAR.

Antes de su eliminacion se genero un respaldo local en:

```text
backups/frontend-ejs-20260626-233248
```

La carpeta `backups/` no hace parte de la arquitectura oficial del frontend; se conserva solo como respaldo operativo de la limpieza controlada.

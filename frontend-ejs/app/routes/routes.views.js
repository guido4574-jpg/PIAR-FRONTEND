const express = require("express");
const controller = require("../controllers/controller.views");
const {
  protegerRuta,
  redirigirSiAutenticado
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", (req, res) => res.redirect("/login"));

router.get("/login", redirigirSiAutenticado, controller.mostrarLogin);
router.post("/login", redirigirSiAutenticado, controller.iniciarSesion);

router.get("/menu", protegerRuta, controller.mostrarMenu);

router.get("/usuarios", protegerRuta, controller.listarUsuarios);
router.get("/usuarios/crear", protegerRuta, controller.mostrarCrearUsuario);
router.post("/usuarios", protegerRuta, controller.crearUsuario);
router.get("/usuarios/:id/editar", protegerRuta, controller.mostrarEditarUsuario);
router.post("/usuarios/:id/editar", protegerRuta, controller.actualizarUsuario);
router.post("/usuarios/:id/eliminar", protegerRuta, controller.eliminarUsuario);

router.post("/logout", protegerRuta, controller.cerrarSesion);
router.get("/logout", protegerRuta, controller.cerrarSesion);

module.exports = router;

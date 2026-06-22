const API_URL = "http://localhost:3001/api";

function obtenerTokenDeRespuesta(data) {
  return data.token || data.jwt || data.accessToken || data.access_token || data.data?.token;
}

function obtenerUsuariosDeRespuesta(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.usuarios)) return data.usuarios;
  if (Array.isArray(data.users)) return data.users;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

function normalizarUsuario(usuario) {
  return {
    id: usuario.id || usuario.id_usuario || usuario.usuario_id,
    nombre: usuario.nombre || usuario.name || usuario.nombres || "",
    correo: usuario.correo || usuario.email || usuario.mail || "",
    rol: usuario.rol || usuario.role || usuario.tipo || ""
  };
}

function crearHeaders(req) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${req.session.token}`
  };
}

async function consumirApi(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  const texto = await respuesta.text();
  const data = texto ? JSON.parse(texto) : {};

  if (!respuesta.ok) {
    const mensaje = data.message || data.mensaje || data.error || "Error al consumir el backend";
    throw new Error(mensaje);
  }

  return data;
}

function mostrarLogin(req, res) {
  res.render("login", {
    title: "Iniciar sesion",
    error: null,
    values: {}
  });
}

async function iniciarSesion(req, res) {
  const correo = (req.body.correo || req.body.email || "").trim();
  const contrasena = req.body.contrasena || req.body.password || "";

  if (!correo || !contrasena) {
    return res.status(400).render("login", {
      title: "Iniciar sesion",
      error: "Debes ingresar correo y contrasena.",
      values: { correo }
    });
  }

  try {
    const data = await consumirApi("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo,
        email: correo,
        contrasena,
        password: contrasena
      })
    });

    const token = obtenerTokenDeRespuesta(data);

    if (!token) {
      throw new Error("El backend no devolvio un token JWT.");
    }

    req.session.token = token;
    req.session.usuario = data.usuario || data.user || { correo };

    return res.redirect("/menu");
  } catch (error) {
    return res.status(401).render("login", {
      title: "Iniciar sesion",
      error: error.message || "Credenciales invalidas.",
      values: { correo }
    });
  }
}

function mostrarMenu(req, res) {
  res.render("menu", {
    title: "Menu principal",
    usuario: req.session.usuario
  });
}

async function listarUsuarios(req, res) {
  try {
    const data = await consumirApi("/usuarios", {
      method: "GET",
      headers: crearHeaders(req)
    });

    const usuarios = obtenerUsuariosDeRespuesta(data).map(normalizarUsuario);

    return res.render("usuarios/index", {
      title: "Usuarios",
      usuarios,
      error: null,
      success: req.query.success || null
    });
  } catch (error) {
    return res.render("usuarios/index", {
      title: "Usuarios",
      usuarios: [],
      error: error.message,
      success: null
    });
  }
}

function mostrarCrearUsuario(req, res) {
  res.render("usuarios/form", {
    title: "Crear usuario",
    action: "/usuarios",
    method: "POST",
    usuario: {},
    error: null
  });
}

async function crearUsuario(req, res) {
  try {
    await consumirApi("/usuarios", {
      method: "POST",
      headers: crearHeaders(req),
      body: JSON.stringify(crearPayloadUsuario(req.body))
    });

    return res.redirect("/usuarios?success=Usuario creado correctamente");
  } catch (error) {
    return res.status(400).render("usuarios/form", {
      title: "Crear usuario",
      action: "/usuarios",
      method: "POST",
      usuario: req.body,
      error: error.message
    });
  }
}

async function mostrarEditarUsuario(req, res) {
  try {
    const data = await consumirApi(`/usuarios/${req.params.id}`, {
      method: "GET",
      headers: crearHeaders(req)
    });

    const usuario = normalizarUsuario(data.usuario || data.user || data.data || data);

    return res.render("usuarios/form", {
      title: "Editar usuario",
      action: `/usuarios/${req.params.id}/editar`,
      method: "POST",
      usuario,
      error: null
    });
  } catch (error) {
    return res.redirect(`/usuarios?success=${encodeURIComponent(error.message)}`);
  }
}

async function actualizarUsuario(req, res) {
  try {
    await consumirApi(`/usuarios/${req.params.id}`, {
      method: "PUT",
      headers: crearHeaders(req),
      body: JSON.stringify(crearPayloadUsuario(req.body))
    });

    return res.redirect("/usuarios?success=Usuario actualizado correctamente");
  } catch (error) {
    return res.status(400).render("usuarios/form", {
      title: "Editar usuario",
      action: `/usuarios/${req.params.id}/editar`,
      method: "POST",
      usuario: { ...req.body, id: req.params.id },
      error: error.message
    });
  }
}

async function eliminarUsuario(req, res) {
  try {
    await consumirApi(`/usuarios/${req.params.id}`, {
      method: "DELETE",
      headers: crearHeaders(req)
    });

    return res.redirect("/usuarios?success=Usuario eliminado correctamente");
  } catch (error) {
    return res.redirect(`/usuarios?success=${encodeURIComponent(error.message)}`);
  }
}

function cerrarSesion(req, res) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
}

function crearPayloadUsuario(body) {
  const correo = (body.correo || body.email || "").trim();
  const contrasena = body.contrasena || body.password || "";
  const payload = {
    nombre: (body.nombre || body.name || "").trim(),
    correo,
    email: correo,
    rol: (body.rol || body.role || "").trim()
  };

  if (contrasena) {
    payload.contrasena = contrasena;
    payload.password = contrasena;
  }

  return payload;
}

module.exports = {
  mostrarLogin,
  iniciarSesion,
  mostrarMenu,
  listarUsuarios,
  mostrarCrearUsuario,
  crearUsuario,
  mostrarEditarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cerrarSesion
};

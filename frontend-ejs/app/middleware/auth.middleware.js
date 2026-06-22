function protegerRuta(req, res, next) {
  if (!req.session || !req.session.token) {
    return res.redirect("/login");
  }

  return next();
}

function redirigirSiAutenticado(req, res, next) {
  if (req.session && req.session.token) {
    return res.redirect("/menu");
  }

  return next();
}

module.exports = {
  protegerRuta,
  redirigirSiAutenticado
};

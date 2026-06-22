const express = require("express");
const session = require("express-session");
const path = require("path");
const routesViews = require("./app/routes/routes.views");

const app = express();
const PORT = 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "frontend-ejs-jwt-sena-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use("/", routesViews);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Pagina no encontrada",
    message: "La ruta solicitada no existe."
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Frontend EJS disponible en http://localhost:${PORT}`);
  });
}

module.exports = app;

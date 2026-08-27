const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const { sequelize, AuthUser } = require("./auth-db");
require("dotenv").config();

const app = express();
const puerto = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando desde backend");
});

app.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y password son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La password debe tener al menos 6 caracteres" });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const existente = await AuthUser.findOne({ where: { email: emailNormalizado } });
    if (existente) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const usuario = await AuthUser.create({
      nombre: nombre.trim(),
      email: emailNormalizado,
      password: passwordHash,
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo registrar el usuario" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await AuthUser.findOne({ where: { email: email?.trim().toLowerCase() } });

    if (!usuario || !(await bcrypt.compare(password || "", usuario.password))) {
      return res.status(401).json({ error: "Email o password incorrectos" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || "clave-local-cambiar-en-produccion",
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo iniciar sesión" });
  }
});


app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM usuarios");
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar PostgreSQL" });
  }
});

sequelize
  .sync()
  .then(() => {
    app.listen(puerto, () => {
      console.log(`Servidor en http://localhost:${puerto}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo conectar con PostgreSQL mediante Sequelize:", error);
  });
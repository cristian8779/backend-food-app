const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Cargar variables de entorno

// Registro de usuario
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    // Generar token con rol e ID
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      user.role === "admin" ? {} : { expiresIn: "2h" } // Sin expiración para admins
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({ error: "Acceso denegado, token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// Middleware para validar si es Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }
  next();
};

const canCreateAdmin = (req, res, next) => {
  // Si no hay usuario autenticado, continuar sin restricciones
  if (!req.user) return next();

  // Solo un admin puede crear otro admin
  if (req.user.role !== "admin" && req.body.role === "admin") {
    return res.status(403).json({ error: "No tienes permisos para crear un administrador" });
  }
  next();
};

module.exports = { register, login, verifyToken, isAdmin, canCreateAdmin };

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const getLocalIP = require("./config/network"); // Obtener la IP local

// Importar controladores y rutas
const { register, login, verifyToken, isAdmin, canCreateAdmin } = require("./controllers/authController");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const LOCAL_IP = getLocalIP(); // Detecta la IP automáticamente

// Configuración
app.use(cors({ origin: "*" }));
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas de autenticación
app.post("/auth/register", canCreateAdmin, register);
app.post("/auth/login", login);
app.get("/auth/admin", verifyToken, isAdmin, (req, res) => {
    res.json({ message: "Bienvenido Admin" });
});

// Rutas de productos
app.use("/productos", productRoutes);

// Rutas de ventas
app.use("/ventas", saleRoutes);

// Iniciar servidor en la IP detectada
app.listen(PORT, LOCAL_IP, () => console.log(`🚀 Servidor corriendo en http://${LOCAL_IP}:${PORT}`));

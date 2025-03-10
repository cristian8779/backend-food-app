const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Importar controladores y rutas
const { register, login, verifyToken, isAdmin, canCreateAdmin } = require("./controllers/authController");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración
app.use(cors({ origin: "*" })); // Permitir conexiones desde cualquier origen
app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, )
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((error) => console.error("❌ Error conectando a MongoDB:", error));

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

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Servidor corriendo en http://192.168.0.91:${PORT}`));

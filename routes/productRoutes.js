const express = require("express");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../controllers/authController");

const router = express.Router();

// Obtener productos (público)
router.get("/", getProducts);

// Crear producto (solo admin)
router.post("/", verifyToken, isAdmin, createProduct);

// Actualizar producto (solo admin)
router.put("/:id", verifyToken, isAdmin, updateProduct);

// Eliminar producto (solo admin)
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;

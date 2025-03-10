const express = require("express");
const mongoose = require("mongoose");
const { 
  getAllSales, 
  getSaleById, 
  deleteSale, 
  createSale, 
  getSalesStats 
} = require("../controllers/saleController");
const { verifyToken, isAdmin } = require("../controllers/authController");

const router = express.Router();

router.get("/estadisticas", verifyToken, isAdmin, getSalesStats);
router.get("/", verifyToken, isAdmin, getAllSales);
router.get("/:id", verifyToken, validateObjectId, isAdmin, getSaleById);
router.delete("/:id", verifyToken, validateObjectId, isAdmin, deleteSale);
router.post("/", verifyToken, createSale);

function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de venta inválido" });
  }
  next();
}

module.exports = router;


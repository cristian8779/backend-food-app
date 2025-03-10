const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// Registrar una nueva venta
exports.createSale = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No hay productos en la venta" });
    }

    let total = 0;

    // Verificar stock y calcular total
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
      }

      total += product.price * item.quantity;
    }

    // Crear la venta
    const newSale = new Sale({
      user: req.user.id,
      products,
      total,
    });

    await newSale.save();

    // Actualizar stock
    for (let item of products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar la venta", error });
  }
};

// Obtener todas las ventas
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("user", "name")
      .populate("products.product", "name price");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ventas", error });
  }
};

// Obtener una venta por ID (con verificación de ObjectId)
exports.getSaleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de venta inválido" });
    }

    const sale = await Sale.findById(req.params.id)
      .populate("user", "name")
      .populate("products.product", "name price");

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la venta", error });
  }
};

// Eliminar una venta (con verificación de ObjectId)
exports.deleteSale = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de venta inválido" });
    }

    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.json({ message: "Venta eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la venta", error });
  }
};

// Obtener ventas de un usuario específico
exports.getSalesByUser = async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.user.id })
      .populate("products.product", "name price");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ventas del usuario", error });
  }
};

// Filtrar ventas por fecha y usuario
exports.filterSales = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    let filter = {};

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.user = userId;
    }

    const sales = await Sale.find(filter)
      .populate("user", "name")
      .populate("products.product", "name price");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar las ventas", error });
  }
};

// Obtener estadísticas de ventas
exports.getSalesStats = async (req, res) => {
  try {
    const stats = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
          totalOrders: { $sum: 1 },
          avgSaleValue: { $avg: "$total" }
        }
      }
    ]);
    res.json(stats[0] || { totalSales: 0, totalOrders: 0, avgSaleValue: 0 });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas de ventas", error });
  }
};

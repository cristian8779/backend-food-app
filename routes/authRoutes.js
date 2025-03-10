const express = require("express");
const { register, login, verifyToken, isAdmin, canCreateAdmin } = require("../controllers/authController");
const router = express.Router();

router.post("/register", canCreateAdmin, register);
router.post("/login", login);
router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Bienvenido Admin" });
});

module.exports = router;

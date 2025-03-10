const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      minlength: 3 
    },
    email: { 
      type: String, 
      unique: true, 
      required: true, 
      lowercase: true, // Convierte el email a minúsculas
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Formato de correo inválido"] // Validación de email
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6 // Asegura que la contraseña tenga al menos 6 caracteres
    },
    role: { 
      type: String, 
      enum: ["admin", "user"], 
      default: "user" 
    },
  },
  { timestamps: true } // Agrega "createdAt" y "updatedAt"
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const getLocalIP = require("./network"); // Importa la función que obtiene la IP local

const LOCAL_IP = getLocalIP(); // Detecta la IP local automáticamente
const MONGO_URI = process.env.MONGO_URI || `mongodb://${LOCAL_IP}:27017/database`;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, );
        console.log("✅ Conectado a MongoDB en:", MONGO_URI);
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

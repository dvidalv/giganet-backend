const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Configuración de CORS - DEBE IR ANTES DE OTRAS CONFIGURACIONES
app.use(cors({
	origin: 'http://localhost:5173', // URL específica del frontend
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
}));

// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());

// Rutas
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;

// Solo iniciamos el servidor si la conexión a la DB fue exitosa
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

module.exports = app;
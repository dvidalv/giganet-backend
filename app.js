const express = require('express');
const { handleFormContact } = require('./api/mail');
const cors = require('cors');
const usersRouter = require('./routes/users');
require('dotenv').config();
const { dbConnect } = require('./config/db');

const app = express();

// Configuración de CORS - DEBE IR ANTES DE OTRAS CONFIGURACIONES
app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'https://giganet-backend.vercel.app',
			'https://www.giganet-srl.com',
			'https://www.giganet-srl.com/contact',
			'https://www.giganet-srl.com/about',
			'https://www.giganet-srl.com/services',
			'https://www.giganet-srl.com/blog',
			'https://www.giganet-srl.com/contact',
		],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

// Conectar a MongoDB
dbConnect();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/form-contact', handleFormContact);

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

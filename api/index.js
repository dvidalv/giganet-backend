const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const usersRouter = require('../routes/users');
const { handleFormContact } = require('./mail');
const { dbConnect } = require('../config/db');

const app = express();

// Logs iniciales
console.log('🚀 Iniciando servidor...');
console.log('MongoDB URI existe:', !!process.env.MONGODB_URI);

// Configuración de CORS
app.use((req, res, next) => {
	console.log('Request headers:', req.headers);
	console.log('Request origin:', req.headers.origin);
	next();
});

app.use(
	cors({
		origin: function (origin, callback) {
			const allowedOrigins = [
				'http://localhost:5173',
				'http://localhost:3000',
				'https://giganet-backend.vercel.app',
				'https://www.giganet-srl.com',
				'https://giganet-srl.com',
			];

			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('No permitido por CORS'));
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'Origin',
			'X-Requested-With',
			'Accept',
		],
	})
);

// Middleware
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
	res.json({ message: 'API funcionando correctamente' });
});

// Rutas principales
app.use('/api/users', usersRouter);
app.post('/api/form-contact', handleFormContact);

// Conexión a la base de datos
dbConnect()
	.then(() => {
		console.log('✅ Base de datos conectada');
	})
	.catch((err) => {
		console.error('❌ Error conectando a la base de datos:', err);
	});

// Manejo de errores global
app.use((err, req, res, next) => {
	console.error('❌ Error:', err);
	res.status(500).json({ message: 'Algo salió mal!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores del servidor
server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`❌ El puerto ${PORT} está en uso. Intenta con otro puerto.`);
	} else {
		console.error('❌ Error en el servidor:', err);
	}
});

module.exports = app;

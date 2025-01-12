const {dbConnect} = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Verificar si el usuario ya existe
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: 'El usuario ya existe' });
		}

		// Encriptar contraseña
		const salt = await bcrypt.genSalt(8); // Generar un salt aleatorio
		const hashedPassword = await bcrypt.hash(password, salt); // Encriptar la contraseña con el salt

		// Crear nuevo usuario
		const user = new User({
			email,
			password: hashedPassword,
			role: 'user', // Asignar el rol de usuario
		});

		// Guardar usuario
		await user.save();

		// Generar token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		res.status(201).json({
			isSuccess: true,
			data: {
				message: 'Usuario creado exitosamente',
				token,
			},
		});
	} catch (error) {
		console.error('Error detallado:', {
			message: error.message,
			stack: error.stack,
			timestamp: new Date().toISOString(),
		});
		res.status(500).json({
			isSuccess: false,
			data: {
				message: error.message,
			},
		});
	}
};

// Login de usuario
exports.login = async (req, res) => {
	try {
		// Intentar establecer conexión explícitamente
		// console.log('Intentando conectar a la base de datos...');
		const mongoose = await dbConnect();

		// Verificar el estado de la conexión
		// console.log('Estado de conexión:', {
		// 	readyState: mongoose.connection.readyState,
		// 	timestamp: new Date().toISOString(),
		// });

		const { email, password } = req.body;

		// Agregar timeout explícito para la operación de búsqueda
		const user = await Promise.race([
			User.findOne({ email }).exec(),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Timeout al buscar usuario')), 15000)
			),
		]);

		if (!user) {
			// console.log('Usuario no encontrado:', email);
			return res.status(400).json({
				isSuccess: false,
				data: {
					message: 'Credenciales inválidas',
				},
			});
		}

		// Verificar contraseña
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			// console.log('Contraseña inválida');
			return res.status(400).json({
				isSuccess: false,
				data: {
					message: 'Credenciales inválidas',
				},
			});
		}

		// Generar token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '24h',
		});
		// console.log('Token generado:', token);

		res.json({
			isSuccess: true,
			data: {
				token,
				message: 'Login exitoso',
			},
		});
	} catch (error) {
		console.error('Error detallado en el login:', {
			message: error.message,
			name: error.name,
			stack: error.stack,
			timestamp: new Date().toISOString(),
			mongooseState: mongoose?.connection?.readyState,
		});

		// Mensaje de error más específico basado en el tipo de error
		let errorMessage = 'Error interno del servidor';
		if (error.message.includes('buffering timed out')) {
			errorMessage =
				'Error de conexión con la base de datos. Por favor, intente nuevamente en unos momentos.';
		} else if (error.message === 'Timeout al buscar usuario') {
			errorMessage =
				'La operación tardó demasiado tiempo. Por favor, intente nuevamente.';
		}

		return res.status(500).json({
			isSuccess: false,
			data: {
				message: errorMessage,
			},
		});
	}
};

// ... existing code ...

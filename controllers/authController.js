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
		const salt = await bcrypt.genSalt(10); // Generar un salt aleatorio
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
		const { email, password } = req.body;

		// Verificar si el usuario existe
		const user = await User.findOne({ email });
		if (!user) {
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

		res.json({
			isSuccess: true,
			data: {
				token,
				message: 'Login exitoso',
			},	
		});
	} catch (error) {
		res.status(500).json({
			isSuccess: false,
			data: {
				message: error.message,
			},
		});
	}
};

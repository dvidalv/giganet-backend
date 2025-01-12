const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env'
	);
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferCommands: false,
			serverSelectionTimeoutMS: 30000,
			socketTimeoutMS: 60000,
			connectTimeoutMS: 30000,
			heartbeatFrequencyMS: 2000,
		};

		console.log('Intentando conectar a MongoDB...', {
			uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
			timestamp: new Date().toISOString(),
		});

		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongoose) => {
				console.log('Conexión exitosa a MongoDB', {
					timestamp: new Date().toISOString(),
					readyState: mongoose.connection.readyState,
				});
				return mongoose;
			})
			.catch((error) => {
				console.error('Error de conexión a MongoDB:', {
					error: error.message,
					code: error.code,
					name: error.name,
					timestamp: new Date().toISOString(),
				});
				throw error;
			});
	}

	try {
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (e) {
		cached.promise = null;
		console.error('Error en dbConnect:', {
			error: e.message,
			code: e.code,
			name: e.name,
			timestamp: new Date().toISOString(),
		});
		throw e;
	}
}

mongoose.connection.on('connected', () => {
	console.log('Mongoose: Conexión establecida');
});

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose: Conexión desconectada');
});

mongoose.connection.on('error', (err) => {
	console.error('Mongoose: Error de conexión', {
		error: err.message,
		code: err.code,
		name: err.name,
	});
});

async function testConnection (req, res)  {
		try {
			const mongoose = await dbConnect();
			res.json({
				status: 'ok',
				readyState: mongoose.connection.readyState,
				timestamp: new Date().toISOString(),
				database: mongoose.connection.name,
				host: mongoose.connection.host,
			});
		} catch (error) {
			console.error('Error en db-status:', {
				error: error.message,
				stack: error.stack,
				timestamp: new Date().toISOString(),
			});
			res.status(500).json({
				status: 'error',
				error: error.message,
				timestamp: new Date().toISOString(),
		});
	}
}

module.exports = { dbConnect, testConnection };

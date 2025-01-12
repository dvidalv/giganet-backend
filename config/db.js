const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			serverSelectionTimeoutMS: 20000,
			socketTimeoutMS: 45000,
			connectTimeoutMS: 20000,
			bufferCommands: false,
		});
		console.log(`MongoDB Connected: ${mongoose.connection.host}`);
	} catch (error) {
		console.error(`Error de conexión MongoDB: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectDB;

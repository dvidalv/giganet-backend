const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
	// console.log(uri);

	try {
    await mongoose.connect(uri);
    console.log('Conexión exitosa a MongoDB Atlas');
    console.log(mongoose.connection.name);
  } catch (e) {
    console.error('Error al conectar a MongoDB Atlas', e);
  }

	// try {
	// 	const conn = await mongoose.connect(process.env.MONGODB_URI);

	// 	console.log(`MongoDB Connected: ${conn.connection.host}`);
	// } catch (error) {
	// 	console.error(`Error: ${error.message}`);
	// 	process.exit(1);
	// }
};

module.exports = connectDB;

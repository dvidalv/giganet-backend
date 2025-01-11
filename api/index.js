const express = require('express');

require('dotenv').config();
const cors = require('cors');

const usersRouter = require('../routes/users');

const { handleFormContact } = require('./mail');
const { handleFormContactAdmin } = require('../utils/auth');
const app = express();

app.use(express.json());



const corsOptions = {
	allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
	origin: [
		'http://localhost:3000',
		'http://localhost:3001',
		'http://localhost:5173',
		'http://localhost:5174',
		'https://giganet-backend.vercel.app',
		'https://www.giganet-srl.com',
		'https://www.giganet-srl.com/contact',
	],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Deshabilitar caché en desarrollo
if (process.env.NODE_ENV === 'development') {
	app.set('etag', false);
	app.use((req, res, next) => {
		res.set('Cache-Control', 'no-store');
		next();
	});
}

app.post('/api/form-contact', handleFormContact);

app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

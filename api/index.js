const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {handleFormContact} = require('./mail')
const { autenticar } = require('../utils/auth');
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
	],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
	res.send('Express on Vercel');
});

app.get('/api/v1/comprobantes', (req, res) => {
	res.json({ code: 200, message: 'Comprobante', data: {} });
});

app.post('/api/form-contact', autenticar, handleFormContact);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

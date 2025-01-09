const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Agregar logging para verificar la API key (oculta la mayoría de los caracteres)
const apiKey = process.env.SENDGRID_API_KEY;
console.log(
	'SendGrid API Key configurada:',
	apiKey ? `${apiKey.substring(0, 4)}...${apiKey.slice(-4)}` : 'No encontrada'
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const handleFormContact = async (req, res) => {
	try {
		// Validación de datos de entrada
		const {
			nombre,
			telefono,
			email,
			mensaje,
			locationStatus,
			source,
			timestamp,
			userAgent,
		} = req.body;

		// Validar que todos los campos necesarios existan
		if (!nombre || !email || !mensaje) {
			return res.status(400).json({
				code: 400,
				message: 'Faltan campos requeridos',
				data: { nombre, email, mensaje },
			});
		}

		const msg = {
			to: 'dvidalv@gmail.com', // Cambiar a la dirección de correo electrónico de destino
			from: 'soporte@contrerasrobledo.com.do', // Cambiar a la dirección de correo electrónico de origen
			subject: 'Nuevo mensaje de Giganet',
			html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
        <p><strong>Ubicación:</strong> ${
					locationStatus || 'No proporcionada'
				}</p>
        <p><strong>Dispositivo:</strong> ${req.headers['user-agent']}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
      `,
			// Agregar texto plano como fallback
			text: `
        Nuevo mensaje de contacto
        Nombre: ${nombre}
        Teléfono: ${telefono || 'No proporcionado'}
        Email: ${email}
        Mensaje: ${mensaje}
        Ubicación: ${locationStatus || 'No proporcionada'}
        Dispositivo: ${req.headers['user-agent']}
        Fecha: ${new Date().toLocaleString()}
      `,
			source,
			timestamp,
			userAgent,
		};

		// Agregar más logging antes del envío
		console.log('Intentando enviar email a:', msg.to);

		const response = await sgMail.send(msg);

		// Agregar logging después del envío exitoso
		console.log('Respuesta de SendGrid:', {
			statusCode: response[0].statusCode,
			headers: response[0].headers,
			messageId: response[0].headers['x-message-id'],
		});

		res.json({
			success: true,
			code: 200,
			message: 'Datos recibidos y email enviado correctamente',
			data: { nombre, telefono, email, mensaje, locationStatus },
		});
	} catch (error) {
		// Mejorar el logging de error
		console.error('Error al enviar email:', {
			message: error.message,
			code: error.code,
			response: error.response?.body,
			timestamp: new Date().toISOString(),
		});

		res.status(500).json({
			success: false,
			code: 500,
			message: 'Error al enviar el email',
			error: {
				message: error.message,
				details: error.response?.body,
			},
		});
	}
};

module.exports = {
	handleFormContact,
};

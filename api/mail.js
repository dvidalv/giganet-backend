const sgMail = require('@sendgrid/mail');
require('dotenv').config();
// Configura tu API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const handleFormContact = async (req, res) => {
  try {
    // Validación de datos de entrada
    const { nombre, telefono, email, mensaje, location } = req.body;

    // Validar que todos los campos necesarios existan
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        code: 400,
        message: 'Faltan campos requeridos',
        data: { nombre, email, mensaje }
      });
    }

    const msg = {
      to: 'dvidalv@gmail.com',
      from: 'dvidalv@gmail.com',
      subject: 'Nuevo mensaje de Giganet',
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
        <p><strong>Ubicación:</strong> ${location || 'No proporcionada'}</p>
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
        Ubicación: ${location || 'No proporcionada'}
        Dispositivo: ${req.headers['user-agent']}
        Fecha: ${new Date().toLocaleString()}
      `
    };

    // Intentar enviar el email
    const response = await sgMail.send(msg);
    
    res.json({
      code: 200,
      message: 'Datos recibidos y email enviado correctamente',
      data: { nombre, telefono, email, mensaje, location }
    });

  } catch (error) {
    // Log detallado del error
    console.error('Error completo:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.body,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      code: 500,
      message: 'Error al enviar el email',
      error: {
        message: error.message,
        details: error.response?.body
      }
    });
  }
};

module.exports = {
	handleFormContact,
};

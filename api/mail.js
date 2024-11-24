const sgMail = require('@sendgrid/mail');

// Configura tu API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const handleFormContact = async (req, res) => {
  const { nombre, telefono, email, mensaje, location } = req.body;
  
  const msg = {
    to: 'dvidalv@gmail.com', // Email donde quieres recibir los mensajes
    from: 'dvidalv@gmail.com', // Email verificado en SendGrid
    subject: 'Nuevo mensaje de Giganet',
    html: `
      <h3>Nuevo mensaje de contacto</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong> ${mensaje}</p>
      <p><strong>Ubicación:</strong> ${location}</p>
    `
  };

  try {
    await sgMail.send(msg);
    
    res.json({
      code: 200,
      message: 'Datos recibidos y email enviado correctamente',
      data: { nombre, telefono, email, mensaje, location },
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({
      code: 500,
      message: 'Error al enviar el email',
      error: error.message
    });
  }
};

module.exports = {
	handleFormContact,
};

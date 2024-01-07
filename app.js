const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/uoclogin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir el modelo de usuario
const Usuario = mongoose.model('Usuario', {
  usuario: String,
  contraseña: String,
});

// Configurar bodyParser para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para la página de login
app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    // Consulta parametrizada para evitar inyecciones NoSQL
    const resultado = await Usuario.findOne({ usuario: usuario, contraseña: contraseña });

    if (resultado) {
      // Autenticación exitosa
      res.status(200).json({ mensaje: '¡Bienvenido!' });
    } else {
      // Usuario o contraseña incorrectos
      res.status(401).json({ mensaje: 'Error de autenticación' });
    }
  } catch (error) {
    // Manejar errores de la base de datos
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});


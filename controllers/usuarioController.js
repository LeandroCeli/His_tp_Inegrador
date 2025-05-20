// controllers/admin/usuarioController.js
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

const mostrarFormularioNuevoUsuario = (req, res) =>
{
        const success = req.query.success === '1';
        res.render('admin/nuevoUsuario', {
        success,
        preguntarNuevo: true
      });
}

const crearUsuario = async (req,res) =>
{
    const { nombre, apellido, email, password, rol } = req.body;

    const errores = {};
  
    // Validaciones
    if (!nombre) errores.nombre = 'El nombre es obligatorio.';
    if (!apellido) errores.apellido = 'El apellido es obligatorio.';
    if (!email) errores.email = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.email = 'Formato de correo inválido.';
    if (!password) errores.password = 'La contraseña es obligatoria.';
    else if (password.length < 6) errores.password = 'Debe tener al menos 6 caracteres.';
    if (!rol) errores.rol = 'El rol es obligatorio.';
  
    try {
      const existente = await Usuario.findOne({ where: { email } });
      if (existente) errores.email = 'Este correo ya está registrado.';
    } catch (error) {
      console.error(error);
    }
  
    if (Object.keys(errores).length > 0) {
      return res.render('admin/nuevoUsuario', {
        errores,
        nombre,
        apellido,
        email,
        rol
      });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Usuario.create({
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rol,
        activo: true
      });
  
      res.render('admin/nuevoUsuario', {
        success: 'Usuario creado exitosamente.',
        preguntarNuevo: true
      });
    } catch (err) {
      console.error('Error al crear usuario:', err);
      res.render('admin/nuevoUsuario', { errorGeneral: 'Error inesperado al crear el usuario.' });
    }
}



const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['nombre', 'apellido', 'email', 'rol', 'activo']
    });
    res.render('admin/usuarios', { usuarios });
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    res.render('admin/usuarios', { usuarios: [] });
  }
};

module.exports = { 
    getUsuarios,
    mostrarFormularioNuevoUsuario,
    crearUsuario
};

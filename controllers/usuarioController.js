// controllers/admin/usuarioController.js
const { Usuario,TipoUsuario,Especialidad, UsuarioEspecialidad } = require('../models');
const bcrypt = require('bcrypt');



const mostrarFormularioNuevoUsuario = async (req, res) => {
  try {
  
    const tiposUsuario = await TipoUsuario.findAll();
    const especialidades = await Especialidad.findAll();
    
    const success = req.query.success === '1';

    res.render('admin/nuevoUsuario', {
      success,
      preguntarNuevo: true,
      tiposUsuario,
      especialidades
    });
   
  } catch (error) {
    console.error('Error al cargar datos para el formulario:', error);
    res.render('admin/nuevoUsuario', {
      errorGeneral: 'Error al cargar el formulario.',
      preguntarNuevo: false,
      tiposUsuario: [],
      especialidades: []
    });
  }
};

// Controlador para crear nuevo usuario
const crearUsuario = async (req, res) => {
  const { dni, nombre, apellido, telefono, email, password, rol, especialidad, descripcion, matricula } = req.body;

  const errores = {};
  let errorGeneral = null;
  let success = null;

  // Validaciones básicas
  if (!dni) errores.dni = 'El DNI es obligatorio';
  if (!nombre) errores.nombre = 'El nombre es obligatorio';
  if (!apellido) errores.apellido = 'El apellido es obligatorio';
  if (!telefono) errores.telefono = 'El teléfono es obligatorio';
  if (!email) errores.email = 'El email es obligatorio';
  if (!password) errores.password = 'La contraseña es obligatoria';
  if (!rol) errores.rol = 'Debe seleccionar un rol';

  // Validaciones extra si el rol es médico
  if (rol === 'medico') {
    if (!especialidad) errores.especialidad = 'Debe seleccionar una especialidad';
    if (!matricula) errores.matricula = 'Debe ingresar la matrícula';
    if (!descripcion) errores.descripcion = 'Debe ingresar una descripción';
  }

  if (Object.keys(errores).length > 0) {
    return res.render('view-admin/nuevoUsuario', {
      errores,
      errorGeneral,
      dni,
      nombre,
      apellido,
      telefono,
      email,
      rol,
      especialidad,
      matricula,
      descripcion
    });
  }

  try {
    // Buscar ID del tipo de usuario
    const tipo = await TipoUsuario.findOne({ where: { nombre_tipo: rol } });
    if (!tipo) throw new Error('Rol inválido');

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      dni,
      nombre,
      apellido,
      telefono,
      email,
      password: hashedPassword,
      tipo_usuario_id: tipo.id
    });

    // Si es médico, asociar especialidad
    if (rol === 'medico') {
      let especialidadDb = await Especialidad.findOne({ where: { nombre_especialidad: especialidad } });

      // Si no existe la especialidad, crearla
      if (!especialidadDb) {
        especialidadDb = await Especialidad.create({
          nombre_especialidad: especialidad,
          descripcion
        });
      }

      // Asociar usuario con especialidad
      await UsuarioEspecialidad.create({
        id_usuarios: nuevoUsuario.id_usuario,
        id_especialidad: especialidadDb.id_especialidad
      });
    }

    // Mostrar mensaje de éxito y preguntar si desea crear otro
    return res.render('view-admin/nuevoUsuario', {
      success: '¡Usuario creado con éxito!',
      preguntarNuevo: true
    });

  } catch (err) {
    console.error('Error al crear usuario:', err);
    errorGeneral = 'Hubo un error al crear el usuario. Intente nuevamente.';
    return res.render('view-admin/nuevoUsuario', {
      errorGeneral,
      dni,
      nombre,
      apellido,
      telefono,
      email,
      rol,
      especialidad,
      matricula,
      descripcion
    });
  }
};



const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['nombre', 'apellido', 'activo'],
      include: [{
        model: TipoUsuario,
        as: 'tipoUsuario',
        attributes: ['nombre_tipo']
      }],
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
  

    res.render('admin/usuarios', { usuarios });
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    res.render('admin/usuarios', {
      usuarios: [],
      errorGeneral: 'Ocurrió un error al obtener los usuarios.'
    });
  }
};


module.exports = { 
    getUsuarios,
    mostrarFormularioNuevoUsuario,
    crearUsuario
};

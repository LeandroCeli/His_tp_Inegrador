// controllers/admin/usuarioController.js
const { Usuario,TipoUsuario,Especialidad, UsuarioEspecialidad } = require('../models');
const bcrypt = require('bcrypt');



const mostrarFormularioNuevoUsuario = async (req, res) => {
  try {
    /*const tiposUsuarioRaw = await TipoUsuario.findAll({
      attributes: ['nombre_tipo']
    });
    const tiposUsuario = tiposUsuarioRaw.map(tipo => tipo.nombre_tipo);
    */
    const tiposUsuario = await TipoUsuario.findAll();
    //configurando a bd el cambo nombre_tipo como unico, buscamos el id q hace referencia al medico.
    const medico = await TipoUsuario.findOne({ where: { nombre_tipo: 'Medico' } });
    console.log(medico.id);
    const tipoEspecialidad = await Especialidad.findAll();

    const success = req.query.success === '1';

    res.render('admin/nuevoUsuario', {
      success,
      preguntarNuevo: true,
      tiposUsuario,
      tipoEspecialidad,
      medico:medico.id
    });
  } catch (error) {
    console.error('Error al cargar datos para el formulario:', error);
    res.render('admin/nuevoUsuario', {
      errorGeneral: 'Error al cargar el formulario.',
      preguntarNuevo: false,
      tiposUsuario: [],
      tipoEspecialidad: []
    });
  }
};



const crearUsuario = async (req, res) => {
  const { dni, nombre, apellido, telefono, email, password, tipo_usuario_id, especialidad, descripcion, matricula } = req.body;

   console.log('******'+ tipo_usuario_id);

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
  if (!tipo_usuario_id) errores.rol = 'Debe seleccionar un rol';

  // Validaciones extra si el rol es médico
  if (tipo_usuario_id === 'medico') {
    if (!especialidad) errores.especialidad = 'Debe seleccionar una especialidad';
    if (!matricula) errores.matricula = 'Debe ingresar la matrícula';
    if (!descripcion) errores.descripcion = 'Debe ingresar una descripción';
  }

  // Si hay errores de validación, volver a la vista con errores y campos cargados
  if (Object.keys(errores).length > 0) {
    const tiposDb = await TipoUsuario.findAll({ attributes: ['nombre_tipo'] });
    const tiposUsuario = tiposDb.map(t => t.nombre_tipo);

    const especialidadesDb = await Especialidad.findAll({ attributes: ['nombre_especialidad'] });
    const tipoEspecialidad = especialidadesDb.map(e => e.nombre_especialidad);

    return res.render('admin/nuevoUsuario', {
      errores,
      errorGeneral,
      tiposUsuario,
      tipoEspecialidad,
      dni,
      nombre,
      apellido,
      telefono,
      email,
      tipo_usuario_id,
      especialidad,
      matricula,
      descripcion
    });
  }

  try {
    // Buscar ID del tipo de usuario
    //const tipo = await TipoUsuario.findOne({ where: { nombre_tipo: rol } });
    const tipo = await TipoUsuario.findByPk(tipo_usuario_id);
    console.log(tipo);
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
    console.log(tipo.nombre_tipo+'---*-*-*-*-'+ especialidad);
    console.log(nuevoUsuario.id_usuario+'*333*3*3*3*3*3*');
    if (tipo.nombre_tipo === 'Medico' )
      {
       
        await UsuarioEspecialidad.create({
          id_usuario: nuevoUsuario.id_usuario,
          id_especialidad: especialidad,
          numeroMatricula: matricula
        });
    }

    // Recargar tipos para render
    const tiposUsuario = await TipoUsuario.findAll();
    const tipoEspecialidad = await Especialidad.findAll();
    const medico = await TipoUsuario.findOne({ where: { nombre_tipo: 'Medico' } });

    return res.render('admin/nuevoUsuario', {
      success: '¡Usuario creado con éxito!',
      preguntarNuevo: true,
      tiposUsuario,
      tipoEspecialidad,
      medico:medico.id,
      errores: {}
    });

  } catch (err) {
    console.error('Error al crear usuario:', err);
    errorGeneral = 'Hubo un error al crear el usuario. Intente nuevamente.';

    const tiposUsuario = await TipoUsuario.findAll();
    const tipoEspecialidad = await Especialidad.findAll();
    const medico = await TipoUsuario.findOne({ where: { nombre_tipo: 'Medico' } });
    return res.render('admin/nuevoUsuario', {
      errorGeneral,
      errores: {},
      tiposUsuario,
      tipoEspecialidad,
      dni,
      nombre,
      apellido,
      telefono,
      email,
      tipo_usuario_id,
      especialidad,
      matricula,
      descripcion,
      medico:medico.id
    });
  }
};


const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['nombre', 'apellido','email','activo','dni'],
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

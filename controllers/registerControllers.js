const SolicitudRegistro = require('../models/SolicitudRegistro');
const Usuario = require('../models/Usuario');

async function solicitud(req,res){
    
    const { nombre, apellido, email, password, rolDeseado } = req.body;

    try {
      // 1. Verifica si el correo ya está registrado como usuario activo
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.render('auth/register', { error: 'Este correo ya está registrado como usuario.' });
      }
  
      // 2. Verifica si ya hay una solicitud con ese email
      const solicitudExistente = await SolicitudRegistro.findOne({ where: { email } });
      if (solicitudExistente) {
        return res.render('auth/register', { error: 'Ya existe una solicitud pendiente con este correo.' });
      }
  
      // 3. Si todo está bien, guardar la solicitud
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await SolicitudRegistro.create({
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rolDeseado
      });
       console.log('Exito');
      //res.render('auth/register', { success: 'Solicitud enviada correctamente. Un administrador la revisará.' });
  
    } catch (err) {
      console.error(err);
      //res.render('auth/register', { error: 'Error al procesar la solicitud. Intente más tarde.' });
    }

}

module.exports ={
    solicitud
}
// Middleware para verificar si el usuario está autenticado
const requireLogin = (req, res, next) => {
    console.log(req.session);
    console.log(req.session.user.nombre);
    
    if (req.session && req.session.user.nombre) {
      // Si hay una sesión activa, continúa
     
      return next();
    }
    // Si no está autenticado, redirige al login o muestra error
    return res.status(401).json({ message: 'Acceso no autorizado. Inicia sesión.' });
  };
  
  module.exports = requireLogin;
  
const requireLogin = (req, res, next) => {
  console.log('Sesión:', req.session);

  if (req.session && req.session.user && req.session.user.nombre) {
    console.log('Usuario autenticado:', req.session.user.nombre);
    return next();
  }

  console.log('Usuario no autenticado');
  
  // Manejo adecuado para solicitudes fetch/AJAX
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(401).json({ message: 'Acceso no autorizado. Inicia sesión.' });
  }

  // En caso de navegaciones normales, redirigir
  return res.redirect('/login');
};

module.exports = requireLogin;

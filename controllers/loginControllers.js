
const fs = require('fs');

async function ingreso(req,res)
{
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.render('auth/login', { error: 'Todos los campos son obligatorios.' });
      }
      const usuarios = JSON.parse(fs.readFileSync('./data/usuarios.json', 'utf-8'));
    const user = usuarios.find(u => u.email === email && u.password === password);
  
    if (!user) 
   {
      return res.render('auth/login', { error: 'Credenciales incorrectas.' });
    }
  
    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      rol: user.rol
    };
    
    switch (user.rol) 
    {
      case 'admin':
      {
        console.log('Admin');
        return res.redirect('/admin/dashboard'); 
      }
      case 'admision': 
      {
        console.log('admision');
        return res.redirect('/admision/dashboard');
      }
    //  case 'enfermeria': return res.redirect('/enfermeria/dashboard');
     // case 'medico': return res.redirect('/medico/dashboard');
      //case 'admision': return res.redirect('/admision/dashboard');
      default: return res.redirect('/');
    }
      
}

function logout(req,res)
{
    req.session.destroy(() => res.redirect('/'));
}
module.exports =
{
    ingreso,
    logout
}    

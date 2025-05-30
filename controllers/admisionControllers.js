const { Paciente } = require('../models');

  const getPacientePorDNI = async (req, res) => {
    const dni = req.query.dni;
    const tipoIngreso = req.query.tipo;
    console.log(tipoIngreso+'**');
    if (!dni) return res.status(400).json({ error: 'DNI no enviado' });
  
    try {
      const paciente = await Paciente.findOne({ where: { dni } });
        if (paciente) 
          {
            res.status(200).json({
              encontrado: true,
              redirectUrl: `/admision/paciente/${paciente.id_paciente}`
            });
            
          
      } else 
      {
        console.log('No Esta');
        res.status(404).json({
          encontrado: false,
          redirectUrl: `/admision/pacienteNuevo?dni=${dni}&tipo=${req.query.tipo}`
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  };






  module.exports = {
    getPacientePorDNI
  };

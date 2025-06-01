const { Paciente , Mutual, Ingreso, PacienteMutual } = require('../models');

  const getPacientePorDNI = async (req, res) => 
  {
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
        
        res.status(404).json({
          encontrado: false,
          redirectUrl: `/admision/pacienteNuevo?dni=${dni}`
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  };


   const getFormularioNuevoPaciente = async (req,res) =>
   {
      try { 
            const mutual = await Mutual.findAll({ 
              attributes: ['id_mutual','nombre_mutual'] 
            });

            const ingreso = await Ingreso.findAll({ 
              attributes: ['id_ingreso','nombre'] 
            });

            res.render('admision/nuevoPaciente', { mutual ,ingreso});
    } catch (err) 
    {
      console.error('Error al cargar ingreso/Mutual:', err);
      
    }
   }

   const cargarPaciente = async (req, res) => {
      try {
        const {
          dni,
          name,
          surname,
          gender,
          dob,
          phone,
          emergencyPhone,
          address,
          nationality,
          bloodType,
          // estos no van a la tabla paciente pero se necesitan después:
          id_ingreso,
          codigoIngreso,
          hospitalOrigen,
          motivoTraslado,
          referringDoctor,
          id_mutual,
          affiliateNumber

        } = req.body;

        console.log(id_mutual+'******')

        // 1. Guardar solo datos del paciente
        const nuevoPaciente = await Paciente.create({
          dni,
          nombre: name,
          apellido: surname,
          genero: gender,
          fecha_nacimiento: dob,
          telefono: phone,
          telefono_emergencia: emergencyPhone,
          domicilio: address,
          nacionalidad: nationality,
          grupo_sanguineo: bloodType
        });

       
        if (id_mutual ) {
          await PacienteMutual.create({
            id_paciente: nuevoPaciente.id_paciente,
            id_mutual,
            numeroAfiliado: affiliateNumber
          });
        }





        // 2. Guardar datos para la siguiente vista en la sesión
        req.session.informacionInternacion = {
          id_paciente: nuevoPaciente.id_paciente,
          id_ingreso,
          codigoIngreso,
          hospitalOrigen,
          motivoTraslado,
          medico_solicitante: referringDoctor
        };

        // 3. Redirigir a la vista que completará la internación
        res.redirect('/admision/continuarInternacion');

      } catch (error) {
        console.error('Error al registrar paciente:', error);
        res.status(500).send('Error al registrar paciente');
      }
    };

   module.exports = {
    getPacientePorDNI,
    getFormularioNuevoPaciente,
    cargarPaciente
  };

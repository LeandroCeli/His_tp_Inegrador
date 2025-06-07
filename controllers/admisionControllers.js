const { Paciente , Mutual, Ingreso, PacienteMutual, Area,Habitacion,Cama,Internacion} = require('../models');

  const getPacientePorDNI = async (req, res) => 
  {
    const dni = req.query.dni;
    
    if (!dni) return res.status(400).json({ error: 'DNI no enviado' });
  
    try {
      const paciente = await Paciente.findOne({ where: { dni } });
        if (paciente) 
          {
            
                     
            req.session.informacionPaciente = 
            {
              id_paciente: paciente.id_paciente,
              paciente: paciente.nombre + ' ' + paciente.apellido,
              edad: calcularEdad(paciente.fecha_nacimiento),
              genero: paciente.genero
            };
           
            res.status(200).json({
              encontrado: true,
              redirectUrl: `/admision/pacienteRegistrado`,
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


  const getDatosIniciales = async (req, res) => {
    try {
      const tiposIngreso = await Ingreso.findAll({ attributes: ['id_ingreso', 'nombre'] });
      const areas = await Area.findAll({ attributes: ['id_area', 'nombre_area'] });
      const info = req.session.informacionPaciente || null;
     
      
     
        res.render('admision/Paciente', {tiposIngreso, informacionPaciente: info ,areas});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cargar datos iniciales' });
    }
  };
  



   const getFormularioNuevoPaciente = async (req,res) =>
   {
      try { 
            const mutual = await Mutual.findAll({ 
              attributes: ['id_mutual','nombre_mutual'] 
            });
          res.render('admision/nuevoPaciente', {mutual});
    } catch (err) 
    {
      console.error('Error al cargar Mutual:', err);
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
          id_mutual,
          affiliateNumber

        } = req.body;

        

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





        const tiposIngreso = await Ingreso.findAll({ attributes: ['id_ingreso', 'nombre'] });
        const areas =await Area.findAll(); // obtengo las Areas Disponibles
        req.session.informacionPaciente = {
          id_paciente: nuevoPaciente.id_paciente,
          genero: gender,
          edad : calcularEdad(dob),
          paciente: nuevoPaciente.nombre + ' ' + nuevoPaciente.apellido,
          tiposIngreso:tiposIngreso,
          areas:areas
           };
 
        
        
        res.redirect('/admision/paciente');

      } catch (error) {
        console.error('Error al registrar paciente:', error);
        res.status(500).send('Error al registrar paciente');
      }
    };

    function calcularEdad(fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
    
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
    
      return edad;
    }

    const HDisponibles = async (req, res) => {
      const { id_area } = req.params;
      const { genero } = req.query;
    
      try {
        const habitaciones = await Habitacion.findAll({
          where: {
            id_area,
            tipo: ['simple', 'doble'],
            estado_habitacion: [1, 2]
          },
          include: {
            model: Cama,
            as: 'Camas',
            required: false 
          }
        });
    
        const resultado = [];
    
        for (const h of habitaciones) {
          const camasDisponibles = h.Camas.filter(c =>
            c.estado.toLowerCase() === 'disponible' && c.higiene.toLowerCase() === 'limpia'
          );
    
          // si no hay camas disponibles limpias, ignorar esta habitación
          if (camasDisponibles.length === 0) continue;
    
          if (h.tipo === 'doble' && h.estado_habitacion === 1) {
            const camasOcupadas = await Cama.findAll({
              where: {
                id_habitacion: h.id_habitacion,
                estado: 'ocupada'
              }
            });
    
            if (camasOcupadas.length > 0) {
              const generoOcupante = camasOcupadas[0].genero_ocupante;
              if (generoOcupante && generoOcupante !== genero) {
                continue;
              }
            }
          }
    
          resultado.push({
            id_habitacion: h.id_habitacion,
            numero_habitacion: h.numero_habitacion,
            tipo: h.tipo,
            camas: camasDisponibles.map(c => ({
              id_cama: c.id_cama,
              estado: c.estado,
              higiene: c.higiene,
              genero_ocupante: c.genero_ocupante
            }))
          });
        }
    
        return res.json(resultado);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al buscar habitaciones' });
      }
    };
    
    const registrarInternacion  = async (req, res) => 
    {
      const { id_paciente, id_cama, fecha_ingreso, medico_solicitante, id_ingreso,genero } = req.body;
      console.log('*******id_paciente:'+id_paciente) ;

      try {
           await Internacion.create({
          id_paciente,
          id_cama,
          fecha_ingreso,
          fecha_alta: null, // aún no hay alta
          medico_solicitante,
          id_ingreso
        });
                       
            const cama = await Cama.findByPk(id_cama);
            if (!cama) {
              return res.status(404).json({ error: 'Cama no encontrada' });
            }

            const habitacion = await Habitacion.findByPk(cama.id_habitacion);
            if (!habitacion) {
              return res.status(404).json({ error: 'Habitación no encontrada' });
            }
            console.log('*****'+ genero);
           
            await cama.update({
              estado: 'ocupada',
              genero_ocupante: genero 
            });

          
            if (habitacion.estado_habitacion > 0) {
              const nuevoEstado = habitacion.estado_habitacion - 1;
              await habitacion.update({
                estado_habitacion: nuevoEstado
              });
            }

               return res.status(201).json({ message: 'Internación registrada con éxito.' });
          } catch (error) {
            console.error('Error al registrar internación:', error);
            return res.status(500).json({ error: 'No se pudo registrar la internación.' });
          }
    
    
    };

    


   module.exports = {
    getPacientePorDNI,
    getFormularioNuevoPaciente,
    cargarPaciente,
    getDatosIniciales,
    HDisponibles,
    registrarInternacion 
  };

const db = require('../models');

const sequelize = db.sequelize;
const Area = db.Area;
const Habitacion = db.Habitacion;
const Cama = db.Cama;
const Mutual = db.Mutual;
const tipoIngreso = db.Ingreso;

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada y tablas recreadas.');

    const mutualesData = [
      { nombre_mutual: 'PAMI' },
      { nombre_mutual: 'OSDE' },
      { nombre_mutual: 'Dosep' },
      { nombre_mutual: 'Swiss Medical' },
      { nombre_mutual: 'Galeno' },
      { nombre_mutual: 'Medife' },
      { nombre_mutual: 'IOMA' },
      { nombre_mutual: 'OMINT' },
      { nombre_mutual: 'No Tiene' }
    ];
    await Mutual.bulkCreate(mutualesData);
    console.log('Mutuales insertadas.');

    const ingrgesoData = [
      { nombre: 'emergencia espontánea' },
      { nombre: 'derivado de Guardia' },
      { nombre: 'cita programada' },
      { nombre: 'traslado desde otro hospital' },
      { nombre: 'Otro' }
      ];
    await tipoIngreso.bulkCreate(ingrgesoData);
    console.log('Ingresos insertadas.');





    const areasToCreate = [
      { nombre_area: 'Emergencia', descripcion: 'Área para atención de emergencias' },
      { nombre_area: 'Medicina General', descripcion: 'Área para pacientes de medicina general' },
      { nombre_area: 'Pediatría', descripcion: 'Área dedicada a la atención de niños' },
      { nombre_area: 'Cirugía', descripcion: 'Área para pacientes post-quirúrgicos' },
      { nombre_area: 'Maternidad', descripcion: 'Área para pacientes de maternidad' }
    ];

    for (const areaData of areasToCreate) {
      const area = await Area.create(areaData);
      console.log(`Área "${area.nombre_area}" creada.`);

      for (let i = 1; i <= 10; i++) {
        const roomType = i <= 5 ? 'simple' : 'doble';
        // estado_habitacion ahora refleja la capacidad de camas: 1 para Individual, 2 para Doble
        const roomCapacity = (roomType === 'simple') ? 1 : 2;
        const numero_habitacion_generado = `${area.nombre_area.substring(0, 3).toUpperCase()}-${i}`;
        
        const habitacion = await Habitacion.create({
          numero_habitacion: numero_habitacion_generado,
          tipo: roomType,
          estado_habitacion: roomCapacity, // Aquí se asigna 1 o 2
          id_area: area.id_area,
        });
        console.log(`  Habitación "${habitacion.numero_habitacion}" (${habitacion.tipo}, Capacidad: ${habitacion.estado_habitacion}) creada para "${area.nombre_area}".`);

        // La creación de camas sigue siendo la misma, ya que representa las unidades individuales de "ocupación"
        if (habitacion.tipo === 'simple') {
          await Cama.create({
            id_habitacion: habitacion.id_habitacion,
            estado: 'Disponible', // Ocupación inicial por cama
            higiene: 'limpia',
            genero_ocupante: null,
          });
          console.log(`    1 Cama Simple creada para ${habitacion.numero_habitacion}.`);
        } else if (habitacion.tipo === 'doble') {
          await Cama.bulkCreate([
            {
              id_habitacion: habitacion.id_habitacion,
              estado: 'Disponible',
              higiene: 'limpia',
              genero_ocupante: null,
            },
            {
              id_habitacion: habitacion.id_habitacion,
              estado: 'Disponible',
              higiene: 'limpia',
              genero_ocupante: null,
            }
          ]);
          console.log(`    2 Camas dobles creadas para ${habitacion.numero_habitacion}.`);
        }
      }
    }

    console.log('Datos de prueba insertados con éxito.');
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
  } finally {
    process.exit();
  }
}

seed();
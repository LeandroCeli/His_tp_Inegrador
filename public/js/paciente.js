document.addEventListener('DOMContentLoaded', function () {
  console.log('EVENTO DOMContentLoaded ejecutado');

  const tipoIngreso = document.getElementById('admission-type');
  const ingresoCampos = document.getElementById('ingreso-campos');
  const datosDiv = document.getElementById('datos-paciente');
  const alaSelect = document.getElementById('hospital-wing');
  const habitacionSelect = document.getElementById('room');
  const camaSelect = document.getElementById('bed');
  const confirmarBtn = document.getElementById('admit-btn');
  const resultadoDiv = document.getElementById('resultado-sugerencia');


  const templates = {
    emergencia: `
      <div>
        <label for="codigo-ingreso" class="block text-sm font-medium text-gray-700">Código de Ingreso</label>
        <input id="codigo-ingreso" name="codigoIngreso" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
      <div class="mt-4">
        <label for="descripcion-emergencia" class="block text-sm font-medium text-gray-700">Motivo de la Emergencia</label>
        <select id="descripcion-emergencia" name="descripcionEmergencia" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="">Seleccione un motivo</option>
          <option value="parto">Parto</option>
          <option value="accidente">Accidente</option>
          <option value="convulsion">Convulsión</option>
          <option value="dolor_pecho">Dolor de pecho</option>
          <option value="otro">Otro</option>
        </select>
      </div>
    `,
    traslado: `
      <div>
        <label for="hospital-origen" class="block text-sm font-medium text-gray-700">Nombre del Hospital</label>
        <input id="hospital-origen" name="hospitalOrigen" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
      <div class="mt-4">
        <label for="motivo-traslado" class="block text-sm font-medium text-gray-700">Motivo del Traslado</label>
        <textarea id="motivo-traslado" name="motivoTraslado" rows="3" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
      </div>
    `,
    programada: `
      <div>
        <label for="tipo-programado" class="block text-sm font-medium text-gray-700">Área o Tipo de Atención Programada</label>
        <select id="tipo-programado" name="tipoProgramado" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="" disabled selected>Seleccione una opción</option>
          <option value="cirugia">Cirugía</option>
          <option value="parto">Parto</option>
          <option value="tratamiento">Tratamiento</option>
          <option value="observacion">Observación</option>
          <option value="otro">Otro</option>
        </select>
      </div>
    `
  };

  const mapTipo = {
    "emergencia espontánea": "emergencia",
    "traslado desde otro hospital": "traslado",
    "cita programada": "programada"
  };

  // Lógica para insertar campos dinámicos
  if (tipoIngreso) {
    tipoIngreso.addEventListener('change', function (e) {
      ingresoCampos.innerHTML = '';
      const textoSeleccionado = e.target.options[e.target.selectedIndex].textContent.toLowerCase().trim();
      const clave = mapTipo[textoSeleccionado];

      if (clave && templates[clave]) {
        ingresoCampos.innerHTML = templates[clave];
      } else {
        console.warn(`Tipo de ingreso no reconocido: "${textoSeleccionado}"`);
      }
      checkFormReady();
    });
  }

  if (alaSelect) {
    alaSelect.addEventListener('change', async function () {
      const idArea = this.value;
      const genero = datosDiv.dataset.genero;

      habitacionSelect.innerHTML = '<option value="">Cargando habitaciones...</option>';
      habitacionSelect.disabled = true;
      camaSelect.innerHTML = '<option value="">Seleccione una habitación primero</option>';
      camaSelect.disabled = true;
      resultadoDiv.textContent = '';

      if (!idArea || !genero) {
        resultadoDiv.textContent = 'Seleccione un área válida con género definido.';
        return;
      }

      try {
        const response = await fetch(`/admision/habitacionesDisponibles/${idArea}?genero=${genero}`);
        const data = await response.json();

        habitacionesCache = data; // Cacheamos las habitaciones

        habitacionSelect.innerHTML = '<option value="">Seleccione una habitación</option>';

        if (data.length === 0) {
          habitacionSelect.innerHTML = '<option value="">No hay habitaciones disponibles</option>';
          return;
        }

        data.forEach(h => {
          const option = document.createElement('option');
          option.value = h.id_habitacion;
          option.textContent = `Hab. ${h.numero_habitacion} (${h.tipo})`;
          habitacionSelect.appendChild(option);
        });

        habitacionSelect.disabled = false;
      } catch (error) {
        console.error('Error al cargar habitaciones:', error);
        habitacionSelect.innerHTML = '<option value="">Error al cargar habitaciones</option>';
        resultadoDiv.textContent = 'Error al cargar habitaciones. Intente nuevamente.';
      }
    });
  }

  // Cargar camas disponibles al seleccionar una habitación (sin segundo fetch)
  if (habitacionSelect) {
    habitacionSelect.addEventListener('change', function () {
      const idHabitacion = parseInt(this.value);
      camaSelect.innerHTML = '<option value="">Cargando camas...</option>';
      camaSelect.disabled = true;
      resultadoDiv.textContent = '';

      if (!idHabitacion) return;

      const habitacion = habitacionesCache.find(h => h.id_habitacion === idHabitacion);

      if (!habitacion || !habitacion.camas || habitacion.camas.length === 0) {
        camaSelect.innerHTML = '<option value="">No hay camas disponibles</option>';
        return;
      }

      camaSelect.innerHTML = '<option value="">Seleccione una cama</option>';
      habitacion.camas.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id_cama;
        option.textContent = `Cama #${c.id_cama} (${c.estado})`;
        camaSelect.appendChild(option);
      });

      camaSelect.disabled = false;
    });
  }

  // Verificación de formulario para activar botón
  function checkFormReady() {
    const medico = document.getElementById('medico-indicador')?.value.trim();
    const ingreso = tipoIngreso?.value;
    const area = alaSelect?.value;
    const habitacion = habitacionSelect?.value;
    const cama = camaSelect?.value;

    const completo = medico && ingreso && area && habitacion && cama;
    if (confirmarBtn) confirmarBtn.disabled = !completo;
  }

  // Escuchar cambios para verificación dinámica
  document.querySelectorAll('#medico-indicador, #admission-type, #hospital-wing, #room, #bed').forEach(el => {
    el?.addEventListener('input', checkFormReady);
    el?.addEventListener('change', checkFormReady);
  });
});

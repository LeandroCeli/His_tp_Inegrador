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

  let habitacionesCache = [];

  const templates = {
    emergencia: `
      <div>
        <label for="codigo-ingreso" class="block text-sm font-medium text-gray-700">Código de Ingreso/Escanear Pulcera</label>
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
        resultadoDiv.style.display = 'block';
        resultadoDiv.style.color = 'red';
        return;
      }

      try {
        const response = await fetch(`/admision/habitacionesDisponibles/${idArea}?genero=${genero}`);
        const data = await response.json();

        habitacionesCache = data;

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
        resultadoDiv.style.display = 'block';
        resultadoDiv.style.color = 'red';
      }
    });
  }

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

  function checkFormReady() {
    const medico = document.getElementById('medico-indicador')?.value.trim();
    const ingreso = tipoIngreso?.value;
    const area = alaSelect?.value;
    const habitacion = habitacionSelect?.value;
    const cama = camaSelect?.value;

    console.log('checkFormReady:', { medico, ingreso, area, habitacion, cama });

    const completo = medico && ingreso && area && habitacion && cama;
    if (confirmarBtn) {
      confirmarBtn.disabled = !completo;
      if (!completo) {
        let mensajeError = 'Por favor, complete: ';
        if (!medico) mensajeError += 'Médico, ';
        if (!ingreso) mensajeError += 'Tipo de ingreso, ';
        if (!area) mensajeError += 'Área, ';
        if (!habitacion) mensajeError += 'Habitación, ';
        if (!cama) mensajeError += 'Cama';
        resultadoDiv.textContent = mensajeError.replace(/, $/, '.');
        resultadoDiv.style.display = 'block';
        resultadoDiv.style.color = 'red';
      } else {
        resultadoDiv.textContent = '';
        resultadoDiv.style.display = 'none';
      }
    }
  }

  document.querySelectorAll('#medico-indicador, #admission-type, #hospital-wing, #room, #bed').forEach(el => {
    el?.addEventListener('input', checkFormReady);
    el?.addEventListener('change', checkFormReady);
  });

  if (confirmarBtn) {
    confirmarBtn.addEventListener('click', async function () {
      const medico = document.getElementById('medico-indicador')?.value.trim();
      const ingreso = tipoIngreso?.value;
      const ingresoNombre = tipoIngreso?.options[tipoIngreso.selectedIndex]?.text;
      const area = alaSelect?.value;
      const AreaNombre = alaSelect?.options[alaSelect.selectedIndex]?.text;
      const habitacionId = habitacionSelect?.value;
      const camaId = camaSelect?.value;

      console.log('Valores al hacer clic en Confirmar:', { medico, ingreso, area, habitacionId, camaId });

      if (!medico || !ingreso || !area || !habitacionId || !camaId) {
        let mensajeError = 'Faltan completar: ';
        if (!medico) mensajeError += 'Médico, ';
        if (!ingreso) mensajeError += 'Tipo de ingreso, ';
        if (!area) mensajeError += 'Área, ';
        if (!habitacionId) mensajeError += 'Habitación, ';
        if (!camaId) mensajeError += 'Cama';
        resultadoDiv.textContent = mensajeError.replace(/, $/, '.');
        resultadoDiv.style.display = 'block';
        resultadoDiv.style.color = 'red';
        console.warn('Faltan datos obligatorios:', { medico, ingreso, area, habitacionId, camaId });
        return;
      }

      const habitacion = habitacionesCache.find(h => h.id_habitacion == habitacionId);
      const cama = habitacion?.camas?.find(c => c.id_cama == camaId);

      const mensaje = `
        <strong>Nombre del paciente:</strong> ${datosDiv.dataset.nombre}<br>
        <strong>Género:</strong> ${datosDiv.dataset.genero}<br>
        <strong>Médico responsable:</strong> ${medico}<br>
        <strong>Tipo de ingreso:</strong> ${ingresoNombre}<br>
        <strong>Área seleccionada:</strong> ${AreaNombre}<br>
        <strong>Habitación:</strong> ${habitacion?.numero_habitacion} (${habitacion?.tipo})<br>
        <strong>Cama:</strong> #${cama?.id_cama} (${cama?.estado})
      `;

      document.getElementById('modal-mensaje').innerHTML = mensaje;
      document.getElementById('modal-confirmacion').classList.remove('hidden');

      document.getElementById('btn-confirmar').onclick = async () => {
        document.getElementById('modal-confirmacion').classList.add('hidden');

        try {
          const response = await fetch('/admision/internarPaciente', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id_paciente: datosDiv.dataset.id_paciente,
              id_cama: camaId,
              fecha_ingreso: new Date().toISOString(),
              medico_solicitante: medico,
              id_ingreso: ingreso,
              genero: datosDiv.dataset.genero
            }),
          });

          const result = await response.json();

          if (response.ok) {
            showModal('✔️ Internación confirmada exitosamente. Redirigiendo...', 'success');
            setTimeout(() => {
              window.location.href = '/admision/dashboard';
            }, 3000);
          } else {
            showModal(`❌ Error: ${result.error || 'No se pudo registrar la internación.'}`, 'error');
          }
        } catch (error) {
          console.error('Error al confirmar internación:', error);
          showModal('❌ Error inesperado al confirmar la internación.', 'error');
        }
      };

      document.getElementById('btn-cancelar').onclick = () => {
        document.getElementById('modal-confirmacion').classList.add('hidden');
      };
    });
  }

  function showModal(message, type) {
    const modal = document.createElement('div');
    modal.className = `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`;
    modal.innerHTML = `
      <div class="bg-white p-6 rounded shadow-md w-96">
        <p class="${type === 'error' ? 'text-red-600' : 'text-green-600'}">${message}</p>
        <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-gray-400 text-white px-4 py-2 rounded">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
});
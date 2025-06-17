document.addEventListener('DOMContentLoaded', () => {
  console.log('EVENTO DOMContentLoaded ejecutado');

  const tipoIngreso = document.getElementById('admission-type');
  const ingresoCampos = document.getElementById('ingreso-campos');
  const datosDiv = document.getElementById('datos-paciente');
  const alaSelect = document.getElementById('hospital-wing');
  const habitacionSelect = document.getElementById('room');
  const camaSelect = document.getElementById('bed');
  const confirmarBtn = document.getElementById('admit-btn');
  const resultadoDiv = document.getElementById('resultado-sugerencia');
  const modal = document.getElementById('modal-confirmacion');
  const btnCancelar = document.getElementById('btn-cancelar');
  const btnConfirmar = document.getElementById('btn-confirmar');
  const modalMensaje = document.getElementById('modal-mensaje');

  let habitacionesCache = [];

  const templates = {
    emergencia: `
      <div>
        <label for="codigo-ingreso" class="block text-sm font-medium text-gray-700">Código de Ingreso/Escanear Pulsera <span class="text-red-500">*</span></label>
        <input id="codigo-ingreso" name="codigoIngreso" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
      </div>
      <div class="mt-4">
        <label for="descripcion-emergencia" class="block text-sm font-medium text-gray-700">Motivo de la Emergencia</label>
        <select id="descripcion-emergencia" name="descripcionEmergencia" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
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
        <label for="hospital-origen" class="block text-sm font-medium text-gray-700">Nombre del Hospital <span class="text-red-500">*</span></label>
        <input id="hospital-origen" name="hospitalOrigen" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
      </div>
      <div class="mt-4">
        <label for="motivo-traslado" class="block text-sm font-medium text-gray-700">Motivo del Traslado <span class="text-red-500">*</span></label>
        <textarea id="motivo-traslado" name="motivoTraslado" rows="3" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"></textarea>
      </div>
    `,
    programada: `
      <div>
        <label for="tipo-programado" class="block text-sm font-medium text-gray-700">Área o Tipo de Atención Programada <span class="text-red-500">*</span></label>
        <select id="tipo-programado" name="tipoProgramado" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
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

  // Tipo de ingreso
  tipoIngreso?.addEventListener('change', (e) => {
    ingresoCampos.innerHTML = '';
    const textoSeleccionado = e.target.options[e.target.selectedIndex].textContent.toLowerCase().trim();
    const clave = mapTipo[textoSeleccionado];
    if (clave && templates[clave]) {
      ingresoCampos.innerHTML = templates[clave];
      // Agregar eventos de validación para los nuevos campos
      const camposAdicionales = ingresoCampos.querySelectorAll('input, select, textarea');
      camposAdicionales.forEach(el => {
        el.addEventListener('input', checkFormReady);
        el.addEventListener('change', checkFormReady);
      });
    } else {
      console.warn(`Tipo de ingreso no reconocido: "${textoSeleccionado}"`);
    }
    checkFormReady();
  });

  // Área → carga habitaciones
  alaSelect?.addEventListener('change', async () => {
    const idArea = alaSelect.value;
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
      const res = await fetch(`/admision/habitacionesDisponibles/${idArea}?genero=${genero}`);
      const data = await res.json();
      habitacionesCache = data;

      habitacionSelect.innerHTML = '<option value="">Seleccione una habitación</option>';
      if (data.length === 0) {
        habitacionSelect.innerHTML = '<option value="">No hay habitaciones disponibles</option>';
        resultadoDiv.textContent = 'No hay habitaciones disponibles para el área seleccionada.';
        resultadoDiv.style.display = 'block';
        resultadoDiv.style.color = 'red';
        return;
      }

      data.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h.id_habitacion;
        opt.textContent = `Hab. ${h.numero_habitacion} (${h.tipo})`;
        habitacionSelect.appendChild(opt);
      });

      habitacionSelect.disabled = false;
      checkFormReady();
    } catch (error) {
      console.error('Error al cargar habitaciones:', error);
      habitacionSelect.innerHTML = '<option value="">Error al cargar habitaciones</option>';
      resultadoDiv.textContent = 'Error al cargar habitaciones. Intente nuevamente.';
      resultadoDiv.style.display = 'block';
      resultadoDiv.style.color = 'red';
    }
  });

  // Habitación → carga camas
  habitacionSelect?.addEventListener('change', () => {
    const idHabitacion = parseInt(habitacionSelect.value);
    camaSelect.innerHTML = '<option value="">Cargando camas...</option>';
    camaSelect.disabled = true;
    resultadoDiv.textContent = '';

    if (!idHabitacion) {
      camaSelect.innerHTML = '<option value="">Seleccione una habitación primero</option>';
      checkFormReady();
      return;
    }

    const habitacion = habitacionesCache.find(h => h.id_habitacion === idHabitacion);

    if (!habitacion?.camas?.length) {
      camaSelect.innerHTML = '<option value="">No hay camas disponibles</option>';
      resultadoDiv.textContent = 'No hay camas disponibles en la habitación seleccionada.';
      resultadoDiv.style.display = 'block';
      resultadoDiv.style.color = 'red';
      return;
    }

    camaSelect.innerHTML = '<option value="">Seleccione una cama</option>';
    habitacion.camas.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id_cama;
      opt.textContent = `Cama #${c.id_cama} (${c.estado})`;
      camaSelect.appendChild(opt);
    });

    camaSelect.disabled = false;
    checkFormReady();
  });

  // Validación del formulario
  function checkFormReady() {
    const medico = document.getElementById('medico-indicador')?.value.trim();
    const ingreso = tipoIngreso?.value;
    const area = alaSelect?.value;
    const habitacion = habitacionSelect?.value;
    const cama = camaSelect?.value;

    // Validar campos adicionales según el tipo de ingreso
    let camposAdicionalesCompletos = true;
    let mensajeError = 'Por favor, complete: ';
    const textoSeleccionado = tipoIngreso?.options[tipoIngreso.selectedIndex]?.textContent.toLowerCase().trim();
    const clave = mapTipo[textoSeleccionado];

    if (clave === 'emergencia') {
      const codigoIngreso = document.getElementById('codigo-ingreso')?.value.trim();
      if (!codigoIngreso) {
        camposAdicionalesCompletos = false;
        mensajeError += 'Código de ingreso, ';
      }
    } else if (clave === 'traslado') {
      const hospitalOrigen = document.getElementById('hospital-origen')?.value.trim();
      const motivoTraslado = document.getElementById('motivo-traslado')?.value.trim();
      if (!hospitalOrigen) {
        camposAdicionalesCompletos = false;
        mensajeError += 'Nombre del hospital, ';
      }
      if (!motivoTraslado) {
        camposAdicionalesCompletos = false;
        mensajeError += 'Motivo del traslado, ';
      }
    } else if (clave === 'programada') {
      const tipoProgramado = document.getElementById('tipo-programado')?.value;
      if (!tipoProgramado) {
        camposAdicionalesCompletos = false;
        mensajeError += 'Área o tipo de atención programada, ';
      }
    }

    // Validar campos principales
    const completo = medico && ingreso && area && habitacion && cama && camposAdicionalesCompletos;

    if (confirmarBtn) {
      confirmarBtn.disabled = !completo;
      if (!completo) {
        if (!medico) mensajeError += 'Médico, ';
        if (!ingreso) mensajeError += 'Tipo de ingreso, ';
        if (!area) mensajeError += 'Área, ';
        if (!habitacion) mensajeError += 'Habitación, ';
        if (!cama) mensajeError += 'Cama, ';
        resultadoDiv.textContent = mensajeError.replace(/, $/, '.');
        resultadoDiv.style.display = 'block';
        resultadoDiv.style.color = 'red';
      } else {
        resultadoDiv.textContent = '';
        resultadoDiv.style.display = 'none';
      }
    }
  }

  // Detecta cambios en campos clave
  document.querySelectorAll('#medico-indicador, #admission-type, #hospital-wing, #room, #bed')
    .forEach(el => {
      el?.addEventListener('input', checkFormReady);
      el?.addEventListener('change', checkFormReady);
    });

  // Abrir modal
  confirmarBtn?.addEventListener('click', () => {
    if (confirmarBtn.disabled) return; // Evitar que se ejecute si el botón está deshabilitado

    const medico = document.getElementById('medico-indicador')?.value.trim();
    const ingreso = tipoIngreso?.value;
    const ingresoNombre = tipoIngreso?.options[tipoIngreso.selectedIndex]?.text;
    const area = alaSelect?.value;
    const areaNombre = alaSelect?.options[alaSelect.selectedIndex]?.text;
    const habitacionId = habitacionSelect?.value;
    const camaId = camaSelect?.value;

    const habitacion = habitacionesCache.find(h => h.id_habitacion == habitacionId);
    const cama = habitacion?.camas?.find(c => c.id_cama == camaId);

    const mensaje = `
      <strong>Nombre del paciente:</strong> ${datosDiv.dataset.nombre}<br>
      <strong>Género:</strong> ${datosDiv.dataset.genero}<br>
      <strong>Médico responsable:</strong> ${medico}<br>
      <strong>Tipo de ingreso:</strong> ${ingresoNombre}<br>
      <strong>Área seleccionada:</strong> ${areaNombre}<br>
      <strong>Habitación:</strong> ${habitacion?.numero_habitacion} (${habitacion?.tipo})<br>
      <strong>Cama:</strong> #${cama?.id_cama} (${cama?.estado})
    `;
    modalMensaje.innerHTML = mensaje;
    modal.classList.remove('hidden');
  });

  // Cancelar → cerrar modal
  btnCancelar?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Confirmar → internar paciente
  btnConfirmar?.addEventListener('click', async () => {
    modal.classList.add('hidden');

    const medico = document.getElementById('medico-indicador')?.value.trim();
    const ingreso = tipoIngreso?.value;
    const camaId = camaSelect?.value;

    try {
      const response = await fetch('/admision/internarPaciente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Error en confirmación:', error);
      showModal('❌ Error inesperado al intentar internar al paciente.', 'error');
    }
  });

  // Modal feedback reutilizable
  function showModal(message, type) {
    const feedbackModal = document.getElementById('modal-feedback');
    const feedbackMensaje = document.getElementById('modal-feedback-mensaje');
    feedbackMensaje.innerHTML = message;
    feedbackModal.classList.remove('hidden');
    feedbackModal.classList.toggle('bg-green-100', type === 'success');
    feedbackModal.classList.toggle('bg-red-100', type === 'error');
  }

  // Validar formulario al cargar la página
  checkFormReady();
});
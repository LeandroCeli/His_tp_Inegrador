document.addEventListener('DOMContentLoaded', () => {
  const tipoIngreso = document.getElementById('admission-type');
  const ingresoCampos = document.getElementById('ingreso-campos');

  const templates = {
    emergencia: `
      <div>
        <label for="codigo-ingreso" class="block text-sm font-medium text-gray-700">Código de Ingreso</label>
        <input id="codigo-ingreso" name="ccodigoIngreso" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
    `,
    traslado: `
      <div>
        <label for="hospital-origen" class="block text-sm font-medium text-gray-700">Nombre del Hospital</label>
        <input id="hospital-origen" name="hospitalOrigen" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
      <div>
        <label for="motivo-traslado" class="block text-sm font-medium text-gray-700">Motivo del Traslado</label>
        <textarea id="motivo-traslado" name="motivoTraslado" rows="3" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
      </div>
    `
  };

  const mapTipo = {
    "emergencia espontánea": "emergencia",
    "traslado desde otro hospital": "traslado"
  };

  tipoIngreso.addEventListener('change', e => {
    ingresoCampos.innerHTML = '';
    const texto = e.target.options[e.target.selectedIndex].textContent.toLowerCase();
    const clave = mapTipo[texto];
    if (clave && templates[clave]) {
      ingresoCampos.innerHTML = templates[clave];
    }
  });

  const params = new URLSearchParams(window.location.search);
  const dni = params.get('dni');
  if (dni) {
    const dniInput = document.getElementById('dni');
    if (dniInput) {
      dniInput.value = dni;
    }
  }

  // NUEVO: Lógica para el campo Número de Afiliado
  const insuranceSelect = document.getElementById('insurance');
  const affiliateInput = document.getElementById('affiliate-number');

  if (insuranceSelect && affiliateInput) {
    insuranceSelect.addEventListener('change', () => {
      const selectedText = insuranceSelect.options[insuranceSelect.selectedIndex].textContent.trim().toLowerCase();

      if (selectedText === 'no tiene') {
        affiliateInput.value = '00000000';
        affiliateInput.readOnly = true;
      } else {
        affiliateInput.value = '';
        affiliateInput.readOnly = false;
      }
    });
  }

});

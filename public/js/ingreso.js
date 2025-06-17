document.addEventListener('DOMContentLoaded', () => {
  const fechaNacimientoInput = document.getElementById('dob');
  const dniInput = document.getElementById('dni');
  const phoneInput = document.getElementById('phone');
  const emergencyPhoneInput = document.getElementById('emergency-phone');
  const bloodTypeSelect = document.getElementById('blood-type');
  const form = document.getElementById('patient-form');

  // Calcular edad
  function calcularEdad(fechaNacimientoStr) {
    if (!fechaNacimientoStr) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimientoStr);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  // Validaciones antes de enviar
  form.addEventListener('submit', (e) => {
    const errores = [];

    // Validar fecha de nacimiento
    const fechaNac = fechaNacimientoInput.value;
    const edad = calcularEdad(fechaNac);
    if (!fechaNac) {
      errores.push("Debe ingresar una fecha de nacimiento.");
    } else if (new Date(fechaNac) > new Date()) {
      errores.push("La fecha de nacimiento no puede ser futura.");
    } else if (edad < 0 || edad > 120) {
      errores.push("La edad debe estar entre 0 y 120 años.");
    }

    // Validar DNI
    const dniValor = dniInput.value.trim();
    if (!/^\d{7,9}$/.test(dniValor)) {
      errores.push("El DNI debe ser numérico y tener entre 7 y 9 dígitos.");
    }

    // Validar teléfonos
    const telRegex = /^[0-9+\s()-]{7,15}$/;
    if (!telRegex.test(phoneInput.value.trim())) {
      errores.push("El teléfono ingresado no es válido.");
    }
    if (!telRegex.test(emergencyPhoneInput.value.trim())) {
      errores.push("El teléfono de emergencia no es válido.");
    }

    // Validar grupo sanguíneo
    if (!bloodTypeSelect.value) {
      errores.push("Debe seleccionar un grupo sanguíneo.");
    }

    if (errores.length > 0) {
      e.preventDefault();
      alert("⚠️ Corrige los siguientes errores:\n\n" + errores.join("\n"));
    }
  });

  // Autocompletar DNI desde URL
  const params = new URLSearchParams(window.location.search);
  const dni = params.get('dni');
  if (dni && dniInput) {
    dniInput.value = dni;
  }

  // Mutual y afiliado
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

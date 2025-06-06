document.addEventListener('DOMContentLoaded', () => {
 
  const fechaNacimientoInput = document.getElementById('dob');
  
 
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

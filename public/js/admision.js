document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('admission-modal');
    const openBtn = document.getElementById('new-admission-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('admission-form');
    const dynamicFields = document.getElementById('dynamic-fields');
  
    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
      });
    }
  
    if (cancelBtn && modal && form) {
      cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        form.reset();
        if (dynamicFields) dynamicFields.innerHTML = '';
      });
    }
  
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dni = document.getElementById('dni').value.trim();
        
        try {
          const response = await fetch(`/admision/paciente/buscar?dni=${dni}`);
          const data = await response.json();
         
          if (data.encontrado) {
            if (data.yaInternado) 
            {
              alert(data.mensaje);
            } else 
            {
              window.location.href = data.redirectUrl;
            }
          } else {
            if (response.status === 404) {
              window.location.href = data.redirectUrl;
            } else {
              throw new Error('Error al consultar el paciente');
            }
          }
        } catch (error) {
          console.error(error);
          alert(`Error: ${error.message}`);
        }
  
        modal.classList.add('hidden');
        form.reset();
        if (dynamicFields) dynamicFields.innerHTML = '';
      });
    }
  });
  
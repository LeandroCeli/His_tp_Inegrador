document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEmergencia');
    const codigoInput = document.getElementById('codigoEmergencia');
    const mensajeConfirmacion = document.getElementById('mensajeConfirmacion');
    const codigoGenerado = document.getElementById('codigoGenerado');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const genero = document.getElementById('genero').value;
      const tipo = document.getElementById('tipo_emergencia').value;
  
      try {
        const res = await fetch('/admision/emergencia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ genero, tipo_emergencia: tipo })
        });
  
        const data = await res.json();
  
        if (res.ok) {
          codigoInput.value = data.codigo;
          codigoGenerado.textContent = data.codigo;
          mensajeConfirmacion.style.display = 'block';
          setTimeout(() => {
            document.getElementById('mensajeConfirmacion').style.display = 'none';
            document.getElementById('formEmergencia').reset();
            document.getElementById('codigoEmergencia').value = '';
            document.getElementById('codigoGenerado').textContent = '';
          }, 4000);



        } else {
          alert('❌ Error al registrar la emergencia.');
        }
      } catch (error) {
        console.error(error);
        alert('❌ Ocurrió un error al enviar los datos.');
      }
    });
  });
  
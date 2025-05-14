document.addEventListener('DOMContentLoaded', function() {
  const menu = document.getElementById('menu');
  const contenido = document.getElementById('contenido');

  // Cargar contenido dinámico desde el select
  menu.addEventListener('change', function() {
    const opcion = menu.value;
    if (opcion !== 'default') {
      cargarContenido(opcion);
    }
  });

  document.addEventListener('click', function(e) {
  if (e.target.classList.contains('cargar-en-dinamico')) {
    e.preventDefault();

    // ✅ Toma href o data-url, lo que esté presente
    const url = e.target.getAttribute('data-url') || e.target.getAttribute('href');
    
    if (url) {
      cargarContenido(url);
    } else {
      console.warn('⚠️ No se encontró URL en el enlace.');
    }
  }
});


  // Función para cargar contenido dinámico
  function cargarContenido(url) {
    contenido.innerHTML = `<h3 class='text-xl font-semibold'>Cargando...</h3>`;
    fetch(url)
      .then(response => response.text())
      .then(data => {
        contenido.innerHTML = data;
      })
      .catch(error => {
        console.error("Error al cargar el contenido: ", error);
        contenido.innerHTML = `<p class='text-red-600'>Error al cargar el contenido.</p>`;
      });
  }
});

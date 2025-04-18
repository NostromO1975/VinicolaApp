console.log("VinicolaApp cargada!");
// Aquí añadiremos funciones después
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar campo de calificación
    const radioButtons = document.querySelectorAll('input[name="estado-lote"]');
    const calificacionContainer = document.getElementById('calificacion-container');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'exitosa' || this.value === 'deficiente') {
                calificacionContainer.style.display = 'block';
            } else {
                calificacionContainer.style.display = 'none';
            }
        });
    });
    
    // Validación básica del formulario
    const formInputs = document.querySelectorAll('input[required], select[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'red';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    });
});
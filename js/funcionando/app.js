// DATOS DE FRUTAS Y AZÚCARES
const frutasDB = [
    { nombre: "naranja", azucar: 8.3, ratioAgua: "3:1" },
    { nombre: "uva", azucar: 16.1, ratioAgua: "2:1" },
    // ... (agrega todas las frutas)
];

const azucaresDB = [
    { nombre: "panela", azucar: 85 },
    { nombre: "miel", azucar: 82 },
    // ... (agrega todas las fuentes de azúcar)
];

document.addEventListener('DOMContentLoaded', function() {
    // 1. Manejo de formulario del productor
    const productoSelect = document.getElementById('producto');
    productoSelect.addEventListener('change', function() {
        const otroContainer = document.getElementById('otro-producto-container');
        if (this.value === 'otro') {
            otroContainer.classList.remove('hidden');
        } else {
            otroContainer.classList.add('hidden');
        }
    });

    const radioButtons = document.querySelectorAll('input[name="estado-lote"]');
    const calificacionContainer = document.getElementById('calificacion-container');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'exitosa' || this.value === 'deficiente') {
                calificacionContainer.classList.remove('hidden');
            } else {
                calificacionContainer.classList.add('hidden');
            }
        });
    });

    // 2. Inicializar selectores de ingredientes
    initIngredientSelectors();

    // 3. Cambio de unidades métrico/imperial
    document.getElementById('sistema-unidades').addEventListener('change', function() {
        const isMetrico = this.value === 'metrico';
        document.getElementById('volumen-unidad').textContent = isMetrico ? 'litros' : 'galones';
        // Aquí iría la conversión de unidades si fuera necesario
    });
});

function initIngredientSelectors() {
    const frutasContainer = document.getElementById('frutas-container');
    const azucaresContainer = document.getElementById('azucares-container');

    // Crear 4 selectores para frutas y azúcares
    for (let i = 0; i < 4; i++) {
        frutasContainer.appendChild(createIngredientRow('fruta', i, frutasDB));
        azucaresContainer.appendChild(createIngredientRow('azucar', i, azucaresDB));
    }
}

function createIngredientRow(tipo, index, database) {
    const div = document.createElement('div');
    div.className = 'ingredient-row';
    div.innerHTML = `
        <select id="${tipo}-${index}">
            <option value="">-- Seleccione --</option>
            ${database.map(item => `
                <option value="${item.nombre}" data-azucar="${item.azucar}">
                    ${item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}
                </option>
            `).join('')}
            <option value="otro">Otro</option>
        </select>
        <input type="number" placeholder="Cantidad" min="0" step="0.1" 
               oninput="calcularTotales()">
        <input type="number" placeholder="Costo ($)" min="0" step="0.01">
    `;
    return div;
}

function calcularTotales() {
    let azucaresTotales = 0;
    
    // Sumar azúcares de todos los ingredientes
    document.querySelectorAll('[id^="fruta-"], [id^="azucar-"]').forEach(select => {
        if (select.value && select.selectedOptions[0].dataset.azucar) {
            const cantidad = parseFloat(select.nextElementSibling.value) || 0;
            azucaresTotales += (parseFloat(select.selectedOptions[0].dataset.azucar) * cantidad) / 100;
        }
    });

    // Calcular alcohol potencial (17g/L ≈ 1% ABV)
    const volumen = parseFloat(document.getElementById('volumen').value) || 1;
    const alcoholPotencial = (azucaresTotales / volumen / 17).toFixed(1);

    // Actualizar UI
    document.getElementById('azucares-totales').textContent = azucaresTotales.toFixed(1);
    document.getElementById('alcohol-potencial').textContent = alcoholPotencial;
}
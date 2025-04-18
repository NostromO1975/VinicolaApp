// ==================== BASE DE DATOS COMPLETA ====================
const frutasDB = [
    { nombre: "naranja", azucar: 8.3, ratioAgua: "3:1" },
    { nombre: "mandarina", azucar: 9.4, ratioAgua: "3:1" },
    { nombre: "manzana", azucar: 10.4, ratioAgua: "4:1" },
    { nombre: "uva", azucar: 16.1, ratioAgua: "2:1" },
    { nombre: "guayaba", azucar: 8.9, ratioAgua: "3:1" },
    { nombre: "corozo morado", azucar: 12.5, ratioAgua: "2:1" },
    { nombre: "corozo amarillo", azucar: 11.8, ratioAgua: "2:1" },
    { nombre: "golupa", azucar: 7.2, ratioAgua: "3:1" },
    { nombre: "maracuyá", azucar: 11.2, ratioAgua: "3:1" },
    { nombre: "mora", azucar: 9.8, ratioAgua: "3:1" },
    { nombre: "mango", azucar: 14.8, ratioAgua: "3:1" },
    { nombre: "mucílago de cacao", azucar: 5.3, ratioAgua: "5:1" },
    { nombre: "lulo", azucar: 8.1, ratioAgua: "3:1" },
    { nombre: "ciruela", azucar: 10.2, ratioAgua: "3:1" },
    { nombre: "durazno", azucar: 9.5, ratioAgua: "3:1" },
    { nombre: "uchuva", azucar: 7.6, ratioAgua: "4:1" },
    { nombre: "granadilla", azucar: 11.3, ratioAgua: "3:1" }
];

const azucaresDB = [
    { nombre: "panela", azucar: 85 },
    { nombre: "miel", azucar: 82 },
    { nombre: "azúcar blanca", azucar: 100 },
    { nombre: "azúcar morena", azucar: 97 },
    { nombre: "arroz cocido", azucar: 28 },
    { nombre: "maíz cocido", azucar: 21 },
    { nombre: "corozo morado cocido", azucar: 35 },
    { nombre: "corozo amarillo cocido", azucar: 32 }
];

// ==================== FUNCIONES PRINCIPALES ====================
document.addEventListener('DOMContentLoaded', function() {
    // 1. Configuración del formulario del productor
    configurarFormularioProductor();
    
    // 2. Inicializar selectores de ingredientes
    initIngredientSelectors();
    
    // 3. Configurar eventos para cálculos
    configurarEventosCalculos();
});

function configurarFormularioProductor() {
    // Manejo de campo "Otro" en tipo de producto
    const productoSelect = document.getElementById('producto');
    productoSelect.addEventListener('change', function() {
        const otroContainer = document.getElementById('otro-producto-container');
        otroContainer.classList.toggle('hidden', this.value !== 'otro');
    });

    // Manejo de estado del lote y calificación
    document.querySelectorAll('input[name="estado-lote"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const mostrarCalificacion = this.value === 'exitosa' || this.value === 'deficiente';
            document.getElementById('calificacion-container').classList.toggle('hidden', !mostrarCalificacion);
        });
    });
}

function initIngredientSelectors() {
    const frutasContainer = document.getElementById('frutas-container');
    const azucaresContainer = document.getElementById('azucares-container');

    // Crear 4 selectores para frutas
    for (let i = 0; i < 4; i++) {
        frutasContainer.appendChild(createIngredientSelector('fruta', i, frutasDB));
    }

    // Crear 4 selectores para fuentes de azúcar
    for (let i = 0; i < 4; i++) {
        azucaresContainer.appendChild(createIngredientSelector('azucar', i, azucaresDB));
    }
}

function createIngredientSelector(tipo, index, database) {
    const div = document.createElement('div');
    div.className = 'ingredient-row';
    div.innerHTML = `
        <select id="${tipo}-${index}" onchange="handleIngredientChange(this)">
            <option value="">-- Seleccione --</option>
            ${database.map(item => `
                <option value="${item.nombre}" 
                        data-azucar="${item.azucar}" 
                        ${item.ratioAgua ? `data-ratio="${item.ratioAgua}"` : ''}>
                    ${capitalizeFirstLetter(item.nombre)} (${item.azucar}g/100g)
                </option>
            `).join('')}
            <option value="otro">Otro (especificar)</option>
        </select>
        <div id="${tipo}-${index}-otro-container" class="hidden">
            <input type="text" placeholder="Nombre del ingrediente">
            <input type="number" placeholder="Azúcar (g/100g)" step="0.1" min="0">
        </div>
        <input type="number" placeholder="Cantidad (g)" min="0" step="1" oninput="calcularTotales()">
        <input type="number" placeholder="Costo ($)" min="0" step="0.01">
    `;
    return div;
}

function configurarEventosCalculos() {
    // Cambio de unidades métrico/imperial
    document.getElementById('sistema-unidades').addEventListener('change', function() {
        const isMetrico = this.value === 'metrico';
        document.getElementById('volumen-unidad').textContent = isMetrico ? 'litros' : 'galones';
        // Aquí puedes agregar conversión de unidades si es necesario
    });

    // Evento para cambios en el volumen
    document.getElementById('volumen').addEventListener('input', calcularTotales);
}

function handleIngredientChange(select) {
    const otroContainer = document.getElementById(`${select.id}-otro-container`);
    otroContainer.classList.toggle('hidden', select.value !== 'otro');
    
    // Actualizar ratio agua/fruta si es una fruta
    if (select.id.startsWith('fruta-') && select.value && select.selectedOptions[0].dataset.ratio) {
        document.getElementById('ratio-agua').textContent = select.selectedOptions[0].dataset.ratio;
    }
    
    calcularTotales();
}

function calcularTotales() {
    let azucaresTotales = 0;
    let costoTotales = 0;
    
    // Sumar azúcares y costos de todos los ingredientes
    document.querySelectorAll('[id^="fruta-"], [id^="azucar-"]').forEach(select => {
        if (!select.value) return;
        
        const cantidad = parseFloat(select.nextElementSibling.nextElementSibling.value) || 0;
        const costo = parseFloat(select.nextElementSibling.nextElementSibling.nextElementSibling.value) || 0;
        let azucar;
        
        if (select.value === 'otro') {
            const azucarInput = select.nextElementSibling.querySelector('input[type="number"]');
            azucar = parseFloat(azucarInput.value) || 0;
        } else {
            azucar = parseFloat(select.selectedOptions[0].dataset.azucar);
        }
        
        azucaresTotales += (azucar * cantidad) / 100;
        costoTotales += costo;
    });

    // Calcular alcohol potencial (17g/L ≈ 1% ABV)
    const volumen = parseFloat(document.getElementById('volumen').value) || 1;
    const alcoholPotencial = (azucaresTotales / volumen / 17).toFixed(1);

    // Actualizar UI
    document.getElementById('azucares-totales').textContent = azucaresTotales.toFixed(1);
    document.getElementById('alcohol-potencial').textContent = alcoholPotencial;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
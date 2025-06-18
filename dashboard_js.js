// Lógica del Dashboard Principal

// Inicializar dashboard
function initializeDashboard() {
    console.log('Inicializando dashboard...');
    
    // Verificar estado del perfil y mostrar alertas
    mostrarAlertasPerfilIncompleto();
    
    // Cargar datos de consumo si el perfil está completo
    if (perfilCompleto) {
        cargarDatosConsumo();
        cargarProximoVencimiento();
    }
    
    // Configurar botones de contacto
    configurarBotonesContacto();
}

// Mostrar alertas si el perfil está incompleto
function mostrarAlertasPerfilIncompleto() {
    const alertaContainer = document.getElementById('alertaPerfilIncompleto');
    const seccionesAcceso = document.getElementById('seccionesAcceso');
    
    if (!perfilCompleto && alertaContainer) {
        alertaContainer.style.display = 'block';
        
        // Agregar clase disabled a las cards de facturas y reclamos
        const cardFacturas = document.getElementById('cardFacturas');
        const cardReclamos = document.getElementById('cardReclamos');
        
        if (cardFacturas) {
            cardFacturas.classList.add('disabled-section');
            cardFacturas.title = 'Completa tu perfil para acceder a las facturas';
        }
        
        if (cardReclamos) {
            cardReclamos.classList.add('disabled-section');
            cardReclamos.title = 'Completa tu perfil para acceder a los reclamos';
        }
        
        // Configurar botón de completar perfil
        const btnCompletarPerfil = document.querySelector('.btn-pulse');
        if (btnCompletarPerfil) {
            btnCompletarPerfil.addEventListener('click', () => showSection('perfil'));
        }
    } else if (alertaContainer) {
        alertaContainer.style.display = 'none';
    }
}

// Cargar datos de consumo
function cargarDatosConsumo() {
    const tablaConsumos = document.getElementById('tablaConsumos');
    if (!tablaConsumos) return;
    
    if (!currentUser || !perfilCompleto) {
        tablaConsumos.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4 text-muted">
                    <i class="bi bi-lock me-2"></i>
                    Completa tu perfil para ver el historial de consumos
                </td>
            </tr>
        `;
        return;
    }
    
    // Simular carga de datos (aquí conectarías con la base de datos real)
    setTimeout(() => {
        const consumosEjemplo = [
            { periodo: 'Enero 2025', consumo: 15, monto: '$12,500' },
            { periodo: 'Diciembre 2024', consumo: 18, monto: '$14,200' },
            { periodo: 'Noviembre 2024', consumo: 12, monto: '$10,800' }
        ];
        
        tablaConsumos.innerHTML = consumosEjemplo.map(item => `
            <tr>
                <td><i class="bi bi-calendar3 me-1"></i>${item.periodo}</td>
                <td><i class="bi bi-droplet me-1"></i>${item.consumo} m³</td>
                <td><i class="bi bi-cash me-1"></i>${item.monto}</td>
            </tr>
        `).join('');
    }, 1000);
}

// Cargar próximo vencimiento
function cargarProximoVencimiento() {
    const proximoVencimiento = document.getElementById('proximoVencimiento');
    if (!proximoVencimiento) return;
    
    if (!perfilCompleto) {
        proximoVencimiento.innerHTML = `
            <div class="text-center text-muted">
                <i class="bi bi-lock me-2"></i>
                Completa tu perfil para ver vencimientos
            </div>
        `;
        return;
    }
    
    // Simular carga de próximo vencimiento
    setTimeout(() => {
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 15);
        
        proximoVencimiento.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>Febrero 2025</strong><br>
                    <small class="text-muted">Vence: ${fechaVencimiento.toLocaleDateString('es-AR')}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-success">$13,200</span>
                </div>
            </div>
        `;
    }, 800);
}

// Configurar botones de contacto
function configurarBotonesContacto() {
    // Los enlaces ya están configurados en el HTML
    // Aquí puedes agregar tracking o funcionalidad adicional
    console.log('Botones de contacto configurados');
}

// Función para mostrar errores en el dashboard
function mostrarErrorDashboard(mensaje) {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        const alertaError = document.createElement('div');
        alertaError.className = 'alert alert-danger alert-dismissible fade show';
        alertaError.innerHTML = `
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        mainContent.insertBefore(alertaError, mainContent.firstChild);
    }
}

// Funciones de compatibilidad con el código anterior
function mostrarSeccion(seccion) {
    showSection(seccion);
}

function irAInicio() {
    showSection('dashboard');
}
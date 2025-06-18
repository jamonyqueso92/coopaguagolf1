// Sistema de Navegación

// Función principal para mostrar secciones
async function showSection(sectionName) {
    console.log('Navegando a sección:', sectionName);
    
    // Verificar permisos para secciones protegidas
    if ((sectionName === 'facturas' || sectionName === 'reclamos') && !perfilCompleto) {
        showSection('perfil');
        return;
    }
    
    // Actualizar navegación activa
    updateActiveNavigation(sectionName);
    
    // Cargar contenido de la sección
    await loadSectionContent(sectionName);
}

// Actualizar navegación activa
function updateActiveNavigation(activeSectionName) {
    // Remover clase active de todos los enlaces
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase active al enlace correspondiente
    const sectionMap = {
        'dashboard': 0,
        'facturas': 1, 
        'reclamos': 2,
        'perfil': 3
    };
    
    const activeIndex = sectionMap[activeSectionName];
    if (activeIndex !== undefined) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        if (navLinks[activeIndex]) {
            navLinks[activeIndex].classList.add('active');
        }
    }
}

// Cargar contenido de la sección
async function loadSectionContent(sectionName) {
    const mainContent = document.getElementById('mainContent');
    
    try {
        // Mostrar loading
        mainContent.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
        `;
        
        let content = '';
        
        switch(sectionName) {
            case 'dashboard':
                content = await loadDashboardContent();
                break;
            case 'facturas':
                content = await loadFacturasContent();
                break;
            case 'reclamos':
                content = await loadReclamosContent();
                break;
            case 'perfil':
                content = await loadPerfilContent();
                break;
            default:
                content = await loadDashboardContent();
        }
        
        mainContent.innerHTML = content;
        
        // Inicializar funcionalidad específica de la sección
        initializeSectionFunctionality(sectionName);
        
    } catch (error) {
        console.error('Error al cargar sección:', error);
        mainContent.innerHTML = `
            <div class="container my-4">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Error al cargar la sección. Por favor, intenta nuevamente.
                </div>
            </div>
        `;
    }
}

// Cargar contenido del dashboard
async function loadDashboardContent() {
    const response = await fetch('sections/dashboard.html');
    if (!response.ok) throw new Error('Error al cargar dashboard');
    return await response.text();
}

// Cargar contenido de facturas
async function loadFacturasContent() {
    const response = await fetch('sections/facturas.html');
    if (!response.ok) throw new Error('Error al cargar facturas');
    return await response.text();
}

// Cargar contenido de reclamos
async function loadReclamosContent() {
    const response = await fetch('sections/reclamos.html');
    if (!response.ok) throw new Error('Error al cargar reclamos');
    return await response.text();
}

// Cargar contenido de perfil
async function loadPerfilContent() {
    const response = await fetch('sections/perfil.html');
    if (!response.ok) throw new Error('Error al cargar perfil');
    return await response.text();
}

// Inicializar funcionalidad específica de cada sección
function initializeSectionFunctionality(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            if (typeof initializeDashboard === 'function') {
                initializeDashboard();
            }
            break;
        case 'facturas':
            if (typeof initializeFacturas === 'function') {
                initializeFacturas();
            }
            break;
        case 'reclamos':
            if (typeof initializeReclamos === 'function') {
                initializeReclamos();
            }
            break;
        case 'perfil':
            if (typeof initializePerfil === 'function') {
                initializePerfil();
            }
            break;
    }
}

// Función de compatibilidad con el código anterior
function mostrarSeccion(seccion) {
    showSection(seccion);
}

function irAInicio() {
    showSection('dashboard');
}
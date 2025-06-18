// navigation.js - Sistema de navegación entre secciones

class Navigation {
    static currentSection = 'dashboard';

    // Mostrar sección específica
    static mostrarSeccion(seccion) {
        console.log('Navegando a sección:', seccion);
        
        // Verificar si la sección requiere perfil completo
        if ((seccion === 'facturas' || seccion === 'reclamos') && !perfilCompleto) {
            alert('Debes completar tu perfil antes de acceder a esta sección.');
            return;
        }

        // Actualizar navegación activa
        this.actualizarNavegacionActiva(seccion);
        
        // Cargar contenido de la sección
        this.cargarContenidoSeccion(seccion);
        
        this.currentSection = seccion;
    }

    // Actualizar navegación activa
    static actualizarNavegacionActiva(seccion) {
        // Remover clase active de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Agregar clase active al enlace correspondiente
        const seccionMap = {
            'dashboard': document.querySelector('a[onclick*="dashboard"]'),
            'facturas': document.querySelector('a[onclick*="facturas"]'),
            'reclamos': document.querySelector('a[onclick*="reclamos"]'),
            'perfil': document.querySelector('a[onclick*="perfil"]')
        };

        if (seccionMap[seccion]) {
            seccionMap[seccion].classList.add('active');
        }
    }

    // Cargar contenido de la sección
    static async cargarContenidoSeccion(seccion) {
        const contenedor = document.getElementById('contenidoSecciones');
        
        try {
            let contenido = '';
            
            switch (seccion) {
                case 'dashboard':
                    contenido = dashboardMain.renderDashboard();
                    break;
                case 'perfil':
                    contenido = await PerfilManager.renderPerfil();
                    break;
                case 'facturas':
                    contenido = FacturasManager.renderFacturas();
                    break;
                case 'reclamos':
                    contenido = ReclamosManager.renderReclamos();
                    break;
                default:
                    contenido = dashboardMain.renderDashboard();
            }

            contenedor.innerHTML = contenido;
            
            // Ejecutar funciones post-render específicas de cada sección
            this.ejecutarPostRender(seccion);
            
        } catch (error) {
            console.error('Error al cargar sección:', error);
            contenedor.innerHTML = `
                <div class="container my-4">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Error al cargar la sección. Por favor, intenta nuevamente.
                    </div>
                </div>
            `;
        }
    }

    // Ejecutar funciones específicas después del render
    static ejecutarPostRender(seccion) {
        switch (seccion) {
            case 'dashboard':
                // Actualizar interfaz según perfil
                setTimeout(() => {
                    dashboardMain.actualizarInterfazSegunPerfil();
                    if (perfilCompleto) {
                        dashboardMain.cargarDatosFacturacion();
                    }
                }, 100);
                break;
            case 'perfil':
                PerfilManager.inicializarFormulario();
                break;
            case 'facturas':
                if (perfilCompleto) {
                    FacturasManager.cargarFacturas();
                }
                break;
            case 'reclamos':
                if (perfilCompleto) {
                    ReclamosManager.cargarReclamos();
                }
                break;
        }
    }
}

// Función global para compatibilidad
function mostrarSeccion(seccion) {
    Navigation.mostrarSeccion(seccion);
}
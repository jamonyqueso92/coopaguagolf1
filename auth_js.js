// Sistema de Autenticación

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard iniciando...');
    verificarAutenticacion();
});

// Verificar estado de autenticación
function verificarAutenticacion() {
    auth.onAuthStateChanged(function(user) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        if (user) {
            console.log('Usuario autenticado:', user.uid);
            currentUser = user;
            mostrarDashboard();
            cargarPerfilUsuario(user.uid);
            loadingOverlay.style.display = 'none';
        } else {
            console.log('Usuario no autenticado, redirigiendo...');
            mostrarMensajeNoAutenticado();
            loadingOverlay.style.display = 'none';
        }
    });
}

// Mostrar dashboard para usuario autenticado
function mostrarDashboard() {
    document.body.style.display = 'block';
    
    // Mostrar nombre del usuario
    const displayName = currentUser.displayName || currentUser.email || 'Usuario';
    document.getElementById('userDisplayName').textContent = displayName;
    
    // Configurar cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
    
    // Mostrar sección dashboard por defecto
    showSection('dashboard');
}

// Mostrar mensaje para usuario no autenticado
function mostrarMensajeNoAutenticado() {
    document.body.innerHTML = `
        <div class="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div class="text-center">
                <div class="alert alert-warning p-4">
                    <i class="bi bi-exclamation-triangle display-4 text-warning mb-3"></i>
                    <h3>Acceso Restringido</h3>
                    <p class="mb-3">Necesitas iniciar sesión para acceder al dashboard.</p>
                    <a href="index.html" class="btn btn-primary">
                        <i class="bi bi-arrow-left me-1"></i>Volver al Inicio
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Cerrar sesión
function cerrarSesion() {
    auth.signOut().then(() => {
        console.log('Sesión cerrada');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
}

// Cargar perfil del usuario
function cargarPerfilUsuario(userId) {
    console.log('Cargando perfil del usuario:', userId);
    
    db.collection('usuarios').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                userProfile = doc.data();
                console.log('Perfil encontrado:', userProfile);
                verificarCompletitudPerfil();
                if (perfilCompleto) {
                    habilitarTodasLasSecciones();
                }
            } else {
                console.log('No se encontró perfil del usuario');
                crearPerfilInicial(userId);
            }
        })
        .catch((error) => {
            console.error('Error al cargar perfil:', error);
            mostrarError('Error al cargar datos del perfil');
        });
}

// Crear perfil inicial
function crearPerfilInicial(userId) {
    const perfilInicial = {
        email: currentUser.email,
        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
        perfilCompleto: false
    };

    db.collection('usuarios').doc(userId).set(perfilInicial)
        .then(() => {
            console.log('Perfil inicial creado');
            userProfile = perfilInicial;
            verificarCompletitudPerfil();
        })
        .catch((error) => {
            console.error('Error al crear perfil inicial:', error);
        });
}

// Verificar si el perfil está completo
function verificarCompletitudPerfil() {
    if (!userProfile) {
        perfilCompleto = false;
        return;
    }

    // Campos requeridos para considerar el perfil completo
    const camposRequeridos = [
        'nombre', 'dni', 'numeroSuministro', 'numeroMedidor', 
        'direccionSuministro', 'titularSuministro', 'categoriaServicio'
    ];

    perfilCompleto = camposRequeridos.every(campo => 
        userProfile[campo] && userProfile[campo].trim() !== ''
    );

    console.log('Perfil completo:', perfilCompleto);
    actualizarInterfazSegunPerfil();
}

// Actualizar interfaz según estado del perfil
function actualizarInterfazSegunPerfil() {
    const navFacturas = document.getElementById('navFacturas');
    const navReclamos = document.getElementById('navReclamos');

    if (!perfilCompleto) {
        // Deshabilitar navegación
        navFacturas.classList.add('disabled');
        navReclamos.classList.add('disabled');
        navFacturas.title = 'Completa tu perfil para acceder a las facturas';
        navReclamos.title = 'Completa tu perfil para acceder a los reclamos';
    } else {
        // Habilitar navegación
        navFacturas.classList.remove('disabled');
        navReclamos.classList.remove('disabled');
        navFacturas.removeAttribute('title');
        navReclamos.removeAttribute('title');
    }
}

// Habilitar todas las secciones
function habilitarTodasLasSecciones() {
    console.log('Habilitando todas las secciones para perfil completo');
}

// Mostrar error
function mostrarError(mensaje) {
    console.error(mensaje);
    // Implementar sistema de notificaciones si es necesario
}
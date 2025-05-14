// auth-check.js - Script común para verificación de autenticación
// Este archivo debe ser incluido en todas las páginas protegidas

// Referencias a elementos DOM comunes
const loadingScreen = document.getElementById('loading-screen');
const userDisplayName = document.getElementById('userDisplayName');
const logoutBtn = document.getElementById('logoutBtn');

// Evento personalizado para notificar que el usuario está autenticado
const userAuthenticatedEvent = new CustomEvent('userAuthenticated', {
    detail: { userId: null }
});

// IMPORTANTE: Verificación estricta de autenticación antes de mostrar el contenido
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        // No hay usuario autenticado, redirigir al login
        console.log("No hay usuario autenticado. Redirigiendo al login...");
        window.location.href = 'login-con-firebase.html';
        return;
    }
    
    if (!user.emailVerified) {
        // El email del usuario no está verificado
        console.log("Email no verificado. Redirigiendo al login...");
        firebase.auth().signOut().then(() => {
            window.location.href = 'login-con-firebase.html?error=email_not_verified';
        });
        return;
    }
    
    console.log("Usuario autenticado y verificado:", user.email);
    
    // Usuario autenticado y verificado, mostrar contenido
    if (userDisplayName) {
        userDisplayName.textContent = user.email;
    }
    
    // Actualizar detalle del evento con el ID del usuario
    userAuthenticatedEvent.detail.userId = user.uid;
    
    // Mostrar contenido y ocultar pantalla de carga
    document.body.style.display = 'block';
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Disparar evento de usuario autenticado
    document.dispatchEvent(userAuthenticatedEvent);
});

// Configurar el botón de cerrar sesión
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut()
            .then(() => {
                window.location.href = '../index.html';
            })
            .catch((error) => {
                console.error('Error al cerrar sesión:', error);
            });
    });
}
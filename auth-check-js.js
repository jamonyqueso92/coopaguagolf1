// auth-check.js - Script común para verificación de autenticación
// Este archivo debe ser incluido en todas las páginas protegidas

// Ejecutar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('auth-check.js cargado correctamente');
    
    // Referencias a elementos DOM comunes
    const loadingScreen = document.getElementById('loading-screen');
    const userDisplayName = document.getElementById('userDisplayName');
    const logoutBtn = document.getElementById('logoutBtn');

    // Evento personalizado para notificar que el usuario está autenticado
    const userAuthenticatedEvent = new CustomEvent('userAuthenticated', {
        detail: { userId: null }
    });

    // Recuperar datos de localStorage por si la verificación de Firebase falla
    const storedUser = localStorage.getItem('firebaseAuthUser');
    let localUserData = null;
    
    if (storedUser) {
        try {
            localUserData = JSON.parse(storedUser);
            console.log('Datos de usuario recuperados de localStorage:', localUserData.email);
        } catch (e) {
            console.error('Error al parsear datos de usuario de localStorage');
        }
    }

    // IMPORTANTE: Verificación estricta de autenticación antes de mostrar el contenido
    firebase.auth().onAuthStateChanged((user) => {
        console.log('Estado de autenticación verificado:', user ? 'Autenticado' : 'No autenticado');
        
        if (!user) {
            // Intentar recuperar el token del localStorage
            const authToken = localStorage.getItem('firebaseAuthToken');
            
            if (authToken && localUserData) {
                console.log('Token encontrado en localStorage. Intentando autenticar...');
                // Intentar autenticar con token y datos locales
                firebase.auth().signInWithCustomToken(authToken).catch(error => {
                    console.error('Error al autenticar con token:', error);
                    redirectToLogin();
                });
                return;
            } else {
                console.log("No hay token o usuario en localStorage. Redirigiendo al login...");
                redirectToLogin();
                return;
            }
        }
        
        if (!user.emailVerified) {
            // El email del usuario no está verificado
            console.log("Email no verificado. Redirigiendo al login...");
            firebase.auth().signOut().then(() => {
                redirectToLogin('email_not_verified');
            });
            return;
        }
        
        console.log("Usuario autenticado y verificado:", user.email);
        
        // Usuario autenticado y verificado, mostrar contenido
        if (userDisplayName) {
            userDisplayName.textContent = user.email;
        }
        
        // Refrescar token
        user.getIdToken(true).then(token => {
            localStorage.setItem('firebaseAuthToken', token);
            localStorage.setItem('firebaseAuthUser', JSON.stringify({
                email: user.email,
                uid: user.uid,
                displayName: user.displayName || ''
            }));
            
            // Actualizar detalle del evento con el ID del usuario
            userAuthenticatedEvent.detail.userId = user.uid;
            
            // Mostrar contenido y ocultar pantalla de carga
            document.body.style.display = 'block';
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            // Disparar evento de usuario autenticado
            document.dispatchEvent(userAuthenticatedEvent);
            console.log('Evento userAuthenticated enviado con ID:', user.uid);
        }).catch(error => {
            console.error('Error al obtener token:', error);
            redirectToLogin();
        });
    });

    // Función para redirigir al login
    function redirectToLogin(error = '') {
        // Limpiar localStorage
        localStorage.removeItem('firebaseAuthToken');
        localStorage.removeItem('firebaseAuthUser');
        
        // Redirigir
        const errorParam = error ? `?error=${error}` : '';
        window.location.href = 'login-con-firebase.html' + errorParam;
    }

    // Configurar el botón de cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Cerrando sesión...');
            firebase.auth().signOut()
                .then(() => {
                    localStorage.removeItem('firebaseAuthToken');
                    localStorage.removeItem('firebaseAuthUser');
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    console.error('Error al cerrar sesión:', error);
                    alert('Error al cerrar sesión. Intente nuevamente.');
                });
        });
    }
});
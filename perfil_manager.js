// perfil-manager.js - Gestor de perfiles de usuario
class PerfilManager {
    // Cargar perfil del usuario
    static cargarPerfil(userId) {
        console.log('Cargando perfil del usuario:', userId);
        
        db.collection('usuarios').doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    userProfile = doc.data();
                    console.log('Perfil encontrado:', userProfile);
                    this.verificarCompletitudPerfil();
                    if (Navigation.currentSection === 'dashboard') {
                        dashboardMain.actualizarInterfazSegunPerfil();
                    }
                } else {
                    console.log('No se encontró perfil del usuario');
                    this.crearPerfilInicial(userId);
                }
            })
            .catch((error) => {
                console.error('Error al cargar perfil:', error);
                this.mostrarError('Error al cargar datos del perfil');
            });
    }

    // Crear perfil inicial
    static crearPerfilInicial(userId) {
        const perfilInicial = {
            email: currentUser.email,
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
            perfilCompleto: false,
            nombre: '',
            dni: '',
            numeroSuministro: '',
            numeroMedidor: '',
            direccionSuministro: '',
            titularSuministro: '',
            categoriaServicio: ''
        };
        
        db.collection('usuarios').doc(userId).set(perfilInicial)
            .then(() => {
                console.log('Perfil inicial creado');
                userProfile = perfilInicial;
                this.verificarCompletitudPerfil();
            })
            .catch((error) => {
                console.error('Error al crear perfil inicial:', error);
                this.mostrarError('Error al crear perfil inicial');
            });
    }

    // Verificar si el perfil está completo
    static verificarCompletitudPerfil() {
        if (!userProfile) {
            perfilCompleto = false;
            return;
        }

        const camposRequeridos = [
            'nombre', 'dni', 'numeroSuministro', 'numeroMedidor', 
            'direccionSuministro', 'titularSuministro', 'categoriaServicio'
        ];

        perfilCompleto = camposRequeridos.every(campo => 
            userProfile[campo] && userProfile[campo].toString().trim() !== ''
        );

        // Actualizar el estado en la base de datos si es necesario
        if (userProfile.perfilCompleto !== perfilCompleto) {
            this.actualizarEstadoCompletitud(perfilCompleto);
        }

        console.log('Perfil completo:', perfilCompleto);
        return perfilCompleto;
    }

    // Actualizar datos del perfil
    static actualizarPerfil(userId, datos) {
        return new Promise((resolve, reject) => {
            // Validar datos antes de actualizar
            const datosValidados = this.validarDatos(datos);
            if (!datosValidados.valido) {
                reject(datosValidados.errores);
                return;
            }

            db.collection('usuarios').doc(userId).update(datos)
                .then(() => {
                    console.log('Perfil actualizado exitosamente');
                    // Actualizar perfil local
                    Object.assign(userProfile, datos);
                    this.verificarCompletitudPerfil();
                    resolve();
                })
                .catch((error) => {
                    console.error('Error al actualizar perfil:', error);
                    this.mostrarError('Error al actualizar el perfil');
                    reject(error);
                });
        });
    }

    // Validar datos del perfil
    static validarDatos(datos) {
        const errores = [];

        // Validar DNI (formato argentino)
        if (datos.dni && !/^\d{7,8}$/.test(datos.dni)) {
            errores.push('El DNI debe tener 7 u 8 dígitos');
        }

        // Validar número de suministro
        if (datos.numeroSuministro && !/^\d+$/.test(datos.numeroSuministro)) {
            errores.push('El número de suministro debe contener solo números');
        }

        // Validar número de medidor
        if (datos.numeroMedidor && datos.numeroMedidor.length < 5) {
            errores.push('El número de medidor debe tener al menos 5 caracteres');
        }

        // Validar nombre
        if (datos.nombre && datos.nombre.trim().length < 2) {
            errores.push('El nombre debe tener al menos 2 caracteres');
        }

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    // Actualizar estado de completitud en la base de datos
    static actualizarEstadoCompletitud(completo) {
        if (currentUser) {
            db.collection('usuarios').doc(currentUser.uid).update({
                perfilCompleto: completo,
                fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            })
            .catch((error) => {
                console.error('Error al actualizar estado de completitud:', error);
            });
        }
    }

    // Obtener datos específicos del perfil
    static obtenerDatoPerfil(campo) {
        return userProfile && userProfile[campo] ? userProfile[campo] : null;
    }

    // Verificar si el usuario puede acceder a ciertas funcionalidades
    static puedeAccederA(funcionalidad) {
        switch (funcionalidad) {
            case 'facturas':
                return perfilCompleto && this.obtenerDatoPerfil('numeroSuministro');
            case 'reportes':
                return perfilCompleto;
            case 'pagos':
                return perfilCompleto && this.obtenerDatoPerfil('numeroSuministro');
            default:
                return perfilCompleto;
        }
    }

    // Mostrar errores al usuario
    static mostrarError(mensaje) {
        // Implementar según el sistema de notificaciones de la aplicación
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, 'error');
        } else {
            console.error(mensaje);
            alert(mensaje); // Fallback básico
        }
    }

    // Mostrar éxito al usuario
    static mostrarExito(mensaje) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, 'success');
        } else {
            console.log(mensaje);
        }
    }

    // Exportar datos del perfil (para respaldos o transferencias)
    static exportarPerfil() {
        if (!userProfile) {
            this.mostrarError('No hay perfil para exportar');
            return null;
        }

        const datosExportacion = {
            ...userProfile,
            fechaExportacion: new Date().toISOString()
        };

        // Remover datos sensibles si es necesario
        delete datosExportacion.email;
        
        return datosExportacion;
    }

    // Limpiar datos del perfil (para logout)
    static limpiarPerfil() {
        userProfile = null;
        perfilCompleto = false;
        console.log('Datos del perfil limpiados');
    }
}
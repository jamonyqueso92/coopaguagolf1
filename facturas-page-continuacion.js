// Aplicar filtro por año si es necesario
                if (anio !== 'todos') {
                    // Fecha inicio y fin del año seleccionado
                    const fechaInicio = new Date(`${anio}-01-01`);
                    const fechaFin = new Date(`${anio}-12-31`);
                    
                    query = query.where('fechaEmision', '>=', fechaInicio)
                              .where('fechaEmision', '<=', fechaFin);
                }
                
                query.orderBy('fechaEmision', 'desc')
                    .get()
                    .then((querySnapshot) => {
                        if (querySnapshot.empty) {
                            tablaFacturas.innerHTML = '';
                            sinFacturas.classList.remove('d-none');
                            return;
                        }
                        
                        sinFacturas.classList.add('d-none');
                        tablaFacturas.innerHTML = '';
                        
                        querySnapshot.forEach((doc) => {
                            const factura = doc.data();
                            const fechaEmision = new Date(factura.fechaEmision.seconds * 1000).toLocaleDateString();
                            const fechaVencimiento = new Date(factura.fechaVencimiento.seconds * 1000).toLocaleDateString();
                            
                            const fila = document.createElement('tr');
                            
                            // Estado y clase CSS según el estado
                            let estadoTexto = factura.estado;
                            let estadoClase = '';
                            let accionesHTML = '';
                            
                            switch(factura.estado) {
                                case 'pendiente':
                                    estadoTexto = 'Pendiente';
                                    estadoClase = 'text-danger';
                                    accionesHTML = `
                                        <button class="btn btn-success btn-sm" onclick="pagarFactura('${doc.id}')">Pagar</button>
                                        <button class="btn btn-info btn-sm" onclick="verDetalle('${doc.id}')">Ver</button>
                                    `;
                                    break;
                                case 'pagado':
                                    estadoTexto = 'Pagado';
                                    estadoClase = 'text-success';
                                    accionesHTML = `
                                        <button class="btn btn-info btn-sm" onclick="verDetalle('${doc.id}')">Ver</button>
                                    `;
                                    break;
                                case 'vencido':
                                    estadoTexto = 'Vencido';
                                    estadoClase = 'text-warning';
                                    accionesHTML = `
                                        <button class="btn btn-danger btn-sm" onclick="pagarFactura('${doc.id}')">Pagar con Recargo</button>
                                        <button class="btn btn-info btn-sm" onclick="verDetalle('${doc.id}')">Ver</button>
                                    `;
                                    break;
                            }
                            
                            fila.innerHTML = `
                                <td>${factura.numero}</td>
                                <td>${factura.periodo}</td>
                                <td>${fechaEmision}</td>
                                <td>${fechaVencimiento}</td>
                                <td>$${factura.monto.toLocaleString('es-AR')}</td>
                                <td class="${estadoClase}">${estadoTexto}</td>
                                <td>${accionesHTML}</td>
                            `;
                            
                            tablaFacturas.appendChild(fila);
                        });
                    })
                    .catch((error) => {
                        console.error('Error al cargar facturas:', error);
                        tablaFacturas.innerHTML = `
                            <tr>
                                <td colspan="7" class="text-center text-danger">
                                    Error al cargar las facturas. Intente nuevamente.
                                </td>
                            </tr>
                        `;
                    });
            }
            
            // Ver detalle de factura
            function verDetalle(facturaId) {
                const detalleFacturaBody = document.getElementById('detalleFacturaBody');
                
                // Mostrar modal
                const detalleModal = new bootstrap.Modal(document.getElementById('detalleFacturaModal'));
                detalleModal.show();
                
                // Cargar datos de la factura
                db.collection('facturas').doc(facturaId).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const factura = doc.data();
                            const fechaEmision = new Date(factura.fechaEmision.seconds * 1000).toLocaleDateString();
                            const fechaVencimiento = new Date(factura.fechaVencimiento.seconds * 1000).toLocaleDateString();
                            
                            detalleFacturaBody.innerHTML = `
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <h5>Datos de la Factura</h5>
                                        <p><strong>Número:</strong> ${factura.numero}</p>
                                        <p><strong>Período:</strong> ${factura.periodo}</p>
                                        <p><strong>Emisión:</strong> ${fechaEmision}</p>
                                        <p><strong>Vencimiento:</strong> ${fechaVencimiento}</p>
                                        <p><strong>Estado:</strong> ${factura.estado}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <h5>Detalle de Consumo</h5>
                                        <p><strong>Consumo:</strong> ${factura.consumo} m³</p>
                                        <p><strong>Cargo Fijo:</strong> $${factura.cargoFijo.toLocaleString('es-AR')}</p>
                                        <p><strong>Cargo Variable:</strong> $${factura.cargoVariable.toLocaleString('es-AR')}</p>
                                        <p><strong>Otros Cargos:</strong> $${factura.otrosCargos.toLocaleString('es-AR')}</p>
                                        <p><strong>Total:</strong> $${factura.monto.toLocaleString('es-AR')}</p>
                                    </div>
                                </div>
                            `;
                        } else {
                            detalleFacturaBody.innerHTML = `
                                <div class="alert alert-danger">
                                    No se encontró la factura solicitada.
                                </div>
                            `;
                        }
                    })
                    .catch((error) => {
                        console.error('Error al obtener detalles de la factura:', error);
                        detalleFacturaBody.innerHTML = `
                            <div class="alert alert-danger">
                                Error al cargar los detalles. Intente nuevamente.
                            </div>
                        `;
                    });
            }
            
            // Pagar factura
            function pagarFactura(facturaId) {
                // Aquí se implementaría la redirección al sistema de pagos
                // Por ahora, solo simulamos un pago exitoso después de 2 segundos
                alert('Redirigiendo al sistema de pagos...');
                
                // En una implementación real, esto sería manejado por un webhook del sistema de pagos
                setTimeout(() => {
                    db.collection('facturas').doc(facturaId).update({
                        estado: 'pagado',
                        fechaPago: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        alert('Pago procesado correctamente');
                        // Recargar facturas
                        const anioSeleccionado = document.getElementById('filtroAnio').value;
                        cargarFacturas(anioSeleccionado);
                    })
                    .catch((error) => {
                        console.error('Error al procesar el pago:', error);
                        alert('Error al procesar el pago. Intente nuevamente.');
                    });
                }, 2000);
            }
            
            // Exponer funciones al ámbito global para los onclick
            window.verDetalle = verDetalle;
            window.pagarFactura = pagarFactura;
        }
    </script>
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <!-- Bootstrap JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
</body>
</html>

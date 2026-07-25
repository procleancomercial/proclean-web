// ========================================
// SERVICIO DEL DÍA (DATOS DE PRUEBA)
// ========================================

const servicioHoy = {

    id: "000154",

    estado: "Confirmado",

    cliente: "María Gómez",

    telefono: "3001234567",

    servicio: "Limpieza General del Hogar",

    direccion: "Cra 45 #23-18, Envigado",

    horaInicio: "08:00 AM",

    horaFin: "04:00 PM",

    duracion: "8 horas",

    observaciones: [

        "Llevar aspiradora",

        "Hay una mascota pequeña",

        "Tocar el timbre principal"

    ]

};

console.log(servicioHoy);
// ========================================
// CARGAR INFORMACIÓN EN LA PÁGINA
// ========================================

document.getElementById("clienteServicio").textContent = servicioHoy.cliente;

document.getElementById("tipoServicio").textContent = servicioHoy.servicio;

document.getElementById("horarioServicio").textContent =
`${servicioHoy.horaInicio} - ${servicioHoy.horaFin}`;

document.getElementById("duracionServicio").textContent =
servicioHoy.duracion;

document.getElementById("direccionServicio").textContent =
servicioHoy.direccion;

document.getElementById("telefonoCliente").textContent =
servicioHoy.telefono;

// ========================================
// OBSERVACIONES
// ========================================

const lista = document.getElementById("listaObservaciones");

servicioHoy.observaciones.forEach(observacion => {

    const li = document.createElement("li");

    li.textContent = observacion;

    lista.appendChild(li);

});

// ========================================
// INICIAR JORNADA
// ========================================

const boton = document.getElementById("btnJornada");

const estado = document.getElementById("estadoServicio");

boton.addEventListener("click", iniciarJornada);

function iniciarJornada(){

    estado.textContent = "🟡 En servicio";

    boton.textContent = "Finalizar Servicio";

}
// ========================================
// ACTUALIZAR INTERFAZ
// ========================================

function actualizarVistaServicio(){

    const estado = document.getElementById("estadoServicio");

    const boton = document.getElementById("btnJornada");

    if(servicioHoy.estado === "Confirmado"){

        estado.textContent = "🟢 Confirmado";

        boton.textContent = "Iniciar Jornada";

    }

    else if(servicioHoy.estado === "En servicio"){

        estado.textContent = "🟡 En servicio";

        boton.textContent = "Finalizar Servicio";

    }

    else if(servicioHoy.estado === "Finalizado"){

        estado.textContent = "✅ Finalizado";

        boton.textContent = "Servicio Finalizado";

        boton.disabled = true;

    }

}
// ========================================
// BOTÓN
// ========================================

document
.getElementById("btnJornada")
.addEventListener("click", cambiarEstado);

function cambiarEstado(){

    if(servicioHoy.estado === "Confirmado"){

        servicioHoy.estado = "En servicio";

    }

    else if(servicioHoy.estado === "En servicio"){

        servicioHoy.estado = "Finalizado";

    }

    actualizarVistaServicio();

}

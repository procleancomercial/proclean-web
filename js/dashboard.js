// ========================================
// CUANDO CARGA EL DASHBOARD
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    mostrarFecha();

    mostrarSaludo();
lucide.createIcons();
});

// ========================================
// FECHA ACTUAL
// ========================================

function mostrarFecha() {

    const fecha = document.getElementById("fechaActual");

    if (!fecha) return;

    const hoy = new Date();

    const opciones = {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    };

    fecha.textContent =
        hoy.toLocaleDateString("es-CO", opciones);

}

// ========================================
// SALUDO SEGÚN LA HORA
// ========================================

function mostrarSaludo() {

    const saludo = document.getElementById("saludo");

    if (!saludo) return;

    const hora = new Date().getHours();

    if (hora < 12) {

        saludo.textContent = "Buenos días";

    } else if (hora < 18) {

        saludo.textContent = "Buenas tardes";

    } else {

        saludo.textContent = "Buenas noches";

    }

}

// actualizarVistaServicio();

function openServiceModal(){

    document.getElementById("serviceModal").style.display="flex";

    lucide.createIcons();

}

function closeServiceModal(){

    document.getElementById("serviceModal").style.display="none";

}

window.onclick = function(event){

    const modal = document.getElementById("serviceModal");

    if(event.target === modal){

        modal.style.display = "none";

    }

}



/*======================================
INICIAR SERVICIO
======================================*/

function startService() {

    console.log("startService ejecutado");

    // 1. Actualizar la tarjeta principal de afuera
    const status = document.getElementById("serviceStatus");
    status.textContent = "En servicio";
    status.classList.remove("status-pending");
    status.classList.add("status-active");

    // 2. Actualizar el estado dentro del modal (¡Nuevo!)
    const modalStatus = document.getElementById("modalServiceStatus");
    if (modalStatus) {
        modalStatus.textContent = "En servicio";
        modalStatus.classList.remove("status-pending");
        modalStatus.classList.add("status-active");
    }

    // Ocultar y mostrar botones correspondientes
    document.getElementById("startServiceBtn").style.display = "none";
    document.getElementById("serviceInProgress").style.display = "block";

    lucide.createIcons();
}


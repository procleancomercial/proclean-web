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

/*======================================
RUTA DEL SERVICIO
======================================*/

// Obtiene la dirección del servicio. Cuando se integre la base de datos,
// esta función debe devolver la dirección que llegue desde el backend.
// Por ahora lee el atributo data-direccion del elemento #direccionServicio,
// que es donde se poblará la dirección de forma dinámica.
function obtenerDireccionServicio() {

    const el = document.getElementById("direccionServicio");

    const direccion = el ? (el.getAttribute("data-direccion") || el.textContent.trim()) : "";

    // Mantiene sincronizada la dirección que se muestra dentro del modal
    const modalDireccion = document.getElementById("modalDireccionServicio");

    if (modalDireccion) {

        modalDireccion.textContent = direccion;

    }

    return direccion;

}

// Abre la ruta del servicio en Google Maps según la dirección real.
function openRoute() {

    const direccion = obtenerDireccionServicio();

    if (!direccion) {

        alert("No se encontró la dirección del servicio.");

        return;

    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;

    window.open(url, "_blank");

}

/*======================================
MODAL EVIDENCIAS
======================================*/

function openEvidenceModal(){

    document.getElementById("evidenceModal").style.display = "flex";

    lucide.createIcons();

}

function closeEvidenceModal(){

    document.getElementById("evidenceModal").style.display = "none";

}

function saveEvidence(){

    closeEvidenceModal();

    openCloseServiceModal();

}
/*======================================
SELECCIÓN EXPERIENCIA
======================================*/

function selectExperience(card){

    document
        .querySelectorAll(".experience-card")
        .forEach(item => {

            item.classList.remove("active");

        });

    card.classList.add("active");

}

/*======================================
VISTA PREVIA DE IMÁGENES
======================================*/



function previewImage(input, previewId, contentId){

    if(input.files && input.files[0]){

        const reader = new FileReader();

        reader.onload = function(e){

            document.getElementById(previewId).src = e.target.result;

            document.getElementById(previewId).style.display = "block";

            document.getElementById(contentId).style.display = "none";

            const actionsId = previewId === "beforePreview"
                ? "beforeActions"
                : "afterActions";

            document.getElementById(actionsId).style.display = "flex";

            lucide.createIcons();

        };

        reader.readAsDataURL(input.files[0]);

    }

}
function removeImage(inputId, previewId, contentId, actionsId){

    document.getElementById(inputId).value = "";

    document.getElementById(previewId).src = "";

    document.getElementById(previewId).style.display = "none";

    document.getElementById(contentId).style.display = "block";

    document.getElementById(actionsId).style.display = "none";

}

/*======================================
MODAL CIERRE DEL SERVICIO
======================================*/

function openCloseServiceModal(){

    document.getElementById("closeServiceModal").style.display="flex";

    lucide.createIcons();

}

function closeCloseServiceModal(){

    document.getElementById("closeServiceModal").style.display="none";

}

/*======================================
LLEGADA AL SERVICIO
======================================*/

function selectArrival(card){

    document
        .querySelectorAll(".arrival-card")
        .forEach(item => {

            item.classList.remove("active");

        });

    card.classList.add("active");

}

/*======================================
GUARDAR LLEGADA
======================================*/

function saveArrival(){

    closeArrivalModal();

    openSuccessModal();

}

/*======================================
MODAL LLEGADA AL SERVICIO
======================================*/

function openArrivalModal(){

    document.getElementById("arrivalModal").style.display = "flex";

    lucide.createIcons();

}

function closeArrivalModal(){

    document.getElementById("arrivalModal").style.display = "none";

}

/*======================================
FINALIZAR SERVICIO
======================================*/

function saveCloseService(){

    closeCloseServiceModal();

    openArrivalModal();

}


/*======================================
MODAL ÉXITO
======================================*/

function openSuccessModal(){

    document.getElementById("successModal").style.display = "flex";

    lucide.createIcons();

}

function closeSuccessModal(){

    document.getElementById("successModal").style.display = "none";

}

function goDashboard(){

    // Cerrar todos los modales
    closeSuccessModal();
    closeArrivalModal();
    closeCloseServiceModal();
    closeEvidenceModal();
    closeServiceModal();

    // Reiniciar el portal
    resetServiceFlow();

}

/*======================================
REINICIAR FLUJO DEL SERVICIO
======================================*/

function resetServiceFlow(){

    // Estado del servicio
    const status = document.getElementById("serviceStatus");

    if(status){

        status.textContent = "Pendiente";

        status.classList.remove("status-active");

        status.classList.add("status-pending");

    }

    // Estado del modal
    const modalStatus = document.getElementById("modalServiceStatus");

    if(modalStatus){

        modalStatus.textContent = "Pendiente";

        modalStatus.classList.remove("status-active");

        modalStatus.classList.add("status-pending");

    }

    // Botón principal
    const startBtn = document.getElementById("startServiceBtn");

    if(startBtn){

        startBtn.innerHTML = `
            <span>Iniciar servicio</span>
            <i data-lucide="play"></i>
        `;

    }

    // Limpiar textarea
    document.querySelectorAll("textarea").forEach(textarea=>{

        textarea.value="";

    });

    // Quitar selección de experiencia
    document.querySelectorAll(".experience-card").forEach(card=>{

        card.classList.remove("active");

    });

    // Quitar selección de llegada
    document.querySelectorAll(".arrival-card").forEach(card=>{

        card.classList.remove("active");

    });

    // Desmarcar radios
    document.querySelectorAll("input[type='radio']").forEach(radio=>{

        radio.checked=false;

    });

    // Restaurar iconos
    lucide.createIcons();

}

const voiceMessage = document.getElementById("voiceMessage");
const voiceCount = document.getElementById("voiceCount");

voiceMessage.addEventListener("input", () => {

    voiceCount.textContent = voiceMessage.value.length;

});  

function openVoiceModal(){

    const modal = document.getElementById("voiceModal");

    modal.classList.remove("hidden");

    modal.style.opacity = "1";
    modal.style.visibility = "visible";

}


function closeVoiceModal(){

    const modal = document.getElementById("voiceModal");

    modal.style.opacity = "0";
    modal.style.visibility = "hidden";

    modal.classList.add("hidden");

}

function sendVoice(){

    const type = document.getElementById("voiceType").value;
    const message = document.getElementById("voiceMessage").value.trim();

    if(type === ""){
        alert("Selecciona el tipo de comentario");
        return;
    }

    if(message === ""){
        alert("Escribe tu comentario");
        return;
    }

    showVoiceSuccess();

}

function showVoiceSuccess(){

    closeVoiceModal();

    document.getElementById("voiceSuccessModal")
    .style.display="flex";

}


function closeVoiceSuccess(){

    document.getElementById("voiceSuccessModal")
    .style.display="none";

}


// ======================================
//     ACTUALIZAR PERFIL DEL ESPECIALISTA
// ======================================

function cargarPerfilEspecialista(datos) {
    // 1. Actualizar Nombre
    if (datos.nombre) {
        document.getElementById('nombreEspecialista').textContent = datos.nombre;
    }

    // 2. Actualizar Foto (si tiene URL de imagen)
    const imgElement = document.getElementById('fotoEspecialista');
    const iconElement = document.getElementById('iconoDefecto');
    
    if (datos.fotoUrl) {
        imgElement.src = datos.fotoUrl;
        imgElement.style.display = 'block'; // Muestra la foto
        iconElement.style.display = 'none'; // Oculta el icono por defecto
    }

    // 3. Actualizar Estado (En línea / Ocupado / Desconectado)
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');

    if (datos.estado === 'en-linea') {
        statusText.textContent = 'En línea';
        statusDot.style.backgroundColor = '#10b981'; // Verde
    } else if (datos.estado === 'ocupado') {
        statusText.textContent = 'Ocupado';
        statusDot.style.backgroundColor = '#f59e0b'; // Amarillo
    } else {
        statusText.textContent = 'Desconectado';
        statusDot.style.backgroundColor = '#ef4444'; // Rojo
    }
}

// Ejemplo de cómo lo llamarías al iniciar sesión o cargar los datos:
// cargarPerfilEspecialista({
//     nombre: "Angie Marín",
//     fotoUrl: "https://lh3.googleusercontent.com/d/TU_ID_DE_FOTO",
//     estado: "en-linea"
// });





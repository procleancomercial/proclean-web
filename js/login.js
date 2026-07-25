// =====================================================
// LOGIN PRO CLEAN PRIME
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("loginForm");

    if (!formulario) return;

    formulario.addEventListener("submit", validarLogin);

});


// =====================================================
// VALIDAR LOGIN
// =====================================================

function validarLogin(event){

    event.preventDefault();

    ocultarMensaje();

const inputUsuario = document.getElementById("usuario");

const inputPassword = document.getElementById("password");

const usuario = inputUsuario.value.trim();

const password = inputPassword.value.trim();

    if (!usuario) {

        mostrarMensaje("Debes ingresar tu usuario.","error");

        document.getElementById("usuario").focus();

        return;

    }

    if (!password) {

        mostrarMensaje("Debes ingresar tu contraseña.","error");

        document.getElementById("password").focus();

        return;

    }

    activarCarga();

setTimeout(() => {

    mostrarMensaje(
        "✅ Validación completada correctamente.",
        "success"
    );

    desactivarCarga();

}, 2000);

}
// =====================================================
// MOSTRAR MENSAJE
// =====================================================

function mostrarMensaje(texto,tipo){

    const mensaje=document.getElementById("loginMessage");

    mensaje.classList.remove("hidden");

    mensaje.textContent=texto;

    if(tipo==="error"){

        mensaje.className="mt-5 rounded-xl px-4 py-3 text-sm font-medium bg-red-100 text-red-700 border border-red-300";

    }

    if(tipo==="success"){

        mensaje.className="mt-5 rounded-xl px-4 py-3 text-sm font-medium bg-green-100 text-green-700 border border-green-300";

    }

}


// =====================================================
// OCULTAR MENSAJE
// =====================================================

function ocultarMensaje(){

    const mensaje=document.getElementById("loginMessage");

    mensaje.classList.add("hidden");

}
// =====================================================
// ACTIVAR ESTADO DE CARGA
// =====================================================

function activarCarga() {

    const boton = document.getElementById("loginButton");

    boton.disabled = true;

    boton.innerHTML = "⏳ Verificando...";

    boton.classList.add("opacity-70", "cursor-not-allowed");

}


// =====================================================
// DESACTIVAR ESTADO DE CARGA
// =====================================================

function desactivarCarga() {

    const boton = document.getElementById("loginButton");

    boton.disabled = false;

    boton.innerHTML = "Iniciar sesión";

    boton.classList.remove("opacity-70", "cursor-not-allowed");

}
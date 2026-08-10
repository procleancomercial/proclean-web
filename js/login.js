// =====================================================
// LOGIN PRO CLEAN PRIME
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("loginForm");
    if (formulario) {
        formulario.addEventListener("submit", validarLogin);
    }

    // =====================================================
    // MENÚ MÓVIL
    // =====================================================
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // Inicializar iconos de Lucide
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
});

// =====================================================
// VALIDAR LOGIN (VERIFICACIÓN REAL CON GOOGLE SHEETS)
// =====================================================

function validarLogin(event) {
    // 1. Evitamos que el formulario recargue la página por defecto
    if (event) {
        event.preventDefault();
    }
    
    ocultarMensaje();

    const inputUsuario = document.getElementById("usuario");
    const inputPassword = document.getElementById("password");

    const usuario = inputUsuario.value.trim();
    const password = inputPassword.value.trim();

    if (!usuario) {
        mostrarMensaje("Debes ingresar tu usuario.", "error");
        inputUsuario.focus();
        return false;
    }

    if (!password) {
        mostrarMensaje("Debes ingresar tu contraseña.", "error");
        inputPassword.focus();
        return false;
    }

    activarCarga();

    // Tu URL actual de Google Apps Script
    const urlScript = "https://script.google.com/macros/s/AKfycbxWNkWn-UCUhwgZD7E7hzSo6RmWwDCFJs8oK4uAsRM5eLBiOeOkVjv1khaoBQPqu8cn/exec";

    const urlFinal = `${urlScript}?usuario=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}`;

    // El endpoint de Google Apps Script puede devolver la respuesta con
    // Content-Type "text/html" en lugar de JSON, por lo que response.json()
    // falla. Leemos la respuesta como texto y la convertimos manualmente.
    fetch(urlFinal)
        .then(response => response.text())
        .then(text => {
            desactivarCarga();

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                mostrarMensaje("❌ La base de datos no respondió correctamente.", "error");
                console.error("Respuesta no válida del servidor:", text);
                return;
            }

            if (data.success === true) {
                // Guardamos el nombre que viene desde Google Sheets
                localStorage.setItem("nombreEspecialista", data.nombre || "Especialista");

                mostrarMensaje("✅ ¡Acceso concedido! Redirigiendo...", "success");
                
                // Redirección limpia al dashboard
                setTimeout(() => {
                    window.location.replace("dashboard.html");
                }, 800);
            } else {
                mostrarMensaje("❌ Usuario o contraseña incorrectos, o usuario inactivo.", "error");
                inputPassword.value = "";
                inputPassword.focus();
            }
        })
        .catch(error => {
            desactivarCarga();
            mostrarMensaje("❌ Error al conectar con la base de datos.", "error");
            console.error("Error:", error);
        });
        
    return false;
}

// =====================================================
// MOSTRAR MENSAJE
// =====================================================

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById("loginMessage");
    if (!mensaje) return;

    mensaje.classList.remove("hidden");
    mensaje.textContent = texto;

    if (tipo === "error") {
        mensaje.className = "mt-5 rounded-xl px-4 py-3 text-sm font-medium bg-red-100 text-red-700 border border-red-300";
    }

    if (tipo === "success") {
        mensaje.className = "mt-5 rounded-xl px-4 py-3 text-sm font-medium bg-green-100 text-green-700 border border-green-300";
    }
}

// =====================================================
// OCULTAR MENSAJE
// =====================================================

function ocultarMensaje() {
    const mensaje = document.getElementById("loginMessage");
    if (!mensaje) return;
    mensaje.classList.add("hidden");
}

// =====================================================
// ACTIVAR ESTADO DE CARGA
// =====================================================

function activarCarga() {
    const boton = document.getElementById("loginButton");
    if (!boton) return;
    boton.disabled = true;
    boton.innerHTML = "⏳ Verificando...";
    boton.classList.add("opacity-70", "cursor-not-allowed");
}

// =====================================================
// DESACTIVAR ESTADO DE CARGA
// =====================================================

function desactivarCarga() {
    const boton = document.getElementById("loginButton");
    if (!boton) return;
    boton.disabled = false;
    boton.innerHTML = "Iniciar sesión";
    boton.classList.remove("opacity-70", "cursor-not-allowed");
}

// =====================================================
// RECUPERAR CONTRASEÑA (VÍA WHATSAPP)
// =====================================================

function recuperarPassword(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Tu número de WhatsApp configurado con código de país (57 para Colombia)
    const telefonoSoporte = "573046048963"; 
    const mensaje = encodeURIComponent("Hola, necesito ayuda con el acceso o mi contraseña en el portal de especialistas de ProClean Prime.");
    
    window.open(`https://wa.me/${telefonoSoporte}?text=${mensaje}`, "_blank");
}
export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        // Servir la página y todos los archivos de assets
        if (!url.pathname.startsWith("/api/")) {
            return env.ASSETS.fetch(request);
        }

        // Endpoint temporal para comprobar que el Worker funciona
        if (url.pathname === "/api/test") {

            return new Response(
                JSON.stringify({
                    ok: true,
                    mensaje: "Worker de ProClean Prime funcionando"
                }),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        return new Response(
            JSON.stringify({
                ok: false,
                error: "Ruta no encontrada"
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
};
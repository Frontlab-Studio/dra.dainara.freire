v(function () {
    // ==========================================
    // 1. DADOS DO CLIENTE (MUDE APENAS AQUI)
    // ==========================================
    const CONFIG = {
        url: "https://tracker-clinica-dainara-freire.frontlabstudio.workers.dev",
        timeout: 800, // Escudo de UX (800ms) - Não alterar
        cooldownHoras: 1 // Tempo de bloqueio (em horas) para o mesmo usuário não gerar cliques duplicados
    };

    // ==========================================
    // 2. MOTOR RASTREADOR BLINDADO
    // ==========================================
    document.addEventListener("click", async function (e) {
        const target = e.target.closest('[data-track="true"]');
        if (!target) return;

        const coluna = target.getAttribute("data-coluna");
        const href = target.getAttribute("href");
        const isBlank = target.getAttribute("target") === "_blank";

        if (!coluna) return;

        if (!isBlank && href && href !== '#') {
            e.preventDefault();
        }

        // Calcula o tempo de bloqueio em milissegundos
        const tempoBloqueioMs = CONFIG.cooldownHoras * 60 * 60 * 1000;
        const storageKey = `fl_track_${coluna}`;
        const lastClick = localStorage.getItem(storageKey);
        const now = Date.now();

        // Verifica se o usuário já clicou dentro do tempo de cooldown
        if (lastClick && (now - parseInt(lastClick) < tempoBloqueioMs)) {
            console.log(`[Frontlab] Clique ignorado. Usuário no período de cooldown de ${CONFIG.cooldownHoras}h.`);
            liberarNavegacao(isBlank, href);
            return;
        }

        // Se passou do tempo (ou é o primeiro clique), salva o novo horário e continua
        localStorage.setItem(storageKey, now.toString());

        try {
            const fetchPromise = fetch(CONFIG.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ [coluna]: 1 }),
                keepalive: true
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), CONFIG.timeout)
            );

            await Promise.race([fetchPromise, timeoutPromise]);
        } catch (err) {
            console.warn("[Frontlab Tracker] Timeout atingido ou log processado silenciosamente.");
        } finally {
            liberarNavegacao(isBlank, href);
        }
    });

    function liberarNavegacao(isBlank, href) {
        if (!isBlank && href && href !== '#') {
            window.location.href = href;
        }
    }
})();
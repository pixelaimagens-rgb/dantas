(function() {
    if (document.getElementById("eclipse-panel")) return;

    const features = {
        autoAnswer: false,
        revealAnswers: false,
        questionSpoof: false,
        videoSpoof: false,
        darkMode: true,
        rgbLogo: false,
        oneko: false
    };

    const config = {
        autoAnswerDelay: 1.5
    };

    function showToast(message, type = "info", duration = 3000) {
        const toast = document.createElement("div");
        toast.className = `eclipse-toast eclipse-toast-${type}`;
        toast.innerHTML = `
            <div class="eclipse-toast-icon">${type === "success" ? "✓" : type === "error" ? "✗" : "•"}</div>
            <div class="eclipse-toast-message">${message}</div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const style = document.createElement("style");
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        :root {
            --eclipse-bg: #1a1b26;
            --eclipse-surface: #242532;
            --eclipse-border: #3a3b4b;
            --eclipse-primary: #7257ff;
            --eclipse-primary-light: #8a72ff;
            --eclipse-accent: #43d9ad;
            --eclipse-text: #e6e6ff;
            --eclipse-text-muted: #a0a0c0;
            --eclipse-success: #43d9ad;
            --eclipse-error: #ff6b6b;
        }
        
        .eclipse-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            max-width: 320px;
            width: calc(100vw - 48px);
            background: var(--eclipse-surface);
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            z-index: 999999;
            transition: all 0.3s ease;
            opacity: 1;
            transform: translateY(0);
            border-left: 3px solid var(--eclipse-primary);
        }
        
        .eclipse-toast-success {
            border-left-color: var(--eclipse-success);
        }
        
        .eclipse-toast-error {
            border-left-color: var(--eclipse-error);
        }
        
        .eclipse-toast-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .eclipse-toast-message {
            font-size: 14px;
            color: var(--eclipse-text);
            flex: 1;
        }
        
        .eclipse-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, var(--eclipse-primary), var(--eclipse-primary-light));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100000;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 16px rgba(114, 87, 255, 0.3);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
        }
        
        .eclipse-toggle:hover {
            transform: scale(1.08) rotate(5deg);
            box-shadow: 0 6px 20px rgba(114, 87, 255, 0.4);
        }
        
        .eclipse-toggle:active {
            transform: scale(1) rotate(0);
        }
        
        .eclipse-panel {
            position: fixed;
            bottom: 90px;
            right: 24px;
            width: 360px;
            max-height: 85vh;
            background: var(--eclipse-bg);
            border-radius: 16px;
            border: 1px solid var(--eclipse-border);
            z-index: 99999;
            color: var(--eclipse-text);
            font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            display: none;
            overflow: hidden;
            transform: translateY(10px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .eclipse-panel.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .eclipse-header {
            padding: 20px 24px 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .eclipse-title {
            font-weight: 700;
            font-size: 20px;
            background: linear-gradient(to right, white, #c5c5ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            letter-spacing: -0.5px;
        }
        
        .eclipse-version {
            font-size: 13px;
            color: var(--eclipse-text-muted);
            background: rgba(58, 59, 75, 0.5);
            padding: 3px 8px;
            border-radius: 6px;
            font-weight: 500;
        }
        
        .eclipse-tabs {
            display: flex;
            padding: 0 8px;
            margin: 0 16px;
            border-radius: 10px;
            background: var(--eclipse-surface);
            overflow: hidden;
            border: 1px solid var(--eclipse-border);
        }
        
        .eclipse-tab {
            flex: 1;
            padding: 14px 0;
            cursor: pointer;
            color: var(--eclipse-text-muted);
            font-weight: 500;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .eclipse-tab:hover {
            color: var(--eclipse-primary-light);
        }
        
        .eclipse-tab.active {
            color: white;
            font-weight: 600;
        }
        
        .eclipse-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background: var(--eclipse-primary);
            border-radius: 3px;
        }
        
        .eclipse-tab-content {
            padding: 16px;
            display: none;
            max-height: 480px;
            overflow-y: auto;
        }
        
        .eclipse-tab-content.active {
            display: block;
            animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Custom scrollbar */
        .eclipse-tab-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .eclipse-tab-content::-webkit-scrollbar-track {
            background: rgba(58, 59, 75, 0.3);
            border-radius: 3px;
        }
        
        .eclipse-tab-content::-webkit-scrollbar-thumb {
            background: var(--eclipse-primary);
            border-radius: 3px;
        }
        
        .eclipse-button {
            width: 100%;
            padding: 16px;
            background: var(--eclipse-surface);
            color: var(--eclipse-text);
            border: 1px solid var(--eclipse-border);
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            text-align: left;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: all 0.25s ease;
            position: relative;
            overflow: hidden;
        }
        
        .eclipse-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(114, 87, 255, 0.1), transparent);
            transition: all 0.6s ease;
        }
        
        .eclipse-button:hover::before {
            left: 100%;
        }
        
        .eclipse-button:hover {
            border-color: var(--eclipse-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(114, 87, 255, 0.1);
        }
        
        .eclipse-button:active {
            transform: translateY(0);
        }
        
        .eclipse-button.active {
            background: rgba(114, 87, 255, 0.15);
            border-color: var(--eclipse-primary);
            color: white;
        }
        
        .eclipse-button.active::after {
            content: 'ATIVADO';
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(114, 87, 255, 0.25);
            color: var(--eclipse-primary-light);
            font-size: 12px;
            padding: 3px 10px;
            border-radius: 12px;
            font-weight: 600;
        }
        
        .eclipse-icon {
            width: 26px;
            height: 26px;
            min-width: 26px;
            background: rgba(58, 59, 75, 0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.25s ease;
        }
        
        .eclipse-button:hover .eclipse-icon {
            background: var(--eclipse-primary);
            transform: scale(1.05);
        }
        
        .eclipse-button.active .eclipse-icon {
            background: var(--eclipse-primary);
        }
        
        .eclipse-input-group {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--eclipse-border);
        }
        
        .eclipse-input-label {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: var(--eclipse-text-muted);
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .eclipse-speed-value {
            font-weight: 600;
            color: var(--eclipse-primary);
        }
        
        .eclipse-range {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--eclipse-surface);
            border-radius: 3px;
            border: 1px solid var(--eclipse-border);
            position: relative;
        }
        
        .eclipse-range::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: ${config.autoAnswerDelay * 40}%; /* 1.5-2.5 = 60-100% */
            background: var(--eclipse-primary);
            border-radius: 3px;
        }
        
        .eclipse-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid var(--eclipse-primary);
            cursor: pointer;
            transition: all 0.15s ease;
            margin-top: -7px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .eclipse-range::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            background: var(--eclipse-primary);
            border-color: white;
        }
        
        .eclipse-footer {
            padding: 16px;
            border-top: 1px solid var(--eclipse-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--eclipse-text-muted);
            background: rgba(36, 37, 50, 0.7);
        }
        
        .eclipse-footer a {
            color: var(--eclipse-primary);
            text-decoration: none;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .eclipse-footer a:hover {
            color: var(--eclipse-primary-light);
        }
        
        .eclipse-about-content {
            padding: 8px 0;
        }
        
        .eclipse-about-content p {
            color: var(--eclipse-text-muted);
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .eclipse-features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 16px 0;
        }
        
        @media (max-width: 400px) {
            .eclipse-features {
                grid-template-columns: 1fr;
            }
        }
        
        .eclipse-feature {
            background: var(--eclipse-surface);
            border: 1px solid var(--eclipse-border);
            border-radius: 10px;
            padding: 14px;
            font-size: 13px;
            transition: all 0.2s ease;
        }
        
        .eclipse-feature:hover {
            transform: translateY(-2px);
            border-color: var(--eclipse-primary);
            box-shadow: 0 4px 12px rgba(114, 87, 255, 0.1);
        }
        
        .eclipse-feature-title {
            font-weight: 600;
            color: var(--eclipse-primary);
            margin-bottom: 4px;
            font-size: 14px;
        }
        
        .eclipse-social-links {
            display: flex;
            gap: 16px;
            margin-top: 16px;
        }
        
        .eclipse-social-btn {
            flex: 1;
            padding: 12px;
            background: var(--eclipse-surface);
            border: 1px solid var(--eclipse-border);
            border-radius: 10px;
            color: var(--eclipse-text);
            text-decoration: none;
            text-align: center;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }
        
        .eclipse-social-btn:hover {
            border-color: var(--eclipse-primary);
            background: rgba(114, 87, 255, 0.1);
        }
        
        .eclipse-social-icon {
            font-size: 18px;
        }
        
        .eclipse-credits {
            font-size: 13px;
            color: var(--eclipse-text-muted);
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--eclipse-border);
            line-height: 1.5;
        }
        
        .eclipse-credits a {
            color: var(--eclipse-primary);
            text-decoration: none;
        }
        
        .eclipse-credits a:hover {
            text-decoration: underline;
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
            .eclipse-panel {
                width: calc(100vw - 48px);
                bottom: 24px;
                right: 24px;
                left: auto;
                max-height: 80vh;
            }
            
            .eclipse-toggle {
                bottom: 24px;
                right: 24px;
            }
            
            .eclipse-toast {
                max-width: calc(100vw - 48px);
                bottom: 24px;
                right: 24px;
                left: auto;
            }
            
            .eclipse-tabs {
                margin: 0 12px;
            }
        }
    `;
    document.head.appendChild(style);

    // Intercepta respostas para revelar respostas
    const originalParse = JSON.parse;
    JSON.parse = function(text, reviver) {
        let data = originalParse(text, reviver);
        if (features.revealAnswers && data && data.data) {
            try {
                const dataValues = Object.values(data.data);
                for (const val of dataValues) {
                    if (val && val.item && val.item.itemData) {
                        let itemData = JSON.parse(val.item.itemData);
                        if (itemData.question && itemData.question.widgets) {
                            for (const widget of Object.values(itemData.question.widgets)) {
                                if (widget.options && widget.options.choices) {
                                    widget.options.choices.forEach(choice => {
                                        if (choice.correct) {
                                            choice.content = "✅ " + choice.content;
                                        }
                                    });
                                }
                            }
                        }
                        val.item.itemData = JSON.stringify(itemData);
                    }
                }
                showToast("Respostas reveladas com sucesso", "success", 2000);
            } catch (e) {}
        }
        return data;
    };

    // Intercepta requisições para modificar questões
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        let [input, init] = args;
        const originalResponse = await originalFetch.apply(this, args);
        if (features.questionSpoof && originalResponse.ok) {
            const clonedResponse = originalResponse.clone();
            try {
                let responseObj = await clonedResponse.json();
                if (responseObj && responseObj.data && responseObj.data.assessmentItem && responseObj.data.assessmentItem.item && responseObj.data.assessmentItem.item.itemData) {
                    const phrases = [
                        "🚀 Feito por [@bakai](https://github.com/KilluaWq)",
                        "💫 Créditos para [@bakai](https://github.com/KilluaWq)",
                        "🔭 Acesse o GitHub do [@bakai](https://github.com/KilluaWq)",
                        "🌌 Entre no nosso Discord: [Eclipse](https://discord.gg/QAm62DDJ)",
                        "🌠 Eclipse sempre em frente"
                    ];
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
                    itemData.question.widgets = { 
                        "radio 1": { 
                            type: "radio", 
                            options: { 
                                choices: [
                                    { content: "✅ Confirmar", correct: true }, 
                                    { content: "❌ Cancelar", correct: false }
                                ] 
                            } 
                        } 
                    };
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    showToast("Questão modificada com sucesso", "success", 2000);
                    return new Response(JSON.stringify(responseObj), { 
                        status: 200, 
                        statusText: "OK", 
                        headers: originalResponse.headers 
                    });
                }
            } catch (e) {}
        }
        return originalResponse;
    };

    // Loop para FPS
    let lastFrameTime = performance.now();
    let frameCount = 0;
    function gameLoop() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 1000) {
            const fpsCounter = document.getElementById("eclipse-fps");
            if (fpsCounter) fpsCounter.textContent = `✨ ${frameCount}`;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(gameLoop);
    }

    // Loop de resposta automática
    (async function autoAnswerLoop() {
        while (true) {
            if (features.autoAnswer) {
                const click = (selector) => { 
                    const e = document.querySelector(selector); 
                    if(e) e.click(); 
                };
                click('[data-testid="choice-icon__library-choice-icon"]');
                await delay(100);
                click('[data-testid="exercise-check-answer"]');
                await delay(100);
                click('[data-testid="exercise-next-question"]');
            }
            await delay(config.autoAnswerDelay * 1000);
        }
    })();

    // Inicializa a UI
    (async function initializeUI() {
        // Função Oneko (gatinho)
        function oneko() {
            const nekoEl = document.createElement("div");
            let nekoPosX = 32;
            let nekoPosY = 32;
            let mousePosX = 0;
            let mousePosY = 0;
            let frameCount = 0;
            let idleTime = 0;
            let idleAnimation = null;
            let idleAnimationFrame = 0;
            const nekoSpeed = 10;
            const spriteSets = {
                idle: [[-3, -3]],
                alert: [[-7, -3]],
                scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
                scratchWall: [[0, 0], [0, -1]],
                sleep: [[-2, 0], [-2, -1]],
                sit: [[-2, -3]],
                N: [[-1, -2], [-1, -3]],
                NE: [[0, -2], [0, -3]],
                E: [[-3, 0], [-4, 0]],
                SE: [[-5, -1], [-6, -1]],
                S: [[-6, -2], [-7, -2]],
                SW: [[-5, -2], [-6, -3]],
                W: [[-4, -2], [-4, -3]],
                NW: [[-1, 0], [-1, -1]],
            };
            
            function init() {
                nekoEl.id = "oneko";
                nekoEl.style.width = "32px";
                nekoEl.style.height = "32px";
                nekoEl.style.position = "fixed";
                nekoEl.style.pointerEvents = "none";
                nekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/orickmaxx/KhanCrack/main/oneko.gif')";
                nekoEl.style.imageRendering = "pixelated";
                nekoEl.style.left = "16px";
                nekoEl.style.top = "16px";
                nekoEl.style.zIndex = "99999";
                document.body.appendChild(nekoEl);
                
                document.addEventListener("mousemove", (event) => {
                    mousePosX = event.clientX;
                    mousePosY = event.clientY;
                });
                
                window.onekoInterval = setInterval(frame, 100);
            }
            
            function setSprite(name, frame) {
                const sprite = spriteSets[name][frame % spriteSets[name].length];
                nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
            }
            
            function resetIdleAnimation() {
                idleAnimation = null;
                idleAnimationFrame = 0;
            }
            
            function idle() {
                idleTime += 1;
                if (idleTime > 10 && Math.random() < 0.02 && idleAnimation == null) {
                    let availableAnimations = ["alert", "scratchSelf"];
                    if (nekoPosX < 32) {
                        availableAnimations.push("scratchWall");
                    }
                    idleAnimation = availableAnimations[Math.floor(Math.random() * availableAnimations.length)];
                }
                
                switch (idleAnimation) {
                    case "alert":
                        setSprite("alert", 0);
                        if (idleAnimationFrame > 10) {
                            resetIdleAnimation();
                        }
                        break;
                    case "scratchSelf":
                        setSprite("scratchSelf", idleAnimationFrame);
                        if (idleAnimationFrame > 9) {
                            resetIdleAnimation();
                        }
                        break;
                    case "scratchWall":
                        setSprite("scratchWall", idleAnimationFrame);
                        if (idleAnimationFrame > 9) {
                            resetIdleAnimation();
                        }
                        break;
                    default:
                        setSprite("sit", 0);
                        return;
                }
                idleAnimationFrame += 1;
            }
            
            function frame() {
                frameCount += 1;
                const diffX = nekoPosX - mousePosX;
                const diffY = nekoPosY - mousePosY;
                const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
                
                if (distance < nekoSpeed || distance < 48) {
                    idle();
                    return;
                }
                
                idleTime = 0;
                resetIdleAnimation();
                
                let direction;
                const angle = (Math.atan2(diffY, diffX) + Math.PI) * (180 / Math.PI) + 90;
                if (angle < 0) angle += 360;
                
                if (angle > 337.5 || angle <= 22.5) direction = "N";
                else if (angle > 22.5 && angle <= 67.5) direction = "NE";
                else if (angle > 67.5 && angle <= 112.5) direction = "E";
                else if (angle > 112.5 && angle <= 157.5) direction = "SE";
                else if (angle > 157.5 && angle <= 202.5) direction = "S";
                else if (angle > 202.5 && angle <= 247.5) direction = "SW";
                else if (angle > 247.5 && angle <= 292.5) direction = "W";
                else if (angle > 292.5 && angle <= 337.5) direction = "NW";
                
                setSprite(direction, frameCount);
                nekoPosX -= (diffX / distance) * nekoSpeed;
                nekoPosY -= (diffY / distance) * nekoSpeed;
                nekoEl.style.left = `${nekoPosX - 16}px`;
                nekoEl.style.top = `${nekoPosY - 16}px`;
            }
            
            init();
        };

        // Carrega o Dark Reader
        function loadScript(src, id) {
            return new Promise((resolve, reject) => {
                if (document.getElementById(id)) return resolve();
                const script = document.createElement('script');
                script.src = src; 
                script.id = id;
                script.onload = resolve; 
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // Carrega o Dark Reader
        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader').then(() => {
            DarkReader.setFetchMethod(window.fetch);
            if (features.darkMode) DarkReader.enable();
        });

        // Cria o botão toggle
        const toggleBtn = document.createElement("div");
        toggleBtn.innerHTML = "🌙";
        toggleBtn.className = "eclipse-toggle";
        toggleBtn.onclick = () => {
            const p = document.getElementById("eclipse-panel");
            if (p) {
                if (p.style.display === "block") {
                    p.style.display = "none";
                } else {
                    p.style.display = "block";
                    setTimeout(() => p.classList.add("active"), 10);
                }
            }
        };
        document.body.appendChild(toggleBtn);
        
        // Cria o painel principal
        const panel = document.createElement("div");
        panel.id = "eclipse-panel";
        panel.className = "eclipse-panel";
        panel.innerHTML = `
            <div class="eclipse-header">
                <div class="eclipse-title">Eclipse Lunar</div>
                <div class="eclipse-version">v2.1</div>
            </div>
            <div class="eclipse-tabs">
                <div class="eclipse-tab active" data-tab="main">Principal</div>
                <div class="eclipse-tab" data-tab="visual">Visual</div>
                <div class="eclipse-tab" data-tab="about">Sobre</div>
            </div>
            <div id="eclipse-tab-main" class="eclipse-tab-content active">
                <button id="eclipse-btn-auto" class="eclipse-button">
                    <span class="eclipse-icon">⚡</span>
                    <span>Resposta Automática</span>
                </button>
                <button id="eclipse-btn-reveal" class="eclipse-button">
                    <span class="eclipse-icon">🔍</span>
                    <span>Revelar Respostas</span>
                </button>
                <button id="eclipse-btn-question" class="eclipse-button">
                    <span class="eclipse-icon">📝</span>
                    <span>Modificar Questões</span>
                </button>
                <button id="eclipse-btn-video" class="eclipse-button">
                    <span class="eclipse-icon">▶️</span>
                    <span>Modificar Vídeos</span>
                </button>
                
                <div class="eclipse-input-group">
                    <div class="eclipse-input-label">
                        <span>Velocidade de Resposta</span>
                        <span class="eclipse-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span>
                    </div>
                    <input type="range" class="eclipse-range" id="eclipse-speed" value="${config.autoAnswerDelay}" min="1.5" max="2.5" step="0.1">
                </div>
            </div>
            <div id="eclipse-tab-visual" class="eclipse-tab-content">
                <button id="eclipse-btn-dark" class="eclipse-button active">
                    <span class="eclipse-icon">🌓</span>
                    <span>Modo Escuro</span>
                </button>
                <button id="eclipse-btn-rgb" class="eclipse-button">
                    <span class="eclipse-icon">🎨</span>
                    <span>Logo RGB Dinâmico</span>
                </button>
                <button id="eclipse-btn-oneko" class="eclipse-button">
                    <span class="eclipse-icon">🐱</span>
                    <span>Oneko Gatinho</span>
                </button>
            </div>
            <div id="eclipse-tab-about" class="eclipse-tab-content">
                <div class="eclipse-about-content">
                    <p>Um sistema avançado de automação e personalização para Khan Academy, projetado para melhorar sua experiência de aprendizado com recursos inteligentes e interface intuitiva.</p>
                    
                    <div class="eclipse-features">
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Automação Inteligente</div>
                            <div>Respostas automáticas com controle de velocidade ajustável</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Segurança Acadêmica</div>
                            <div>Revelação discreta de respostas e modificação de conteúdo</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Personalização Completa</div>
                            <div>Adapte a interface ao seu estilo de aprendizado</div>
                        </div>
                        <div class="eclipse-feature">
                            <div class="eclipse-feature-title">Desempenho Otimizado</div>
                            <div>Funciona suavemente sem afetar a performance</div>
                        </div>
                    </div>
                    
                    <div class="eclipse-social-links">
                        <a href="https://discord.gg/QAm62DDJ" target="_blank" class="eclipse-social-btn">
                            <span class="eclipse-social-icon">💬</span>
                            <span>Discord</span>
                        </a>
                        <a href="https://github.com/KilluaWq" target="_blank" class="eclipse-social-btn">
                            <span class="eclipse-social-icon">🐙</span>
                            <span>GitHub</span>
                        </a>
                    </div>
                    
                    <div class="eclipse-credits">
                        Desenvolvido com ❤ por <a href="https://github.com/KilluaWq" target="_blank">@bakai</a><br>
                        Eclipse Lunar • Sempre à frente da curva
                    </div>
                </div>
            </div>
            <div class="eclipse-footer">
                <a href="https://discord.gg/QAm62DDJ" target="_blank">
                    <span>Comunidade Eclipse</span>
                </a>
                <span id="eclipse-fps">✨ ...</span>
            </div>
        `;
        document.body.appendChild(panel);

        // Configura os botões
        const setupToggleButton = (buttonId, featureName, callback) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    features[featureName] = !features[featureName];
                    button.classList.toggle('active', features[featureName]);
                    
                    if (callback) callback(features[featureName]);
                    
                    // Feedback visual
                    const action = features[featureName] ? "ativado" : "desativado";
                    const featureText = button.querySelector('span:last-child').textContent;
                    showToast(`${featureText} ${action}`, 
                             features[featureName] ? "success" : "info");
                });
            }
        };
        
        setupToggleButton('eclipse-btn-auto', 'autoAnswer');
        setupToggleButton('eclipse-btn-question', 'questionSpoof');
        setupToggleButton('eclipse-btn-video', 'videoSpoof');
        setupToggleButton('eclipse-btn-reveal', 'revealAnswers');
        setupToggleButton('eclipse-btn-dark', 'darkMode', (isActive) => {
            if (typeof DarkReader === 'undefined') return;
            isActive ? DarkReader.enable() : DarkReader.disable();
        });
        setupToggleButton('eclipse-btn-rgb', 'rgbLogo', toggleRgbLogo);
        setupToggleButton('eclipse-btn-oneko', 'oneko', toggleOnekoJs);

        // Configura o controle de velocidade
        const speedInput = document.getElementById('eclipse-speed');
        const speedValue = document.querySelector('.eclipse-speed-value');
        if (speedInput && speedValue) {
            speedInput.addEventListener('input', () => {
                const newDelay = parseFloat(speedInput.value);
                config.autoAnswerDelay = newDelay;
                speedValue.textContent = `${newDelay.toFixed(1)}s`;
                showToast(`Velocidade definida para ${newDelay.toFixed(1)}s`, "info", 1500);
            });
        }
        
        // Configura as abas
        document.querySelectorAll('.eclipse-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.eclipse-tab, .eclipse-tab-content').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`eclipse-tab-${tab.dataset.tab}`).classList.add('active');
            });
        });

        // Funções de callback
        function toggleRgbLogo(isActive) {
            const khanLogo = document.querySelector('path[fill="#14bf96"]');
            if (!khanLogo) {
                showToast("Logo do Khan Academy não encontrada", "error");
                return;
            }
            khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
        }

        function toggleOnekoJs(isActive) {
            if (isActive) {
                if (!document.getElementById("oneko")) {
                    oneko();
                    showToast("Gatinho cósmico ativado com sucesso", "success");
                }
            } else {
                const onekoEl = document.getElementById("oneko");
                if (onekoEl) {
                    clearInterval(window.onekoInterval);
                    onekoEl.remove();
                    showToast("Gatinho cósmico desativado", "info");
                }
            }
        }
        
        // Inicia o game loop
        gameLoop();
    })();
})();

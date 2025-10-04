(function() {
    if (document.getElementById("eclipse-panel")) return;

    const features = {
        questionSpoof: false,
        videoSpoof: false,
        revealAnswers: false,
        autoAnswer: false,
        darkMode: true,
        rgbLogo: false,
        oneko: true
    };

    const config = {
        autoAnswerDelay: 1.5
    };

    function showToast(message, duration = 3000) {
        const toast = document.createElement("div");
        toast.className = "eclipse-toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
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
            --eclipse-primary-hover: #8a72ff;
            --eclipse-text: #e6e6ff;
            --eclipse-text-muted: #a0a0c0;
            --eclipse-accent: #43d9ad;
        }
        
        .eclipse-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: var(--eclipse-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            color: var(--eclipse-primary);
            font-size: 32px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            transition: opacity 0.3s;
        }
        
        .eclipse-splash.fadeout {
            opacity: 0;
            pointer-events: none;
        }
        
        .eclipse-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            background: var(--eclipse-surface);
            border: 1px solid var(--eclipse-border);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100000;
            color: var(--eclipse-primary);
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            transition: all 0.2s ease;
            backdrop-filter: blur(4px);
        }
        
        .eclipse-toggle:hover {
            background: var(--eclipse-primary);
            color: white;
            transform: translateY(-2px);
        }
        
        .eclipse-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 320px;
            max-height: 80vh;
            background: var(--eclipse-bg);
            border-radius: 12px;
            border: 1px solid var(--eclipse-border);
            z-index: 99999;
            color: var(--eclipse-text);
            font-family: 'Inter', sans-serif;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            display: none;
            overflow: hidden;
        }
        
        .eclipse-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--eclipse-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .eclipse-title {
            font-weight: 600;
            font-size: 18px;
            color: white;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .eclipse-version {
            font-size: 12px;
            color: var(--eclipse-text-muted);
            background: rgba(58, 59, 75, 0.5);
            padding: 2px 6px;
            border-radius: 4px;
        }
        
        .eclipse-tabs {
            display: flex;
            border-bottom: 1px solid var(--eclipse-border);
        }
        
        .eclipse-tab {
            padding: 12px 16px;
            cursor: pointer;
            color: var(--eclipse-text-muted);
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .eclipse-tab:hover {
            color: var(--eclipse-primary-hover);
        }
        
        .eclipse-tab.active {
            color: var(--eclipse-primary);
            font-weight: 500;
        }
        
        .eclipse-tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--eclipse-primary);
        }
        
        .eclipse-tab-content {
            padding: 16px;
            display: none;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .eclipse-tab-content.active {
            display: block;
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
            padding: 12px 16px;
            background: var(--eclipse-surface);
            color: var(--eclipse-text);
            border: 1px solid var(--eclipse-border);
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s ease;
        }
        
        .eclipse-button:hover {
            border-color: var(--eclipse-primary-hover);
            background: rgba(114, 87, 255, 0.1);
        }
        
        .eclipse-button.active {
            background: rgba(114, 87, 255, 0.2);
            border-color: var(--eclipse-primary);
            color: white;
            font-weight: 500;
        }
        
        .eclipse-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        .eclipse-input-group {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--eclipse-border);
        }
        
        .eclipse-input-label {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            color: var(--eclipse-text-muted);
            margin-bottom: 8px;
        }
        
        .eclipse-speed-value {
            font-weight: 600;
            color: var(--eclipse-primary);
        }
        
        .eclipse-range {
            width: 100%;
            height: 4px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--eclipse-surface);
            border-radius: 2px;
            border: 1px solid var(--eclipse-border);
        }
        
        .eclipse-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--eclipse-primary);
            cursor: pointer;
            transition: all 0.15s ease;
            margin-top: -6px;
        }
        
        .eclipse-range::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            background: var(--eclipse-primary-hover);
        }
        
        .eclipse-footer {
            padding: 12px 16px;
            border-top: 1px solid var(--eclipse-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: var(--eclipse-text-muted);
        }
        
        .eclipse-footer a {
            color: var(--eclipse-primary);
            text-decoration: none;
            transition: color 0.2s;
        }
        
        .eclipse-footer a:hover {
            color: var(--eclipse-primary-hover);
            text-decoration: underline;
        }
        
        .eclipse-about-content {
            padding: 8px 0;
        }
        
        .eclipse-about-content p {
            color: var(--eclipse-text-muted);
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 16px;
        }
        
        .eclipse-features {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin: 16px 0;
        }
        
        .eclipse-feature {
            background: var(--eclipse-surface);
            border: 1px solid var(--eclipse-border);
            border-radius: 8px;
            padding: 12px;
            font-size: 13px;
        }
        
        .eclipse-feature-title {
            font-weight: 500;
            color: var(--eclipse-primary);
            margin-bottom: 4px;
        }
        
        .eclipse-social-links {
            display: flex;
            gap: 16px;
            margin-top: 16px;
        }
        
        .eclipse-social-btn {
            color: var(--eclipse-text-muted);
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s;
        }
        
        .eclipse-social-btn:hover {
            color: var(--eclipse-primary);
        }
        
        .eclipse-credits {
            font-size: 12px;
            color: var(--eclipse-text-muted);
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1px solid var(--eclipse-border);
        }
        
        .eclipse-credits a {
            color: var(--eclipse-primary);
        }
        
        .eclipse-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--eclipse-surface);
            color: var(--eclipse-text);
            border-radius: 8px;
            padding: 12px 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            z-index: 999999;
            transition: opacity 0.3s;
            border-left: 3px solid var(--eclipse-primary);
            opacity: 1;
        }
        
        @media (max-width: 768px) {
            .eclipse-panel {
                width: calc(100vw - 40px);
                bottom: 20px;
                right: 20px;
                left: auto;
            }
            
            .eclipse-toggle {
                bottom: 20px;
                right: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // Restante do código permanece igual, apenas mudando os nomes dos elementos
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
                                            showToast("Resposta revelada");
                                        }
                                    });
                                }
                            }
                        }
                        val.item.itemData = JSON.stringify(itemData);
                    }
                }
            } catch (e) {}
        }
        return data;
    };

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
                        "Feito por [@bakai](https://github.com/KilluaWq)",
                        "Créditos para [@bakai](https://github.com/KilluaWq)",
                        "Acesse o GitHub do [@bakai](https://github.com/KilluaWq)",
                        "Entre no nosso Discord: [Eclipse](https://discord.gg/QAm62DDJ)",
                        "Eclipse sempre em frente"
                    ];
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
                    itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "✅", correct: true }, { content: "❌", correct: false }] } } };
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    showToast("Questão modificada");
                    return new Response(JSON.stringify(responseObj), { status: 200, statusText: "OK", headers: originalResponse.headers });
                }
            } catch (e) {}
        }
        return originalResponse;
    };

    let lastFrameTime = performance.now();
    let frameCount = 0;
    function gameLoop() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 1000) {
            const fpsCounter = document.getElementById("eclipse-fps");
            if (fpsCounter) fpsCounter.textContent = `FPS: ${frameCount}`;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(gameLoop);
    }

    (async function autoAnswerLoop() {
        while (true) {
            if (features.autoAnswer) {
                const click = (selector) => { const e = document.querySelector(selector); if(e) e.click(); };
                click('[data-testid="choice-icon__library-choice-icon"]');
                await delay(100);
                click('[data-testid="exercise-check-answer"]');
                await delay(100);
                click('[data-testid="exercise-next-question"]');
            }
            await delay(config.autoAnswerDelay * 1000);
        }
    })();

    const splash = document.createElement("div");
    splash.className = "eclipse-splash";
    splash.textContent = "Eclipse Lunar";
    document.body.appendChild(splash);

    (async function initializeUI() {
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
                nekoEl.style.zIndex = "9999";
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
                if (angle < 0) {
                    angle += 360;
                }
                if (angle > 337.5 || angle <= 22.5) {
                    direction = "N";
                } else if (angle > 22.5 && angle <= 67.5) {
                    direction = "NE";
                } else if (angle > 67.5 && angle <= 112.5) {
                    direction = "E";
                } else if (angle > 112.5 && angle <= 157.5) {
                    direction = "SE";
                } else if (angle > 157.5 && angle <= 202.5) {
                    direction = "S";
                } else if (angle > 202.5 && angle <= 247.5) {
                    direction = "SW";
                } else if (angle > 247.5 && angle <= 292.5) {
                    direction = "W";
                } else if (angle > 292.5 && angle <= 337.5) {
                    direction = "NW";
                }
                setSprite(direction, frameCount);
                nekoPosX -= (diffX / distance) * nekoSpeed;
                nekoPosY -= (diffY / distance) * nekoSpeed;
                nekoEl.style.left = `${nekoPosX - 16}px`;
                nekoEl.style.top = `${nekoPosY - 16}px`;
            }
            init();
        };

        function loadScript(src, id) {
            return new Promise((resolve, reject) => {
                if (document.getElementById(id)) return resolve();
                const script = document.createElement('script');
                script.src = src; script.id = id;
                script.onload = resolve; script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader').then(() => {
            DarkReader.setFetchMethod(window.fetch);
            if (features.darkMode) DarkReader.enable();
        });

        setTimeout(() => {
            splash.classList.add("fadeout");
            setTimeout(() => {
                splash.remove();
                gameLoop(); 

                const toggleBtn = document.createElement("div");
                toggleBtn.innerHTML = "☾";
                toggleBtn.className = "eclipse-toggle";
                toggleBtn.onclick = () => {
                    const p = document.getElementById("eclipse-panel");
                    if (p) p.style.display = p.style.display === "none" ? "block" : "none";
                };
                document.body.appendChild(toggleBtn);
                
                const panel = document.createElement("div");
                panel.id = "eclipse-panel";
                panel.className = "eclipse-panel";
                panel.innerHTML = `
                    <div class="eclipse-header">
                        <div class="eclipse-title">Eclipse Lunar</div>
                        <div class="eclipse-version">v2.0</div>
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
                                <span>Velocidade</span>
                                <span class="eclipse-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span>
                            </div>
                            <input type="range" class="eclipse-range" id="eclipse-speed" value="${config.autoAnswerDelay}" min="1.5" max="2.5" step="0.1">
                        </div>
                    </div>
                    <div id="eclipse-tab-visual" class="eclipse-tab-content">
                        <button id="eclipse-btn-dark" class="eclipse-button active">
                            <span class="eclipse-icon">🌙</span>
                            <span>Modo Escuro</span>
                        </button>
                        <button id="eclipse-btn-rgb" class="eclipse-button">
                            <span class="eclipse-icon">🎨</span>
                            <span>Logo RGB</span>
                        </button>
                        <button id="eclipse-btn-oneko" class="eclipse-button">
                            <span class="eclipse-icon">🐱</span>
                            <span>Oneko Gatinho</span>
                        </button>
                    </div>
                    <div id="eclipse-tab-about" class="eclipse-tab-content">
                        <div class="eclipse-about-content">
                            <p>Sistema de automação para Khan Academy com foco em melhorar sua experiência de aprendizado.</p>
                            
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
                            </div>
                            
                            <div class="eclipse-social-links">
                                <a href="https://discord.gg/QAm62DDJ" target="_blank" class="eclipse-social-btn">Discord</a>
                                <a href="https://github.com/KilluaWq" target="_blank" class="eclipse-social-btn">GitHub</a>
                            </div>
                            
                            <div class="eclipse-credits">
                                Desenvolvido por <a href="https://github.com/KilluaWq" target="_blank">@bakai</a><br>
                                Eclipse Lunar • Sempre à frente
                            </div>
                        </div>
                    </div>
                    <div class="eclipse-footer">
                        <a href="https://discord.gg/QAm62DDJ" target="_blank">Comunidade Eclipse</a>
                        <span id="eclipse-fps">FPS: ...</span>
                    </div>
                `;
                document.body.appendChild(panel);

                const setupToggleButton = (buttonId, featureName, callback) => {
                    const button = document.getElementById(buttonId);
                    if (button) {
                        button.addEventListener('click', () => {
                            features[featureName] = !features[featureName];
                            button.classList.toggle('active', features[featureName]);
                            if (callback) callback(features[featureName]);
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

                const speedInput = document.getElementById('eclipse-speed');
                const speedValue = document.querySelector('.eclipse-speed-value');
                if (speedInput && speedValue) {
                    speedInput.addEventListener('input', () => {
                        const newDelay = parseFloat(speedInput.value);
                        config.autoAnswerDelay = newDelay;
                        speedValue.textContent = `${newDelay.toFixed(1)}s`;
                    });
                }
                
                document.querySelectorAll('.eclipse-tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        document.querySelectorAll('.eclipse-tab, .eclipse-tab-content').forEach(el => el.classList.remove('active'));
                        tab.classList.add('active');
                        document.getElementById(`eclipse-tab-${tab.dataset.tab}`).classList.add('active');
                    });
                });

                function toggleRgbLogo(isActive) {
                    const khanLogo = document.querySelector('path[fill="#14bf96"]');
                    if (!khanLogo) return showToast("Logo não encontrada");
                    khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
                }

                function toggleOnekoJs(isActive) {
                    if (isActive) {
                        if (!document.getElementById("oneko")) {
                            oneko();
                            showToast("Gatinho ativado");
                        }
                    } else {
                        const onekoEl = document.getElementById("oneko");
                        if (onekoEl) {
                            clearInterval(window.onekoInterval);
                            onekoEl.remove();
                        }
                    }
                }
                
                let dragging = false, offsetX = 0, offsetY = 0;
                const startDrag = (e) => {
                    if (e.target.closest("button") || e.target.closest("input")) return;
                    dragging = true;
                    const touch = e.touches ? e.touches[0] : null;
                    const clientX = touch ? touch.clientX : e.clientX;
                    const clientY = touch ? touch.clientY : e.clientY;
                    offsetX = clientX - panel.getBoundingClientRect().right;
                    offsetY = clientY - panel.getBoundingClientRect().top;
                    panel.style.cursor = "grabbing";
                };
                
                const onDrag = (e) => {
                    if (dragging) {
                        e.preventDefault();
                        const touch = e.touches ? e.touches[0] : null;
                        const clientX = touch ? touch.clientX : e.clientX;
                        const clientY = touch ? touch.clientY : e.clientY;
                        panel.style.right = `${window.innerWidth - clientX + offsetX}px`;
                        panel.style.top = `${clientY - offsetY}px`;
                    }
                };
                
                const endDrag = () => { 
                    dragging = false; 
                    panel.style.cursor = "default"; 
                };

                panel.addEventListener("mousedown", startDrag);
                document.addEventListener("mousemove", onDrag);
                document.addEventListener("mouseup", endDrag);
                panel.addEventListener("touchstart", startDrag, { passive: false });
                document.addEventListener("touchmove", onDrag, { passive: false });
                document.addEventListener("touchend", endDrag);
            }, 800);
        }, 1500);
    })();
})();

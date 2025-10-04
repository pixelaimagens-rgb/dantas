(function() {
    if (document.getElementById("khz-panel")) return;

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

    function sendToast(message, duration = 4000) {
        const toast = document.createElement("div");
        toast.className = "khz-toast";
        toast.innerHTML = `<div class="khz-toast-message">${message}</div>`;
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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        :root {
            --khz-bg: rgba(26, 27, 38, 0.85);
            --khz-surface: rgba(40, 42, 58, 0.9);
            --khz-border: rgba(73, 20, 220, 0.2);
            --khz-primary: #45008bff;
            --khz-primary-hover: #5500ffff;
            --khz-text: #e0e0e0;
            --khz-text-muted: #9e9e9e;
        }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes splash-glow {
            0%, 100% { text-shadow: 0 0 10px var(--khz-primary), 0 0 20px var(--khz-primary); }
            50% { text-shadow: 0 0 20px var(--khz-primary-hover), 0 0 40px var(--khz-primary-hover); }
        }
        @keyframes hueShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .khz-splash { 
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background: #111118; display: flex; justify-content: center; align-items: center; 
            z-index: 999999; color: var(--khz-primary); font-size: 52px; font-family: 'Poppins', sans-serif; 
            font-weight: 600; transition: opacity 1s ease; animation: splash-glow 3s infinite ease-in-out;
        }
        .khz-splash.fadeout { animation: fadeOut 1s ease forwards; }
        .khz-toggle {
            position: fixed; bottom: 20px; left: 20px; width: 48px; height: 48px;
            background: var(--khz-surface); border: 1px solid var(--khz-border); border-radius: 50%;
            display: flex; align-items: center; justify-content: center; cursor: pointer;
            z-index: 100000; color: var(--khz-text); font-size: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease; backdrop-filter: blur(10px);
        }
        .khz-toggle:hover { background: var(--khz-primary); color: #111; transform: scale(1.1) rotate(15deg); }
        .khz-panel {
            position: fixed; top: 80px; left: 80px; width: 340px;
            background: var(--khz-bg); border-radius: 18px;
            border: 1px solid var(--khz-border); padding: 0;
            z-index: 99999; color: var(--khz-text); font-family: 'Poppins', sans-serif;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);
            cursor: grab; display: none; animation: fadeIn 0.4s ease; overflow: hidden;
        }
        .khz-header {
            padding: 20px 24px; background: rgba(0,0,0,0.15);
            display: flex; justify-content: space-between; align-items: center;
        }
        .khz-title { font-weight: 600; font-size: 22px; color: #fff; }
        .khz-version { font-size: 12px; font-weight: 500; color: var(--khz-text-muted); padding: 4px 8px; background: rgba(0,0,0,0.2); border-radius: 8px;}
        .khz-tabs { display: flex; padding: 12px 24px 0 24px; border-bottom: 1px solid var(--khz-border); }
        .khz-tab {
            padding: 8px 16px; cursor: pointer; color: var(--khz-text-muted);
            font-weight: 500; font-size: 14px; border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }
        .khz-tab:hover { color: var(--khz-primary-hover); }
        .khz-tab.active { color: var(--khz-primary); border-bottom-color: var(--khz-primary); }
        .khz-tab-content { padding: 20px 24px; display: none; animation: fadeIn 0.3s; }
        .khz-tab-content.active { display: block; }
        .khz-button {
            display: flex; align-items: center; gap: 12px; width: 100%;
            margin: 8px 0; padding: 12px; background: var(--khz-surface);
            color: var(--khz-text); border: 1px solid var(--khz-border);
            border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500;
            transition: all 0.2s ease-in-out; text-align: left;
        }
        .khz-button:hover { border-color: var(--khz-primary); background: rgba(139, 0, 0, 0.1); }
        .khz-button.active {
            background: var(--khz-primary); color: #1A1B26; border-color: var(--khz-primary);
            font-weight: 600;
        }
        .khz-button.active .khz-icon { stroke: #1A1B26; }
        .khz-icon { width: 20px; height: 20px; stroke: var(--khz-text-muted); transition: all 0.2s; flex-shrink: 0; }
        .khz-button:hover .khz-icon { stroke: var(--khz-primary-hover); }
        .khz-input-group { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--khz-border); }
        .khz-input-group label {
            display: flex; justify-content: space-between; align-items: center;
            font-size: 14px; color: var(--khz-text); margin-bottom: 10px; font-weight: 500;
        }
        #khz-speed-value { font-weight: 600; color: var(--khz-primary); }
        input[type="range"] {
            -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
            background: var(--khz-surface); border-radius: 3px; outline: none;
            border: 1px solid var(--khz-border);
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
            background: var(--khz-primary); border-radius: 50%; cursor: pointer;
            transition: background 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover { background: var(--khz-primary-hover); }
        .khz-footer {
            display: flex; justify-content: space-between; align-items: center; padding: 12px 24px;
            background: rgba(0,0,0,0.15); border-top: 1px solid var(--khz-border);
            font-size: 12px; color: var(--khz-text-muted);
        }
        .khz-footer a { color: var(--khz-primary); text-decoration: none; transition: color 0.3s; font-weight: 500; }
        .khz-footer a:hover { color: var(--khz-primary-hover); }
        .khz-toast {
            position: fixed; bottom: 20px; right: 20px; background: var(--khz-surface);
            color: var(--khz-text); border-radius: 12px; padding: 16px 22px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);
            font-size: 14px; font-family: 'Poppins', sans-serif; z-index: 999999;
            transition: all 0.3s ease; border: 1px solid var(--khz-border);
            animation: fadeIn 0.3s ease;
        }
        
        /* Novos estilos para o menu atualizado */
        .khz-section-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--khz-primary);
            margin: 20px 0 10px 0;
            padding-bottom: 6px;
            border-bottom: 1px solid var(--khz-border);
            letter-spacing: 0.5px;
        }

        .khz-about-content {
            padding: 16px 0;
        }

        .khz-about-content h3 {
            font-size: 22px;
            margin-bottom: 16px;
            color: #fff;
            font-weight: 600;
        }

        .khz-about-content p {
            color: var(--khz-text-muted);
            line-height: 1.6;
            font-size: 14px;
            margin-bottom: 24px;
        }

        .khz-features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 16px;
            margin: 20px 0;
        }

        .khz-feature-card {
            background: var(--khz-surface);
            border: 1px solid var(--khz-border);
            border-radius: 12px;
            padding: 14px;
            transition: all 0.3s ease;
        }

        .khz-feature-card:hover {
            transform: translateY(-3px);
            border-color: var(--khz-primary);
            box-shadow: 0 5px 15px rgba(69, 0, 140, 0.2);
        }

        .khz-feature-icon {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .khz-feature-card h4 {
            font-size: 15px;
            margin: 8px 0;
            color: #fff;
            font-weight: 500;
        }

        .khz-feature-card p {
            font-size: 12px;
            margin: 0;
            color: var(--khz-text-muted);
        }

        .khz-social-links {
            display: flex;
            flex-direction: column;
            gap: 14px;
            margin: 24px 0;
        }

        .khz-social-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 18px;
            background: var(--khz-surface);
            border: 1px solid var(--khz-border);
            border-radius: 14px;
            color: var(--khz-text);
            text-decoration: none;
            transition: all 0.25s ease;
            font-weight: 500;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .khz-social-btn:hover {
            background: var(--khz-primary);
            color: #1A1B26;
            border-color: var(--khz-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(69, 0, 140, 0.25);
        }

        .khz-social-btn .khz-icon {
            width: 22px;
            height: 22px;
        }

        .khz-credits {
            text-align: center;
            margin-top: 24px;
            font-size: 14px;
            color: var(--khz-text-muted);
            padding-top: 16px;
            border-top: 1px solid var(--khz-border);
        }

        .khz-credits a {
            color: var(--khz-primary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }

        .khz-credits a:hover {
            color: var(--khz-primary-hover);
        }

        .khz-credits-small {
            font-size: 12px;
            margin-top: 6px;
            color: var(--khz-text-muted);
            font-weight: 400;
        }

        .khz-footer-left {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .khz-version-tag {
            background: rgba(69, 0, 140, 0.2);
            color: var(--khz-primary);
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            .khz-panel { width: calc(100vw - 40px); max-width: 340px; left: 20px; top: 20px; transform: none; }
            .khz-toast { width: calc(100vw - 40px); left: 20px; bottom: 20px; right: 20px; }
        }
    `;
    document.head.appendChild(style);

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
                                            sendToast("Resposta revelada!");
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
                        "Feito por [@bakai](  https://github.com/KilluaWq  )!",
                        "Créditos para [@bakai](https://github.com/KilluaWq  ) :)",
                        "Acesse o GitHub do [@bakai](https://github.com/KilluaWq  )!",
                        "Entre no nosso Discord: [Eclipse](https://discord.gg/QAm62DDJ  )!",
                        "Eclipse sempre em frente"
                    ];
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
                    itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "✅", correct: true }, { content: "❌ (não clica aqui animal)", correct: false }] } } };
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    sendToast("Questão modificada!");
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
            const fpsCounter = document.getElementById("khz-fps-counter");
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
    splash.className = "khz-splash";
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
                toggleBtn.innerHTML = "🌙";
                toggleBtn.className = "khz-toggle";
                toggleBtn.onclick = () => {
                    const p = document.getElementById("khz-panel");
                    if (p) p.style.display = p.style.display === "none" ? "block" : "none";
                };
                document.body.appendChild(toggleBtn);
                
                const panel = document.createElement("div");
                panel.id = "khz-panel";
                panel.className = "khz-panel";
                panel.innerHTML = `
                    <div class="khz-header">
                        <div class="khz-title">Eclipse Lunar</div>
                        <div class="khz-version">v2.0</div>
                    </div>
                    <div class="khz-tabs">
                        <div class="khz-tab active" data-tab="features">Recursos</div>
                        <div class="khz-tab" data-tab="appearance">Personalização</div>
                        <div class="khz-tab" data-tab="about">Sobre</div>
                    </div>
                    <div id="khz-tab-features" class="khz-tab-content active">
                        <div class="khz-section-title">Automação Inteligente</div>
                        <button id="khz-btn-auto" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><span>Resposta Automática</span></button>
                        
                        <div class="khz-section-title">Segurança Acadêmica</div>
                        <button id="khz-btn-reveal" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg><span>Revelar Respostas</span></button>
                        <button id="khz-btn-question" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Modificar Questões</span></button>
                        <button id="khz-btn-video" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span>Modificar Vídeos</span></button>
                        
                        <div class="khz-input-group">
                            <label for="khz-input-speed">Velocidade de Resposta <span id="khz-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span></label>
                            <input type="range" id="khz-input-speed" value="${config.autoAnswerDelay}" step="0.1" min="1.5" max="2.5">
                        </div>
                    </div>
                    <div id="khz-tab-appearance" class="khz-tab-content">
                        <div class="khz-section-title">Tema Visual</div>
                        <button id="khz-btn-dark" class="khz-button active"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg><span>Modo Escuro</span></button>
                        
                        <div class="khz-section-title">Personalização Avançada</div>
                        <button id="khz-btn-rgb" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg><span>Logo RGB Dinâmico</span></button>
                        <button id="khz-btn-oneko" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6.13a15.42,15.42,0,0,1,2.91-9.5,1,1,0,0,1,1.82.94,13.49,13.49,0,00-1.6,9.41,1,1,0,0,1-.6,1,1,1,0,0,1-1.12-.39,12.54,12.54,0,0,1-1.41-5.55,1,1,0,0,1,1-1.11,1,1,0,0,1,1.12-.39,12.63,12.63,0,0,1,5.55,1.41,1,1,0,0,1,.39,1.12,1,1,0,0,1-1,.6,13.49,13.49,0,00-9.41,1.6,1,1,0,0,1-.94-1.82,15.42,15.42,0,0,1,9.5-2.91V15a1,1,0,0,1,2,0,13,13,0,0,0,0,2,1,1,0,0,1-2,0Z"/></svg><span>Oneko Gatinho</span></button>
                    </div>
                    <div id="khz-tab-about" class="khz-tab-content">
                        <div class="khz-about-content">
                            <h3>Eclipse Lunar v2.0</h3>
                            <p>Sistema avançado de automação e personalização para Khan Academy, projetado para melhorar sua experiência de aprendizado.</p>
                            
                            <div class="khz-features-grid">
                                <div class="khz-feature-card">
                                    <div class="khz-feature-icon">⚡</div>
                                    <h4>Automação Inteligente</h4>
                                    <p>Respostas automáticas com controle de velocidade ajustável</p>
                                </div>
                                <div class="khz-feature-card">
                                    <div class="khz-feature-icon">🔍</div>
                                    <h4>Segurança Acadêmica</h4>
                                    <p>Revelação de respostas e modificação de conteúdo</p>
                                </div>
                                <div class="khz-feature-card">
                                    <div class="khz-feature-icon">🎨</div>
                                    <h4>Personalização Completa</h4>
                                    <p>Modo escuro, efeitos visuais e animações exclusivas</p>
                                </div>
                            </div>
                            
                            <div class="khz-social-links">
                                <a href="https://discord.gg/QAm62DDJ" target="_blank" class="khz-social-btn">
                                    <svg class="khz-icon" viewBox="0 0 24 24"><path d="M20.317 4.36994C18.717 3.61994 17.047 3.07994 15.317 2.77994C15.057 3.25994 14.707 3.93994 14.477 4.39994C12.677 3.98994 10.847 3.98994 9.04703 4.39994C8.81703 3.93994 8.46703 3.25994 8.21703 2.77994C6.47703 3.07994 4.81703 3.61994 3.21703 4.36994C0.247028 9.32994 1.07703 14.73 3.72703 19.45L5.12703 18.44C3.75703 17.46 2.63703 16.17 1.84703 14.68C3.49703 15.65 5.24703 16.27 7.04703 16.52C7.30703 16.08 7.60703 15.57 7.87703 15.08C6.12703 14.18 4.66703 12.79 3.63703 11.1C3.89703 11.04 4.15703 10.96 4.40703 10.87C8.03703 12.6 11.997 12.6 15.597 10.87C15.847 10.96 16.107 11.04 16.367 11.1C15.337 12.79 13.877 14.18 12.127 15.08C12.397 15.57 12.697 16.08 12.957 16.52C14.757 16.27 16.507 15.65 18.157 14.68C17.367 16.17 16.247 17.46 14.877 18.44L16.277 19.45C18.927 14.73 19.757 9.32994 20.317 4.36994ZM8.57703 13.25C7.35703 13.25 6.37703 12.03 6.37703 10.51C6.37703 8.99994 7.35703 7.77994 8.57703 7.77994C9.79703 7.77994 10.777 8.99994 10.777 10.51C10.777 12.03 9.79703 13.25 8.57703 13.25ZM15.417 13.25C14.197 13.25 13.217 12.03 13.217 10.51C13.217 8.99994 14.197 7.77994 15.417 7.77994C16.637 7.77994 17.617 8.99994 17.617 10.51C17.617 12.03 16.637 13.25 15.417 13.25Z" fill="currentColor"/></svg>
                                    <span>Comunidade Discord</span>
                                </a>
                                <a href="https://github.com/KilluaWq" target="_blank" class="khz-social-btn">
                                    <svg class="khz-icon" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/></svg>
                                    <span>Repositório GitHub</span>
                                </a>
                            </div>
                            
                            <div class="khz-credits">
                                <p>Desenvolvido com ❤ por <a href="https://github.com/KilluaWq" target="_blank">@bakai</a></p>
                                <p class="khz-credits-small">Eclipse Lunar - Sempre à frente da curva</p>
                            </div>
                        </div>
                    </div>
                    <div class="khz-footer">
                        <div class="khz-footer-left">
                            <a href="https://discord.gg/QAm62DDJ" target="_blank">Eclipse Lunar</a>
                            <span class="khz-version-tag">v2.0</span>
                        </div>
                        <span id="khz-fps-counter">FPS: ...</span>
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
                
                setupToggleButton('khz-btn-auto', 'autoAnswer');
                setupToggleButton('khz-btn-question', 'questionSpoof');
                setupToggleButton('khz-btn-video', 'videoSpoof');
                setupToggleButton('khz-btn-reveal', 'revealAnswers');
                setupToggleButton('khz-btn-dark', 'darkMode', (isActive) => {
                    if (typeof DarkReader === 'undefined') return;
                    isActive ? DarkReader.enable() : DarkReader.disable();
                });
                setupToggleButton('khz-btn-rgb', 'rgbLogo', toggleRgbLogo);
                setupToggleButton('khz-btn-oneko', 'oneko', toggleOnekoJs);

                const speedInput = document.getElementById('khz-input-speed');
                const speedValue = document.getElementById('khz-speed-value');
                if (speedInput && speedValue) {
                    speedInput.addEventListener('input', () => {
                        const newDelay = parseFloat(speedInput.value);
                        config.autoAnswerDelay = newDelay;
                        speedValue.textContent = `${newDelay.toFixed(1)}s`;
                    });
                }
                
                document.querySelectorAll('.khz-tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        document.querySelectorAll('.khz-tab, .khz-tab-content').forEach(el => el.classList.remove('active'));
                        tab.classList.add('active');
                        document.getElementById(`khz-tab-${tab.dataset.tab}`).classList.add('active');
                    });
                });

                function toggleRgbLogo(isActive) {
                    const khanLogo = document.querySelector('path[fill="#14bf96"]');
                    if (!khanLogo) return sendToast("❌ Logo do Khan Academy não encontrada.");
                    khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
                }

                function toggleOnekoJs(isActive) {
                    if (isActive) {
                        if (!document.getElementById("oneko")) {
                            oneko();
                            sendToast("🐱 Gatinho ativado!");
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
                    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a") || e.target.closest(".khz-tab")) return;
                    dragging = true;
                    const touch = e.touches ? e.touches[0] : null;
                    const clientX = touch ? touch.clientX : e.clientX;
                    const clientY = touch ? touch.clientY : e.clientY;
                    offsetX = clientX - panel.offsetLeft;
                    offsetY = clientY - panel.offsetTop;
                    panel.style.cursor = "grabbing";
                };
                const onDrag = (e) => {
                    if (dragging) {
                        e.preventDefault();
                        const touch = e.touches ? e.touches[0] : null;
                        const clientX = touch ? touch.clientX : e.clientX;
                        const clientY = touch ? touch.clientY : e.clientY;
                        panel.style.left = `${clientX - offsetX}px`;
                        panel.style.top = `${clientY - offsetY}px`;
                    }
                };
                const endDrag = () => { dragging = false; panel.style.cursor = "grab"; };

                panel.addEventListener("mousedown", startDrag);
                document.addEventListener("mousemove", onDrag);
                document.addEventListener("mouseup", endDrag);
                panel.addEventListener("touchstart", startDrag, { passive: false });
                document.addEventListener("touchmove", onDrag, { passive: false });
                document.addEventListener("touchend", endDrag);
            }, 1000);
        }, 2000);
    })();
})();

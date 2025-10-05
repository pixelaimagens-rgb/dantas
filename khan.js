(function() {
    if (document.getElementById("eclipse-panel")) return;
    
    const features = {
        autoAnswer: false,
        revealAnswers: false,
        questionSpoof: false,
        videoSpoof: false,
        darkMode: true,
        rgbLogo: false
    };

    const config = {
        autoAnswerDelay: 1.5
    };

    function showToast(message, type = "info", duration = 3000) {
        const toast = document.createElement("div");
        toast.className = `eclipse-toast ${type}`;
        toast.innerHTML = `<div>${message}</div>`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const style = document.createElement("style");
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        :root {
            --bg: #1a1b26;
            --surface: #242532;
            --border: #3a3b4b;
            --primary: #7257ff;
            --text: #e6e6ff;
            --text-muted: #a0a0c0;
        }
        
        .eclipse-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0f121c, #1a1b26);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            color: white;
            font-family: 'Inter', sans-serif;
        }
        
        .eclipse-splash-title {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 12px;
            background: linear-gradient(to right, #7257ff, #43d9ad);
            -webkit-background-clip: text;
            background-clip: text;
        }
        
        .eclipse-splash-loader {
            width: 60px;
            height: 60px;
            position: relative;
            margin: 30px 0;
        }
        
        .eclipse-splash-loader-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-top-color: #7257ff;
            border-radius: 50%;
            animation: orbit 1.5s linear infinite;
        }
        
        .eclipse-splash-loader-ring:nth-child(2) {
            border-top-color: #43d9ad;
            animation-duration: 2.5s;
            transform: rotate(60deg);
        }
        
        .eclipse-splash-loader-ring:nth-child(3) {
            border-top-color: rgba(114, 87, 255, 0.5);
            animation-duration: 3.5s;
            transform: rotate(120deg);
        }
        
        @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .eclipse-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            max-width: 320px;
            width: calc(100vw - 48px);
            background: #242532;
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            z-index: 999999;
            opacity: 1;
            transform: translateY(0);
            border-left: 3px solid #7257ff;
            transition: opacity 0.3s;
        }
        
        .eclipse-toast.info {
            border-left-color: #7257ff;
        }
        
        .eclipse-toast.success {
            border-left-color: #43d9ad;
        }
        
        .eclipse-toast.error {
            border-left-color: #ff6b6b;
        }
        
        .eclipse-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #0f121c, #1a1b26);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99999;
            color: white;
            font-size: 28px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .eclipse-toggle:hover {
            transform: scale(1.08);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        
        .eclipse-panel {
            position: fixed;
            top: 120px;
            right: 40px;
            width: 360px;
            max-height: 75vh;
            background: linear-gradient(135deg, #0f121c, #1a1b26);
            border-radius: 16px;
            border: 1px solid #3a3b4b;
            z-index: 99999;
            color: #e6e6ff;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            display: none;
            overflow: hidden;
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
            background: linear-gradient(to right, #7257ff, #43d9ad);
            -webkit-background-clip: text;
            background-clip: text;
        }
        
        .eclipse-tabs {
            display: flex;
            padding: 0 8px;
            margin: 0 16px;
            border-radius: 10px;
            background: transparent;
            overflow: hidden;
            border: 1px solid #3a3b4b;
        }
        
        .eclipse-tab {
            flex: 1;
            padding: 14px 0;
            cursor: pointer;
            color: #a0a0c0;
            font-weight: 500;
            font-size: 14px;
            text-align: center;
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
            background: #7257ff;
            border-radius: 3px;
        }
        
        .eclipse-tab-content {
            padding: 16px;
            display: none;
        }
        
        .eclipse-tab-content.active {
            display: block;
        }
        
        .eclipse-button {
            width: 100%;
            padding: 16px;
            background: transparent;
            color: #e6e6ff;
            border: 1px solid #3a3b4b;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            text-align: left;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 14px;
        }
        
        .eclipse-button:hover {
            border-color: #7257ff;
        }
        
        .eclipse-button.active {
            background: rgba(114, 87, 255, 0.15);
            border-color: #7257ff;
            color: white;
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
        }
        
        .eclipse-input-group {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #3a3b4b;
        }
        
        .eclipse-input-label {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #a0a0c0;
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .eclipse-speed-value {
            font-weight: 600;
            color: #7257ff;
        }
        
        .eclipse-range {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: #242532;
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        }
        
        .eclipse-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            border: 2px solid #7257ff;
            cursor: pointer;
            margin-top: -9px;
        }
        
        .eclipse-range-track {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(90deg, #7257ff, #43d9ad);
        }
        
        .eclipse-footer {
            padding: 16px;
            border-top: 1px solid #3a3b4b;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: #a0a0c0;
        }
        
        .eclipse-footer a {
            color: #7257ff;
            text-decoration: none;
        }
        
        @media (max-width: 768px) {
            .eclipse-panel {
                width: calc(100vw - 48px);
                top: auto;
                bottom: 90px;
                right: 24px;
                max-height: 70vh;
            }
            
            .eclipse-toggle {
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
            }
        }
    `;
    document.head.appendChild(style);

    JSON.parse = new Proxy(JSON.parse, {
        apply: function(target, thisArg, args) {
            let data = target.apply(thisArg, args);
            if (features.revealAnswers && data?.data) {
                try {
                    Object.values(data.data).forEach(val => {
                        if (val?.item?.itemData) {
                            let itemData = JSON.parse(val.item.itemData);
                            if (itemData.question?.widgets) {
                                Object.values(itemData.question.widgets).forEach(widget => {
                                    if (widget.options?.choices) {
                                        widget.options.choices.forEach(choice => {
                                            if (choice.correct) {
                                                choice.content = "✅ " + choice.content;
                                            }
                                        });
                                    }
                                });
                                val.item.itemData = JSON.stringify(itemData);
                            }
                        }
                    });
                    showToast("Respostas reveladas", "success", 2000);
                } catch (e) {}
            }
            return data;
        }
    });

    window.fetch = new Proxy(window.fetch, {
        apply: async function(target, thisArg, args) {
            const response = await target.apply(thisArg, args);
            if (features.questionSpoof && response.ok) {
                const cloned = response.clone();
                try {
                    const data = await cloned.json();
                    if (data?.data?.assessmentItem?.item?.itemData) {
                        const phrases = [
                            "🚀 Feito por [@bakai](https://github.com/KilluaWq)",
                            "💫 Créditos para [@bakai](https://github.com/KilluaWq)",
                            "🌌 Entre no nosso Discord: [Eclipse](https://discord.gg/QAm62DDJ)"
                        ];
                        
                        let itemData = JSON.parse(data.data.assessmentItem.item.itemData);
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
                        
                        data.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        showToast("Questão modificada", "success", 2000);
                        return new Response(JSON.stringify(data), {
                            status: 200,
                            headers: response.headers
                        });
                    }
                } catch (e) {}
            }
            return response;
        }
    });

    (async function() {
        const splash = document.createElement("div");
        splash.className = "eclipse-splash";
        splash.innerHTML = `
            <div>
                <div class="eclipse-splash-title">Eclipse Lunar</div>
                <div class="eclipse-splash-loader">
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                </div>
            </div>
        `;
        document.body.appendChild(splash);
        
        await delay(1500);
        document.body.removeChild(splash);
        
        const toggleBtn = document.createElement("div");
        toggleBtn.className = "eclipse-toggle";
        toggleBtn.textContent = "☰";
        document.body.appendChild(toggleBtn);
        
        const panel = document.createElement("div");
        panel.id = "eclipse-panel";
        panel.className = "eclipse-panel";
        panel.innerHTML = `
            <div class="eclipse-header">
                <div class="eclipse-title">Eclipse Lunar</div>
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
                    <div class="eclipse-range-container">
                        <input type="range" class="eclipse-range" id="eclipse-speed" value="${config.autoAnswerDelay}" min="1.5" max="2.5" step="0.1">
                        <div class="eclipse-range-track" style="width: ${((config.autoAnswerDelay - 1.5) / 1) * 100}%"></div>
                    </div>
                </div>
            </div>
            <div id="eclipse-tab-visual" class="eclipse-tab-content">
                <button id="eclipse-btn-dark" class="eclipse-button active">
                    <span class="eclipse-icon">🌓</span>
                    <span>Modo Escuro</span>
                </button>
                <button id="eclipse-btn-rgb" class="eclipse-button">
                    <span class="eclipse-icon">🎨</span>
                    <span>Logo RGB</span>
                </button>
            </div>
            <div id="eclipse-tab-about" class="eclipse-tab-content">
                <div style="padding: 8px 0;">
                    <p style="color: #a0a0c0; line-height: 1.6; margin-bottom: 20px;">
                        Sistema de automação para Khan Academy.
                    </p>
                    
                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #3a3b4b; font-size: 13px; color: #a0a0c0;">
                        Desenvolvido por <a href="https://github.com/KilluaWq" target="_blank" style="color: #7257ff;">@bakai</a><br>
                        Eclipse Lunar • Sempre à frente
                    </div>
                </div>
            </div>
            <div class="eclipse-footer">
                <a href="https://discord.gg/QAm62DDJ" target="_blank">Comunidade Eclipse</a>
            </div>
        `;
        document.body.appendChild(panel);

        // Funções de controle
        const setupButton = (id, feature, callback) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            
            btn.addEventListener('click', () => {
                features[feature] = !features[feature];
                btn.classList.toggle('active', features[feature]);
                
                if (callback) callback(features[feature]);
                
                const text = btn.querySelector('span:last-child').textContent;
                const status = features[feature] ? "ativado" : "desativado";
                showToast(`${text} ${status}`, features[feature] ? "success" : "info");
            });
        };

        setupButton('eclipse-btn-auto', 'autoAnswer');
        setupButton('eclipse-btn-reveal', 'revealAnswers');
        setupButton('eclipse-btn-question', 'questionSpoof');
        setupButton('eclipse-btn-video', 'videoSpoof');
        setupButton('eclipse-btn-dark', 'darkMode', (isActive) => {
            // Não vou adicionar o DarkReader pra simplificar
        });
        setupButton('eclipse-btn-rgb', 'rgbLogo', (isActive) => {
            const logo = document.querySelector('path[fill="#14bf96"]');
            if (logo) {
                logo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
            }
        });

        // Controle de velocidade
        const speedInput = document.getElementById('eclipse-speed');
        const speedValue = document.querySelector('.eclipse-speed-value');
        const rangeTrack = document.querySelector('.eclipse-range-track');
        
        if (speedInput && speedValue && rangeTrack) {
            const updateSpeed = () => {
                const value = parseFloat(speedInput.value);
                speedValue.textContent = `${value.toFixed(1)}s`;
                rangeTrack.style.width = `${((value - 1.5) / 1) * 100}%`;
            };
            
            speedInput.addEventListener('input', updateSpeed);
            speedInput.addEventListener('change', () => {
                config.autoAnswerDelay = parseFloat(speedInput.value);
                showToast(`Velocidade: ${config.autoAnswerDelay.toFixed(1)}s`, "info", 1500);
            });
        }

        // Abas
        document.querySelectorAll('.eclipse-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.eclipse-tab, .eclipse-tab-content').forEach(el => {
                    el.classList.remove('active');
                });
                tab.classList.add('active');
                document.getElementById(`eclipse-tab-${tab.dataset.tab}`).classList.add('active');
            });
        });

        // Toggle do menu
        toggleBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });

        // Loop de resposta automática
        setInterval(async () => {
            if (features.autoAnswer) {
                ['[data-testid="choice-icon__library-choice-icon"]',
                 '[data-testid="exercise-check-answer"]',
                 '[data-testid="exercise-next-question"]']
                .forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) el.click();
                });
            }
        }, config.autoAnswerDelay * 1000);
    })();
})();

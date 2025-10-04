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
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Exo+2:wght@300;400;600&display=swap');
        :root {
            --khz-bg: radial-gradient(circle at 30% 30%, #0a0e17 0%, #050710 100%);
            --khz-surface: rgba(15, 20, 35, 0.85);
            --khz-border: rgba(100, 150, 255, 0.15);
            --khz-primary: #6c5ce7;
            --khz-primary-hover: #a29bfe;
            --khz-accent: #00cec9;
            --khz-text: #f5f6fa;
            --khz-text-muted: #a2a9bb;
            --khz-stars: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 3c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm54-63c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-3 50c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-52 2c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm24 12c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%236c5ce7' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(15px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); } }
        @keyframes stars { 0% { background-position: 0 0; } 100% { background-position: 10px 10px; } }
        @keyframes hueShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        
        .khz-splash { 
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background: linear-gradient(135deg, #0a0e17 0%, #050710 100%);
            display: flex; justify-content: center; align-items: center; 
            z-index: 999999; color: #6c5ce7; font-size: 52px; font-family: 'Orbitron', sans-serif; 
            font-weight: 700; transition: opacity 1s ease;
            text-shadow: 0 0 20px rgba(108, 92, 231, 0.7);
            letter-spacing: 3px;
            overflow: hidden;
        }
        
        .khz-splash::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: var(--khz-stars);
            opacity: 0.5;
            z-index: -1;
            animation: stars 20s linear infinite;
        }
        
        .khz-splash::after {
            content: "";
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: radial-gradient(#fff, #6c5ce7, transparent);
            box-shadow: 0 0 60px 20px rgba(108, 92, 231, 0.5);
            animation: pulse 3s infinite;
            z-index: -1;
        }
        
        .khz-splash.fadeout { 
            animation: fadeOut 1s ease forwards; 
            opacity: 0 !important;
        }
        
        .khz-toggle {
            position: fixed; bottom: 20px; left: 20px; width: 60px; height: 60px;
            background: var(--khz-surface); border: 1px solid var(--khz-border); border-radius: 50%;
            display: flex; align-items: center; justify-content: center; cursor: pointer;
            z-index: 100000; color: var(--khz-primary); font-size: 32px;
            box-shadow: 0 0 20px rgba(108, 92, 231, 0.3);
            font-family: 'Orbitron', sans-serif;
            transition: all 0.4s ease; backdrop-filter: blur(5px);
            overflow: hidden;
        }
        
        .khz-toggle::before {
            content: "";
            position: absolute;
            width: 120%;
            height: 120%;
            background: var(--khz-stars);
            opacity: 0.2;
            z-index: -1;
        }
        
        .khz-toggle:hover { 
            transform: scale(1.15) rotate(10deg); 
            box-shadow: 0 0 30px rgba(108, 92, 231, 0.5);
            background: rgba(20, 25, 45, 0.95);
        }
        
        .khz-panel {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 380px; height: 520px;
            background: var(--khz-bg);
            border-radius: 24px;
            border: 1px solid var(--khz-border);
            padding: 0;
            z-index: 99999; color: var(--khz-text); 
            font-family: 'Exo 2', sans-serif;
            box-shadow: 0 0 40px rgba(108, 92, 231, 0.25);
            backdrop-filter: blur(10px);
            display: none; animation: fadeIn 0.5s ease;
            overflow: hidden;
            transition: all 0.4s ease;
        }
        
        .khz-panel::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: var(--khz-stars);
            opacity: 0.15;
            pointer-events: none;
            z-index: 0;
        }
        
        .khz-header {
            padding: 25px 30px 15px 30px; 
            position: relative;
            z-index: 1;
        }
        
        .khz-title {
            font-family: 'Orbitron', sans-serif;
            font-weight: 700; 
            font-size: 28px; 
            color: #fff;
            text-shadow: 0 0 10px rgba(108, 92, 231, 0.5);
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .khz-title::after {
            content: "";
            position: absolute;
            bottom: 15px;
            left: 30px;
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, transparent, var(--khz-primary), transparent);
            border-radius: 3px;
        }
        
        .khz-title-icon {
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--khz-primary), #00cec9);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            animation: pulse 3s infinite;
        }
        
        .khz-tabs {
            display: flex; 
            padding: 0 30px;
            position: relative;
            z-index: 1;
        }
        
        .khz-tab {
            padding: 12px 0; 
            cursor: pointer; 
            color: var(--khz-text-muted);
            font-weight: 500; 
            font-size: 16px;
            width: 33.33%;
            text-align: center;
            position: relative;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .khz-tab:hover {
            color: var(--khz-primary-hover);
        }
        
        .khz-tab.active {
            color: var(--khz-primary);
            font-weight: 600;
        }
        
        .khz-tab.active::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 3px;
            background: var(--khz-primary);
            border-radius: 3px;
            animation: fadeIn 0.3s;
        }
        
        .khz-tab-content {
            padding: 20px 30px; 
            display: none; 
            animation: fadeIn 0.3s; 
            height: calc(100% - 140px);
            overflow-y: auto;
        }
        
        .khz-tab-content.active {
            display: block;
        }
        
        /* Custom scrollbar for the tab content */
        .khz-tab-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .khz-tab-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }
        
        .khz-tab-content::-webkit-scrollbar-thumb {
            background: var(--khz-primary);
            border-radius: 3px;
        }
        
        .khz-button {
            display: flex; 
            align-items: center; 
            gap: 16px; 
            width: 100%;
            margin: 12px 0;
            padding: 14px 20px;
            background: var(--khz-surface);
            color: var(--khz-text); 
            border: 1px solid var(--khz-border);
            border-radius: 16px; 
            cursor: pointer; 
            font-size: 15px; 
            font-weight: 500;
            transition: all 0.3s ease;
            text-align: left;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }
        
        .khz-button::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(108, 92, 231, 0.1), transparent);
            transform: translateX(-100%);
            z-index: -1;
        }
        
        .khz-button:hover::before {
            animation: shine 1.5s;
        }
        
        @keyframes shine {
            100% { transform: translateX(100%); }
        }
        
        .khz-button:hover {
            border-color: var(--khz-primary);
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(108, 92, 231, 0.15);
        }
        
        .khz-button.active {
            background: rgba(108, 92, 231, 0.25);
            border-color: var(--khz-primary);
            color: var(--khz-primary-hover);
            font-weight: 600;
            box-shadow: 0 0 15px rgba(108, 92, 231, 0.3);
        }
        
        .khz-button.active::after {
            content: "ATIVADO";
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(108, 92, 231, 0.3);
            color: var(--khz-primary-hover);
            font-size: 12px;
            padding: 3px 10px;
            border-radius: 20px;
            font-weight: 600;
            letter-spacing: 1px;
        }
        
        .khz-icon {
            width: 24px; 
            height: 24px; 
            min-width: 24px;
            background: var(--khz-surface);
            border: 1px solid var(--khz-border);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }
        
        .khz-button:hover .khz-icon {
            background: var(--khz-primary);
            border-color: var(--khz-primary);
            transform: scale(1.1);
        }
        
        .khz-button.active .khz-icon {
            background: var(--khz-primary);
            border-color: var(--khz-primary);
            color: white;
        }
        
        .khz-input-group { 
            margin-top: 25px; 
            padding-top: 20px; 
            border-top: 1px solid var(--khz-border); 
        }
        
        .khz-input-group label {
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            font-size: 15px; 
            color: var(--khz-text); 
            margin-bottom: 14px; 
            font-weight: 500;
        }
        
        #khz-speed-value { 
            font-weight: 600; 
            color: var(--khz-primary); 
        }
        
        input[type="range"] {
            -webkit-appearance: none; 
            appearance: none; 
            width: 100%; 
            height: 8px;
            background: var(--khz-surface); 
            border-radius: 4px; 
            outline: none;
            border: 1px solid var(--khz-border);
            position: relative;
        }
        
        input[type="range"]::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 50%;
            background: var(--khz-primary);
            border-radius: 4px;
            z-index: 1;
        }
        
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; 
            appearance: none; 
            width: 22px; 
            height: 22px;
            background: var(--khz-primary); 
            border-radius: 50%; 
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 0 10px rgba(108, 92, 231, 0.5);
            border: 3px solid #0f1423;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover { 
            background: var(--khz-accent); 
            transform: scale(1.15);
        }
        
        .khz-footer {
            display: flex; 
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 15px 30px 20px 30px;
            background: rgba(5, 7, 16, 0.7);
            border-top: 1px solid var(--khz-border);
            font-size: 13px; 
            color: var(--khz-text-muted);
            position: relative;
            z-index: 1;
        }
        
        .khz-footer a { 
            color: var(--khz-primary); 
            text-decoration: none; 
            transition: color 0.3s; 
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        
        .khz-footer a:hover { 
            color: var(--khz-primary-hover); 
        }
        
        .khz-footer .khz-fps {
            margin-top: 8px;
            font-size: 12px;
            opacity: 0.7;
        }
        
        /* Nova seção Sobre com tema espacial */
        .khz-about-content {
            text-align: center;
            padding: 10px 0 5px 0;
        }
        
        .khz-about-header {
            margin-bottom: 25px;
        }
        
        .khz-about-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 24px;
            color: var(--khz-primary);
            margin: 10px 0;
            text-shadow: 0 0 10px rgba(108, 92, 231, 0.3);
        }
        
        .khz-about-subtitle {
            color: var(--khz-text-muted);
            font-size: 14px;
            line-height: 1.6;
            max-width: 300px;
            margin: 0 auto;
        }
        
        .khz-lunar-system {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 20px auto;
        }
        
        .khz-sun {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: radial-gradient(#ffcc00, #ff9900);
            border-radius: 50%;
            box-shadow: 0 0 40px #ffcc00;
            z-index: 3;
        }
        
        .khz-earth-orbit {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 140px;
            height: 140px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }
        
        .khz-earth {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            background: radial-gradient(#1e90ff, #0066cc);
            border-radius: 50%;
            animation: orbit 20s linear infinite;
            z-index: 2;
        }
        
        .khz-moon-orbit {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 50%;
        }
        
        .khz-moon {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 15px;
            height: 15px;
            background: radial-gradient(#c0c0c0, #808080);
            border-radius: 50%;
            animation: orbit 5s linear infinite;
            z-index: 1;
        }
        
        .khz-about-features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 25px 0;
        }
        
        .khz-feature-item {
            background: var(--khz-surface);
            border: 1px solid var(--khz-border);
            border-radius: 12px;
            padding: 12px;
            transition: all 0.3s;
        }
        
        .khz-feature-item:hover {
            transform: translateY(-3px);
            border-color: var(--khz-primary);
            box-shadow: 0 5px 15px rgba(108, 92, 231, 0.1);
        }
        
        .khz-feature-icon {
            font-size: 20px;
            margin-bottom: 8px;
            color: var(--khz-primary);
        }
        
        .khz-feature-title {
            font-size: 14px;
            font-weight: 600;
            margin: 5px 0;
            color: var(--khz-text);
        }
        
        .khz-feature-desc {
            font-size: 12px;
            color: var(--khz-text-muted);
        }
        
        .khz-social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
        }
        
        .khz-social-btn {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: var(--khz-surface);
            border: 1px solid var(--khz-border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--khz-text);
            text-decoration: none;
            transition: all 0.3s;
            font-size: 20px;
        }
        
        .khz-social-btn:hover {
            background: var(--khz-primary);
            border-color: var(--khz-primary);
            transform: translateY(-3px) scale(1.1);
            box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
        }
        
        .khz-credits {
            font-size: 13px;
            color: var(--khz-text-muted);
            margin-top: 10px;
            line-height: 1.5;
        }
        
        .khz-credits a {
            color: var(--khz-primary);
            text-decoration: none;
        }
        
        .khz-credits a:hover {
            text-decoration: underline;
        }
        
        /* Novo efeito de loading para o splash */
        .khz-splash-loading {
            position: absolute;
            bottom: 30px;
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .khz-splash-loading::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 40%;
            background: var(--khz-primary);
            border-radius: 2px;
            animation: loading 2s infinite;
        }
        
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        /* Toast notification with space theme */
        .khz-toast {
            position: fixed; 
            bottom: 30px; 
            right: 30px; 
            background: rgba(15, 20, 35, 0.95);
            color: var(--khz-text); 
            border-radius: 16px; 
            padding: 18px 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(108, 92, 231, 0.3);
            backdrop-filter: blur(10px);
            font-size: 15px; 
            font-family: 'Exo 2', sans-serif; 
            z-index: 999999;
            transition: all 0.3s ease; 
            border: 1px solid var(--khz-border);
            animation: fadeIn 0.3s ease;
            border-left: 4px solid var(--khz-primary);
        }
        
        .khz-toast-message {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        @media (max-width: 768px) {
            .khz-panel { 
                width: calc(100vw - 40px); 
                max-width: 380px; 
                height: auto;
                max-height: 90vh;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .khz-toggle {
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
            }
            
            .khz-toast { 
                width: calc(100vw - 40px); 
                left: 20px; 
                bottom: 20px; 
                right: 20px;
                border-radius: 14px;
            }
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
                                            choice.content = "🚀 " + choice.content;
                                            sendToast("Resposta revelada com sucesso!");
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
                        "🚀 Missão: Eclipse Lunar ativada!",
                        "🛰️ Sistema de auxílio acadêmico online",
                        "🌌 Explorando novos horizontes do conhecimento",
                        "🔭 Sistema ativado por [@bakai](https://github.com/KilluaWq)",
                        "💫 Eclipse Lunar - Sempre à frente"
                    ];
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
                    itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "✅ Confirmar", correct: true }, { content: "❌ Cancelar", correct: false }] } } };
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    sendToast("Questão modificada com sucesso!");
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
            if (fpsCounter) fpsCounter.textContent = `🌌 ${frameCount} FPS`;
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
    splash.innerHTML = `
        <div style="text-align: center; position: relative; z-index: 2;">
            <div style="font-size: 42px; margin-bottom: 10px;">ECLIPSE LUNAR</div>
            <div style="font-size: 18px; color: var(--khz-text-muted); font-weight: 300; letter-spacing: 2px;">INICIANDO SISTEMA</div>
            <div class="khz-splash-loading"></div>
        </div>
    `;
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
                        <div class="khz-title">
                            <span class="khz-title-icon">E</span>
                            Eclipse Lunar
                        </div>
                    </div>
                    <div class="khz-tabs">
                        <div class="khz-tab active" data-tab="features">Recursos</div>
                        <div class="khz-tab" data-tab="appearance">Personalização</div>
                        <div class="khz-tab" data-tab="about">Sistema</div>
                    </div>
                    <div id="khz-tab-features" class="khz-tab-content active">
                        <button id="khz-btn-auto" class="khz-button">
                            <div class="khz-icon">🚀</div>
                            <div>
                                <div>Resposta Automática</div>
                                <div style="font-size: 12px; color: var(--khz-text-muted); margin-top: 3px;">Respostas automáticas inteligentes</div>
                            </div>
                        </button>
                        
                        <button id="khz-btn-reveal" class="khz-button">
                            <div class="khz-icon">🔍</div>
                            <div>
                                <div>Revelar Respostas</div>
                                <div style="font-size: 12px; color: var(--khz-text-muted); margin-top: 3px;">Mostrar respostas corretas</div>
                            </div>
                        </button>
                        
                        <button id="khz-btn-question" class="khz-button">
                            <div class="khz-icon">❓</div>
                            <div>
                                <div>Modificar Questões</div>
                                <div style="font-size: 12px; color: var(--khz-text-muted); margin-top: 3px;">Personalizar conteúdo das questões</div>
                            </div>
                        </button>
                        
                        <button id="khz-btn-video" class="khz-button">
                            <div class="khz-icon">🎥</div>
                            <div>
                                <div>Modificar Vídeos</div>
                                <div style="font-size: 12px; color: var(--khz-text-muted); margin-top: 3px;">Alterar conteúdo dos vídeos</div>
                            </div>
                        </button>
                        
                        <div class="khz-input-group">
                            <label for="khz-input-speed">Velocidade de Resposta <span id="khz-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span></label>
                            <input type="range" id="khz-input-speed" value="${config.autoAnswerDelay}" step="0.1" min="1.5" max="2.5">
                        </div>
                    </div>
                    <div id="khz-tab-appearance" class="khz-tab-content">
                        <button id="khz-btn-dark" class="khz-button active">
                            <div class="khz-icon">🌓</div>
                            <div>
                                <div>Modo Escuro Espacial</div>
                                <div style="font-size: 12px; color: var(--khz-text-muted); margin-top: 3px;">Tema noturno com estrelas</div>
                            </div>
                        </button>
                        
                        <button id="khz-btn-rgb" class="khz-button">
                            <div class="khz-icon">🌈</div>
                            <div>
                                <div>Logo RGB Dinâmico</div>
                                <div style="font-size: 12px; color: var(--khz-text-muted); margin-top: 3px;">Efeito arco-íris no logo</div>
                            </div>
                        </button>
                        
                        <button id="khz-btn-oneko" class="khz-button">
                            <div class="khz-icon">🐱</div>
                            <div>
                                <div>Oneko Gatinho Espacial</div>
                                <div style="font-size: 12px; color: var(--khz-text-muted); margin-top: 3px;">Gato cósmico de acompanhamento</div>
                            </div>
                        </button>
                    </div>
                    <div id="khz-tab-about" class="khz-tab-content">
                        <div class="khz-about-content">
                            <div class="khz-about-header">
                                <div class="khz-about-title">ECLIPSE LUNAR v2.1</div>
                                <div class="khz-about-subtitle">Sistema de auxílio acadêmico de última geração, projetado para explorar novos horizontes do conhecimento.</div>
                            </div>
                            
                            <div class="khz-lunar-system">
                                <div class="khz-sun"></div>
                                <div class="khz-earth-orbit"></div>
                                <div class="khz-earth"></div>
                                <div class="khz-moon-orbit"></div>
                                <div class="khz-moon"></div>
                            </div>
                            
                            <div class="khz-about-features">
                                <div class="khz-feature-item">
                                    <div class="khz-feature-icon">🚀</div>
                                    <div class="khz-feature-title">Automação Inteligente</div>
                                    <div class="khz-feature-desc">Respostas rápidas e precisas com controle total</div>
                                </div>
                                <div class="khz-feature-item">
                                    <div class="khz-feature-icon">🔭</div>
                                    <div class="khz-feature-title">Segurança Acadêmica</div>
                                    <div class="khz-feature-desc">Revelação discreta de respostas</div>
                                </div>
                                <div class="khz-feature-item">
                                    <div class="khz-feature-icon">🌌</div>
                                    <div class="khz-feature-title">Interface Cósmica</div>
                                    <div class="khz-feature-desc">Design imersivo com tema espacial</div>
                                </div>
                                <div class="khz-feature-item">
                                    <div class="khz-feature-icon">🛸</div>
                                    <div class="khz-feature-title">Modo Furtivo</div>
                                    <div class="khz-feature-desc">Funciona sem deixar rastros</div>
                                </div>
                            </div>
                            
                            <div class="khz-social-links">
                                <a href="https://discord.gg/QAm62DDJ" target="_blank" class="khz-social-btn">💬</a>
                                <a href="https://github.com/KilluaWq" target="_blank" class="khz-social-btn">🐙</a>
                            </div>
                            
                            <div class="khz-credits">
                                Desenvolvido com ❤ por <a href="https://github.com/KilluaWq" target="_blank">@bakai</a><br>
                                Eclipse Lunar v2.1 • Sistema de auxílio acadêmico
                            </div>
                        </div>
                    </div>
                    <div class="khz-footer">
                        <a href="https://discord.gg/QAm62DDJ" target="_blank">
                            <span>🌌 Comunidade Eclipse Lunar</span>
                        </a>
                        <div class="khz-fps" id="khz-fps-counter">🌌 ... FPS</div>
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
                            sendToast("🐱 Gatinho cósmico ativado!");
                        }
                    } else {
                        const onekoEl = document.getElementById("oneko");
                        if (onekoEl) {
                            clearInterval(window.onekoInterval);
                            onekoEl.remove();
                        }
                    }
                }
                
                // Adiciona um pequeno efeito de estrelas no fundo do painel
                const starsBg = document.createElement('div');
                starsBg.style.position = 'fixed';
                starsBg.style.top = '0';
                starsBg.style.left = '0';
                starsBg.style.width = '100%';
                starsBg.style.height = '100%';
                starsBg.style.backgroundImage = 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px)';
                starsBg.style.backgroundSize = '550px 550px';
                starsBg.style.zIndex = '-1';
                starsBg.style.opacity = '0.3';
                panel.appendChild(starsBg);
            }, 2500);
        }, 3000);
    })();
})();

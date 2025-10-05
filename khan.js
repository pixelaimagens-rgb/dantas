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
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(114, 87, 255, 0.4); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(114, 87, 255, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(114, 87, 255, 0); }
        }
        
        @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        @keyframes buttonPulse {
            0% { box-shadow: 0 0 0 0 rgba(114, 87, 255, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(114, 87, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(114, 87, 255, 0); }
        }
        
        /* Estilo unificado do splash screen aplicado a todo o menu */
        .eclipse-splash, 
        .eclipse-panel, 
        .eclipse-toggle, 
        .eclipse-button, 
        .eclipse-tabs, 
        .eclipse-tab, 
        .eclipse-input-group, 
        .eclipse-social-btn {
            position: relative;
            overflow: hidden;
        }
        
        .eclipse-splash::before, 
        .eclipse-panel::before, 
        .eclipse-toggle::before, 
        .eclipse-button::before, 
        .eclipse-tabs::before, 
        .eclipse-tab::before, 
        .eclipse-input-group::before, 
        .eclipse-social-btn::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 30%, rgba(114, 87, 255, 0.1), transparent 30%),
                        radial-gradient(circle at 80% 70%, rgba(67, 217, 173, 0.05), transparent 30%);
            z-index: 0;
            pointer-events: none;
        }
        
        .eclipse-splash::after, 
        .eclipse-panel::after, 
        .eclipse-toggle::after, 
        .eclipse-button::after, 
        .eclipse-tabs::after, 
        .eclipse-tab::after, 
        .eclipse-input-group::after, 
        .eclipse-social-btn::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(1px 1px at 20px 20px, #5a5a7a 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.1;
            z-index: 1;
            pointer-events: none;
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
            transition: opacity 0.5s;
            overflow: hidden;
        }
        
        .eclipse-splash-content {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        
        .eclipse-splash-title {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 12px;
            background: linear-gradient(to right, #7257ff, #43d9ad);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        
        .eclipse-splash-subtitle {
            font-size: 18px;
            color: var(--eclipse-text-muted);
            margin-bottom: 30px;
            font-weight: 400;
        }
        
        .eclipse-splash-loader {
            width: 60px;
            height: 60px;
            position: relative;
        }
        
        .eclipse-splash-loader-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-top-color: var(--eclipse-primary);
            border-radius: 50%;
            animation: orbit 1.5s linear infinite;
        }
        
        .eclipse-splash-loader-ring:nth-child(2) {
            border-top-color: var(--eclipse-accent);
            animation-duration: 2.5s;
            transform: rotate(60deg);
        }
        
        .eclipse-splash-loader-ring:nth-child(3) {
            border-top-color: rgba(114, 87, 255, 0.5);
            animation-duration: 3.5s;
            transform: rotate(120deg);
        }
        
        .eclipse-splash-status {
            margin-top: 25px;
            font-size: 14px;
            color: var(--eclipse-text-muted);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .eclipse-splash-status-dot {
            width: 8px;
            height: 8px;
            background: var(--eclipse-primary);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        
        .eclipse-splash.fadeout {
            animation: fadeOut 0.5s forwards;
        }
        
        @keyframes fadeOut {
            to { opacity: 0; pointer-events: none; }
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
        
        /* BOTÃO DE MENU NO ESTILO DO SPLASH SCREEN */
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
            z-index: 100000;
            color: white;
            font-size: 28px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 99999;
            overflow: hidden;
        }
        
        .eclipse-toggle::before, .eclipse-toggle::after {
            z-index: 0;
        }
        
        .eclipse-toggle:hover {
            transform: scale(1.08) translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        
        .eclipse-toggle:active {
            transform: scale(1) translateY(0);
        }
        
        .eclipse-toggle-icon {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        
        .eclipse-toggle-label {
            font-size: 10px;
            opacity: 0;
            transform: translateY(5px);
            transition: all 0.3s ease;
        }
        
        .eclipse-toggle:hover .eclipse-toggle-label {
            opacity: 1;
            transform: translateY(0);
        }
        
        .eclipse-toggle.pulse {
            animation: buttonPulse 2s infinite;
        }
        
        .eclipse-panel {
            position: fixed;
            top: 120px;
            right: 40px;
            width: 360px;
            max-height: 75vh;
            background: linear-gradient(135deg, #0f121c, #1a1b26);
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
            cursor: default;
        }
        
        .eclipse-panel::before, .eclipse-panel::after {
            z-index: 0;
        }
        
        .eclipse-panel > * {
            position: relative;
            z-index: 1;
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
            cursor: move;
        }
        
        .eclipse-title {
            font-weight: 700;
            font-size: 20px;
            background: linear-gradient(to right, #7257ff, #43d9ad);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .eclipse-title-icon {
            font-size: 22px;
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
            background: transparent;
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
        
        .eclipse-tab::before, .eclipse-tab::after {
            z-index: -1;
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
            background: transparent;
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
        
        .eclipse-button::before, .eclipse-button::after {
            z-index: -1;
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
        
        .eclipse-input-group::before, .eclipse-input-group::after {
            z-index: 0;
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
        
        /* Nova barra de velocidade - bonita, profissional e funcional */
        .eclipse-range-container {
            position: relative;
            height: 50px;
            display: flex;
            align-items: center;
            margin-top: 8px;
        }
        
        .eclipse-range {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--eclipse-surface);
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        }
        
        .eclipse-range:focus {
            outline: none;
        }
        
        .eclipse-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            border: 2px solid var(--eclipse-primary);
            cursor: pointer;
            transition: all 0.15s ease;
            margin-top: -9px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            z-index: 2;
        }
        
        .eclipse-range::-webkit-slider-thumb:hover,
        .eclipse-range::-webkit-slider-thumb:active {
            transform: scale(1.25);
            background: var(--eclipse-primary);
            border-color: white;
            box-shadow: 0 0 0 8px rgba(114, 87, 255, 0.2);
        }
        
        .eclipse-range-track {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(90deg, var(--eclipse-primary), var(--eclipse-accent));
        }
        
        .eclipse-range-marks {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 12px;
            pointer-events: none;
        }
        
        .eclipse-range-mark {
            width: 2px;
            height: 8px;
            background: var(--eclipse-text-muted);
            border-radius: 1px;
        }
        
        .eclipse-range-mark.active {
            height: 12px;
            background: var(--eclipse-primary);
        }
        
        .eclipse-range-labels {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 28px;
            font-size: 12px;
            color: var(--eclipse-text-muted);
            pointer-events: none;
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
            background: transparent;
            border: 1px solid var(--eclipse-border);
            border-radius: 10px;
            padding: 14px;
            font-size: 13px;
            transition: all 0.2s ease;
        }
        
        .eclipse-feature::before, .eclipse-feature::after {
            z-index: -1;
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
            background: transparent;
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
        
        .eclipse-social-btn::before, .eclipse-social-btn::after {
            z-index: -1;
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
 

(function() {
    if (document.getElementById("eclipse-panel")) return;
    
    const features = {
        autoAnswer: false,
        revealAnswers: false,
        questionSpoof: false,
        videoSpoof: false,
        darkMode: true,
        rgbLogo: false,
        music: false,
        musicVolume: 50
    };

    const config = {
        autoAnswerDelay: 1.5,
        youtubeVideoId: "y_HY1jZlUP0" // ID padrão do YouTube
    };

    let youtubePlayer;
    let playerReady = false;

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
        
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
        
        .eclipse-splash::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 30%, rgba(114, 87, 255, 0.1), transparent 30%),
                        radial-gradient(circle at 80% 70%, rgba(67, 217, 173, 0.05), transparent 30%);
            z-index: 0;
        }
        
        .eclipse-splash::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(1px 1px at 20px 20px, #5a5a7a 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.1;
            z-index: 1;
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
        
        .eclipse-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--eclipse-primary), var(--eclipse-primary-light));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100000;
            color: white;
            font-size: 28px;
            box-shadow: 0 6px 20px rgba(114, 87, 255, 0.35);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 99999;
            overflow: hidden;
            transform: scale(1);
        }
        
        .eclipse-toggle:hover {
            transform: scale(1.08) translateY(-3px);
            box-shadow: 0 10px 24px rgba(114, 87, 255, 0.45);
        }
        
        .eclipse-toggle:active {
            transform: scale(1) translateY(0);
            box-shadow: 0 4px 12px rgba(114, 87, 255, 0.3);
        }
        
        .eclipse-panel {
            position: fixed;
            top: 120px;
            right: 40px;
            width: 360px;
            max-height: 75vh;
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
            cursor: default;
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
            background: linear-gradient(to right, white, #c5c5ff);
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
        
        /* Estilos específicos para o player de música */
        .eclipse-music-player {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--eclipse-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99998;
            box-shadow: 0 4px 12px rgba(114, 87, 255, 0.3);
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        .eclipse-music-player:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(114, 87, 255, 0.4);
        }
        
        .eclipse-music-player.active {
            animation: pulse 2s infinite;
        }
        
        .eclipse-music-icon {
            color: white;
            font-size: 24px;
            transition: all 0.3s ease;
        }
        
        .eclipse-music-player:hover .eclipse-music-icon {
            transform: scale(1.1);
        }
        
        .eclipse-music-player.playing .eclipse-music-icon {
            animation: rotate 1.5s linear infinite;
        }
        
        .youtube-player {
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 1px;
            height: 1px;
            visibility: hidden;
        }
        
        .music-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .music-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--eclipse-surface);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 1px solid var(--eclipse-border);
            transition: all 0.2s ease;
        }
        
        .music-btn:hover {
            background: var(--eclipse-primary);
            border-color: var(--eclipse-primary);
        }
        
        .music-btn.active {
            background: var(--eclipse-primary);
            border-color: var(--eclipse-primary);
        }
        
        .music-volume-container {
            flex: 1;
            position: relative;
            height: 24px;
            display: flex;
            align-items: center;
        }
        
        .music-volume-icon {
            width: 20px;
            margin-right: 8px;
            color: var(--eclipse-text-muted);
        }
        
        .music-volume-range {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--eclipse-surface);
            border-radius: 3px;
            position: relative;
            cursor: pointer;
        }
        
        .music-volume-range:focus {
            outline: none;
        }
        
        .music-volume-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            border: 2px solid var(--eclipse-primary);
            cursor: pointer;
            margin-top: -5px;
        }
        
        .music-volume-track {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 3px;
            background: var(--eclipse-primary);
        }
        
        .music-url-input {
            width: 100%;
            padding: 10px 14px;
            background: var(--eclipse-surface);
            color: var(--eclipse-text);
            border: 1px solid var(--eclipse-border);
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 12px;
        }
        
        .music-url-btn {
            width: 100%;
            padding: 10px;
            background: var(--eclipse-primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .music-url-btn:hover {
            background: var(--eclipse-primary-light);
            transform: translateY(-2px);
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

    // Função para extrair ID do YouTube de diferentes formatos de URL
    function extractYouTubeId(url) {
        // Verifica se é um ID puro (11 caracteres)
        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
            return url;
        }
        
        // Padrões de URL do YouTube
        const patterns = [
            /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }

    // Função para carregar a API do YouTube
    function loadYouTubeAPI() {
        return new Promise((resolve) => {
            if (window.YT) {
                resolve();
                return;
            }
            
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            window.onYouTubeIframeAPIReady = function() {
                resolve();
            };
        });
    }

    // Função para criar o player do YouTube
    function createYouTubePlayer(videoId = config.youtubeVideoId) {
        // Remove o player existente se houver
        const existingPlayer = document.getElementById('youtube-player');
        if (existingPlayer) {
            existingPlayer.remove();
        }
        
        // Cria um novo container para o player
        const playerDiv = document.createElement('div');
        playerDiv.id = 'youtube-player';
        playerDiv.className = 'youtube-player';
        document.body.appendChild(playerDiv);
        
        youtubePlayer = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'autoplay': 0,
                'loop': 1,
                'playlist': videoId,
                'controls': 0,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    }

    function onPlayerReady(event) {
        playerReady = true;
        youtubePlayer.setVolume(features.musicVolume);
        showToast("Música carregada. Clique no ícone de música para reproduzir", "info", 3000);
    }

    function onPlayerStateChange(event) {
        // Lida com mudanças de estado do player
        if (event.data === YT.PlayerState.PLAYING) {
            features.music = true;
            document.getElementById('music-btn').classList.add('active', 'playing');
            document.getElementById('music-btn-play').classList.remove('active');
            document.getElementById('music-btn-pause').classList.add('active');
            showToast("Música reproduzindo", "success", 2000);
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            features.music = false;
            document.getElementById('music-btn').classList.remove('active', 'playing');
            document.getElementById('music-btn-pause').classList.remove('active');
            document.getElementById('music-btn-play').classList.add('active');
        }
    }

    function onPlayerError(event) {
        showToast("Erro ao reproduzir música. Verifique o ID do vídeo.", "error", 3000);
        console.error("Erro do YouTube Player:", event);
    }

    // Função para reproduzir/pausar a música
    function toggleMusic() {
        if (!playerReady) {
            showToast("Player ainda está carregando, aguarde...", "info", 2000);
            return;
        }
        
        if (features.music) {
            youtubePlayer.pauseVideo();
        } else {
            youtubePlayer.playVideo();
        }
    }

    // Função para atualizar o volume
    function setVolume(volume) {
        features.musicVolume = volume;
        if (youtubePlayer && playerReady) {
            youtubePlayer.setVolume(volume);
        }
        // Atualiza a barra de volume visual
        const volumeTrack = document.querySelector('.music-volume-track');
        if (volumeTrack) {
            volumeTrack.style.width = `${volume}%`;
        }
    }

    // Função para carregar nova música
    function loadNewMusic() {
        const input = document.getElementById('music-url-input');
        if (!input) return;
        
        const url = input.value.trim();
        if (!url) {
            showToast("Por favor, insira um link ou ID do YouTube", "error", 2000);
            return;
        }
        
        const videoId = extractYouTubeId(url);
        if (!videoId) {
            showToast("URL ou ID inválido do YouTube", "error", 2000);
            return;
        }
        
        config.youtubeVideoId = videoId;
        showToast(`Carregando nova música: ${videoId}`, "info", 2000);
        
        // Se já tiver um player, atualiza o vídeo
        if (playerReady && youtubePlayer) {
            youtubePlayer.loadVideoById(videoId);
        } else {
            createYouTubePlayer(videoId);
        }
    }

    // Inicializa a UI
    (async function initializeUI() {
        // Cria o splash screen animado
        const splash = document.createElement("div");
        splash.className = "eclipse-splash";
        splash.innerHTML = `
            <div class="eclipse-splash-content">
                <div class="eclipse-splash-title">Eclipse Lunar</div>
                <div class="eclipse-splash-subtitle">Carregando sistema de automação</div>
                <div class="eclipse-splash-loader">
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                    <div class="eclipse-splash-loader-ring"></div>
                </div>
                <div class="eclipse-splash-status">
                    <div class="eclipse-splash-status-dot"></div>
                    <div>Sistema inicializado</div>
                </div>
            </div>
        `;
        document.body.appendChild(splash);

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

        // Espera um pouco para mostrar que está carregando
        await delay(1800);
        
        // Faz o splash screen desaparecer suavemente
        splash.classList.add("fadeout");
        
        // Espera a animação de fadeout terminar
        await delay(500);

        // CRIA O BOTÃO DE MÚSICA
        const musicBtn = document.createElement("div");
        musicBtn.id = "music-btn";
        musicBtn.className = "eclipse-music-player";
        musicBtn.innerHTML = '<div class="eclipse-music-icon">🎵</div>';
        musicBtn.title = "Música de fundo";
        
        musicBtn.addEventListener('click', () => {
            toggleMusic();
        });
        
        document.body.appendChild(musicBtn);

        // CRIA O BOTÃO DE MENU
        const toggleBtn = document.createElement("div");
        toggleBtn.className = "eclipse-toggle";
        toggleBtn.innerHTML = "🌙";
        toggleBtn.onclick = () => {
            const p = document.getElementById("eclipse-panel");
            if (p) {
                if (p.style.display === "block") {
                    p.style.display = "none";
                    toggleBtn.classList.remove('active');
                } else {
                    p.style.display = "block";
                    setTimeout(() => {
                        p.classList.add("active");
                        toggleBtn.classList.add('active');
                    }, 10);
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
                <div class="eclipse-title">
                    <span class="eclipse-title-icon">🌙</span>
                    Eclipse Lunar
                </div>
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
                    <div class="eclipse-range-container">
                        <input type="range" class="eclipse-range" id="eclipse-speed" value="${config.autoAnswerDelay}" min="1.5" max="2.5" step="0.1">
                        <div class="eclipse-range-track" style="width: ${((config.autoAnswerDelay - 1.5) / 1.0) * 100}%"></div>
                        <div class="eclipse-range-marks">
                            <div class="eclipse-range-mark ${config.autoAnswerDelay <= 1.7 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 1.7 && config.autoAnswerDelay <= 1.9 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 1.9 && config.autoAnswerDelay <= 2.1 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 2.1 && config.autoAnswerDelay <= 2.3 ? 'active' : ''}"></div>
                            <div class="eclipse-range-mark ${config.autoAnswerDelay > 2.3 ? 'active' : ''}"></div>
                        </div>
                        <div class="eclipse-range-labels">
                            <div>Lenta</div>
                            <div>Normal</div>
                            <div>Rápida</div>
                        </div>
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
                    <span>Logo RGB Dinâmico</span>
                </button>
                <div class="eclipse-input-group" style="margin-top: 0">
                    <div class="eclipse-input-label">
                        <span>Configurações de Música</span>
                    </div>
                    <input type="text" id="music-url-input" class="music-url-input" placeholder="Link ou ID do YouTube (ex: y_HY1jZlUP0)">
                    <button id="music-url-btn" class="music-url-btn">Carregar Música</button>
                    
                    <div class="music-controls" style="margin-top: 16px">
                        <div class="music-btn" id="music-btn-play">
                            <span>▶️</span>
                        </div>
                        <div class="music-btn active" id="music-btn-pause">
                            <span>⏸️</span>
                        </div>
                        <div class="music-volume-container">
                            <span class="music-volume-icon">🔊</span>
                            <input type="range" class="music-volume-range" id="music-volume" value="${features.musicVolume}" min="0" max="100" step="1">
                            <div class="music-volume-track" style="width: ${features.musicVolume}%"></div>
                        </div>
                    </div>
                </div>
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
        
        // Configura o botão de música
        document.getElementById('music-url-btn').addEventListener('click', loadNewMusic);
        
        // Configura o botão de play/pause no painel
        document.getElementById('music-btn-play').addEventListener('click', () => {
            if (features.music) {
                youtubePlayer.pauseVideo();
            } else {
                youtubePlayer.playVideo();
            }
        });
        
        document.getElementById('music-btn-pause').addEventListener('click', () => {
            if (features.music) {
                youtubePlayer.pauseVideo();
            } else {
                youtubePlayer.playVideo();
            }
        });

        // Configura o controle de velocidade
        const speedInput = document.getElementById('eclipse-speed');
        const speedValue = document.querySelector('.eclipse-speed-value');
        const rangeTrack = document.querySelector('.eclipse-range-track');
        const rangeMarks = document.querySelectorAll('.eclipse-range-mark');
        
        if (speedInput && speedValue && rangeTrack) {
            // Função para atualizar a interface
            const updateSpeedUI = () => {
                const value = parseFloat(speedInput.value);
                const percent = ((value - 1.5) / 1.0) * 100;
                
                // Atualiza o valor exibido
                speedValue.textContent = `${value.toFixed(1)}s`;
                
                // Atualiza a trilha
                rangeTrack.style.width = `${percent}%`;
                
                // Atualiza os marcadores
                rangeMarks.forEach((mark, index) => {
                    const markValue = 1.5 + (index * 0.25);
                    mark.classList.toggle('active', value >= markValue);
                });
            };
            
            // Atualiza imediatamente
            updateSpeedUI();
            
            // Atualiza durante o movimento do slider (input)
            speedInput.addEventListener('input', updateSpeedUI);
            
            // Atualiza quando soltar o slider (change)
            speedInput.addEventListener('change', () => {
                config.autoAnswerDelay = parseFloat(speedInput.value);
                showToast(`Velocidade definida para ${config.autoAnswerDelay.toFixed(1)}s`, "info", 1500);
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
        
        // Configura o controle de volume
        const volumeInput = document.getElementById('music-volume');
        const volumeTrack = document.querySelector('.music-volume-track');
        
        if (volumeInput && volumeTrack) {
            // Atualiza o volume visualmente
            const updateVolumeUI = () => {
                const volume = parseInt(volumeInput.value);
                volumeTrack.style.width = `${volume}%`;
                setVolume(volume);
            };
            
            // Atualiza imediatamente
            updateVolumeUI();
            
            // Atualiza durante o movimento do slider (input)
            volumeInput.addEventListener('input', updateVolumeUI);
        }
        
        // Configura o arrastar do painel
        let isDragging = false;
        let panelOffset = { x: 0, y: 0 };
        
        function startDragging(e) {
            // Ignora se clicou em um botão ou input
            if (e.target.closest('button, input, a, .eclipse-tab, .eclipse-range, .music-btn')) return;
            
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            
            // Calcula o offset do mouse em relação ao painel
            panelOffset = {
                x: e.clientX - rect.right,
                y: e.clientY - rect.top
            };
            
            panel.style.cursor = "grabbing";
            panel.style.transition = "none";
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            // Calcula a nova posição
            const newX = window.innerWidth - e.clientX + panelOffset.x;
            const newY = e.clientY - panelOffset.y;
            
            // Limita a posição para não sair da tela
            const maxX = window.innerWidth - 50;
            const maxY = window.innerHeight - 50;
            
            panel.style.right = Math.min(newX, maxX) + "px";
            panel.style.top = Math.max(80, Math.min(newY, maxY)) + "px";
        }
        
        function stopDragging() {
            isDragging = false;
            panel.style.cursor = "default";
            panel.style.transition = "transform 0.3s ease";
        }
        
        // Event listeners para desktop
        panel.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
        
        // Event listeners para touch (mobile)
        panel.addEventListener('touchstart', (e) => {
            // Converte touch para mouse event
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            startDragging(mouseEvent);
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            drag(mouseEvent);
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            stopDragging();
        });
        
        // Carrega a API do YouTube e cria o player
        await loadYouTubeAPI();
        createYouTubePlayer();
        
        // Inicia o game loop
        gameLoop();
    })();
})();

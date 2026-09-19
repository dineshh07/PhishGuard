(async function () {

    const url = window.location.href;

    if (!url.startsWith("http://") &&
        !url.startsWith("https://")) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/scan",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        
        chrome.runtime.sendMessage({
    status: data.status
});

       if (data.status === "Suspicious") {

    showWarning(data, false);

}

if (data.status === "Phishing") {

    showWarning(data, true);

}

    } catch (error) {

        console.log(
            "PhishGuard server unavailable."
        );

    }

})();

function showWarning(data, isPhishing) {

    if (document.getElementById("phishguard-warning")) {
        return;
    }

    const title = isPhishing
        ? "Dangerous Website Detected"
        : "Suspicious Website Detected";

    const icon = isPhishing
        ? "🚨"
        : "⚠️";

    const color = isPhishing
        ? "#ff4d6d"
        : "#ffb84d";


    const overlay = document.createElement("div");

    overlay.id = "phishguard-warning";


    overlay.innerHTML = `

        <div class="pg-security-card">

            <div class="pg-shield">
                ${icon}
            </div>

            <div class="pg-badge">
                PHISHGUARD SECURITY ALERT
            </div>

            <h1>
                ${title}
            </h1>

            <p class="pg-description">
                PhishGuard detected suspicious
                indicators on this website.
            </p>


            <div class="pg-url">
                ${escapeHTML(window.location.href)}
            </div>


            <div class="pg-score-box">

                <div>

                    <span>RISK SCORE</span>

                    <strong style="color:${color}">
                        ${data.risk_score}
                    </strong>

                    <small>/100</small>

                </div>

            </div>


            <div class="pg-reasons">

                ${
                    data.reasons
                        .slice(0, 4)
                        .map(reason => `
                            <div class="pg-reason">
                                <span>⚠</span>
                                ${escapeHTML(reason)}
                            </div>
                        `)
                        .join("")
                }

            </div>


            <div class="pg-actions">

                <button
                    id="pg-back"
                    class="pg-back-btn"
                >
                    ← Go Back
                </button>

                <button
                    id="pg-continue"
                    class="pg-continue-btn"
                >
                    Continue with Caution
                </button>

            </div>


            <div class="pg-footer">
                🛡 Protected by PhishGuard
            </div>

        </div>

    `;


    const style = document.createElement("style");


    style.textContent = `

        #phishguard-warning {

            position: fixed;

            inset: 0;

            z-index: 2147483647;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 25px;

            background:
                radial-gradient(
                    circle at center,
                    rgba(255,60,90,0.08),
                    rgba(5,5,10,0.98) 60%
                );

            font-family:
                Arial, sans-serif;

            color: white;

            overflow: auto;
        }


        .pg-security-card {

            width: 100%;

            max-width: 560px;

            padding: 38px;

            text-align: center;

            border-radius: 28px;

            background:
                rgba(20,20,28,0.96);

            border:
                1px solid
                rgba(255,255,255,0.09);

            box-shadow:
                0 30px 100px
                rgba(0,0,0,0.65);

            animation:
                pgAppear 0.45s ease;
        }


        @keyframes pgAppear {

            from {
                opacity: 0;
                transform: translateY(20px)
                           scale(0.97);
            }

            to {
                opacity: 1;
                transform: translateY(0)
                           scale(1);
            }

        }


        .pg-shield {

            width: 72px;

            height: 72px;

            margin: 0 auto 18px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 22px;

            background:
                rgba(255,77,109,0.10);

            border:
                1px solid
                rgba(255,77,109,0.20);

            font-size: 34px;

            box-shadow:
                0 0 40px
                rgba(255,77,109,0.12);
        }


        .pg-badge {

            display: inline-block;

            padding: 7px 12px;

            border-radius: 30px;

            background:
                rgba(255,255,255,0.05);

            color: #777;

            font-size: 9px;

            font-weight: bold;

            letter-spacing: 1.5px;
        }


        .pg-security-card h1 {

            margin: 18px 0 10px;

            font-size: 30px;

            letter-spacing: -1px;
        }


        .pg-description {

            max-width: 400px;

            margin: 0 auto;

            color: #777;

            font-size: 13px;

            line-height: 1.6;
        }


        .pg-url {

            margin-top: 22px;

            padding: 13px;

            border-radius: 12px;

            background:
                rgba(255,255,255,0.035);

            border:
                1px solid
                rgba(255,255,255,0.06);

            color: #999;

            font-size: 10px;

            word-break: break-all;
        }


        .pg-score-box {

            margin-top: 18px;

            padding: 18px;

            border-radius: 16px;

            background:
                rgba(255,255,255,0.035);
        }


        .pg-score-box span {

            display: block;

            color: #555;

            font-size: 9px;

            letter-spacing: 2px;

            font-weight: bold;
        }


        .pg-score-box strong {

            font-size: 42px;

            margin-top: 4px;

            display: inline-block;
        }


        .pg-score-box small {

            color: #555;

            font-size: 12px;
        }


        .pg-reasons {

            margin-top: 18px;

            text-align: left;
        }


        .pg-reason {

            padding: 9px 0;

            color: #999;

            font-size: 11px;

            border-bottom:
                1px solid
                rgba(255,255,255,0.05);
        }


        .pg-reason span {

            margin-right: 7px;

            color: #ffb84d;
        }


        .pg-actions {

            display: flex;

            gap: 10px;

            margin-top: 24px;
        }


        .pg-actions button {

            flex: 1;

            padding: 13px;

            border-radius: 11px;

            font-size: 11px;

            font-weight: bold;

            cursor: pointer;

            transition: 0.2s;
        }


        .pg-back-btn {

            background:
                rgba(255,255,255,0.05);

            border:
                1px solid
                rgba(255,255,255,0.08);

            color: #aaa;
        }


        .pg-continue-btn {

            background:
                rgba(255,77,109,0.12);

            border:
                1px solid
                rgba(255,77,109,0.25);

            color: #ff7189;
        }


        .pg-actions button:hover {

            transform: translateY(-2px);

            opacity: 0.85;
        }


        .pg-footer {

            margin-top: 22px;

            color: #444;

            font-size: 9px;
        }


        @media (max-width: 600px) {

            .pg-security-card {

                padding: 25px;

            }

            .pg-security-card h1 {

                font-size: 24px;

            }

            .pg-actions {

                flex-direction: column;

            }

        }

    `;


    document.head.appendChild(style);

    document.body.appendChild(overlay);


    /* GO BACK */

    document
        .getElementById("pg-back")
        .addEventListener("click", () => {

            window.history.back();

        });


    /* CONTINUE */

    document
        .getElementById("pg-continue")
        .addEventListener("click", () => {

            overlay.remove();

            style.remove();

        });

}
    


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
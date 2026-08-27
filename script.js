const modal = document.getElementById("resultModal");

const scanning = document.getElementById("scanning");
const result = document.getElementById("result");

const scanText = document.getElementById("scanText");

const urlInput = document.getElementById("urlInput");

const riskScore = document.getElementById("riskScore");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const resultIcon = document.getElementById("resultIcon");


function scrollToScanner() {

    document.getElementById("scanner").scrollIntoView({
        behavior: "smooth"
    });

}


/* URL SCANNER */

async function scanURL() {

    const url = urlInput.value.trim();

    if (url === "") {
        urlInput.focus();
        urlInput.placeholder = "Please enter a URL first...";
        return;
    }

    modal.classList.add("active");

    scanning.style.display = "block";
    result.style.display = "none";

    const messages = [
        "Checking URL structure...",
        "Analyzing domain...",
        "Detecting suspicious patterns...",
        "Calculating risk score..."
    ];

    let index = 0;

    const interval = setInterval(() => {

        scanText.textContent = messages[index];

        index++;

        if (index >= messages.length) {
            clearInterval(interval);
        }

    }, 600);


    try {

        const response = await fetch("http://127.0.0.1:5000/scan", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url: url
            })

        });


        const data = await response.json();


        clearInterval(interval);

        setTimeout(() => {
            showRealResult(data);
        }, 500);


    } catch (error) {

        clearInterval(interval);

        scanning.style.display = "none";
        result.style.display = "block";

        resultIcon.textContent = "❌";
        resultTitle.textContent = "Connection Error";

        resultMessage.textContent =
            "Unable to connect to the PhishGuard security server.";

        riskScore.textContent = "--";

        console.error(error);
    }
}

function showRealResult(data) {

    saveScan(data);

    scanning.style.display = "none";
    result.style.display = "block";

    const score = data.risk_score;

    riskScore.textContent = score;

    const resultURL = document.getElementById("resultURL");
    const securityStatus = document.getElementById("securityStatus");
    const recommendationText =
        document.getElementById("recommendationText");

    const riskCircle =
        document.getElementById("riskCircle");


    resultURL.textContent = data.url;


    /* =========================
       SAFE
    ========================= */

    if (data.status === "Safe") {

        securityStatus.textContent = "✓ URL Appears Safe";

        securityStatus.style.color = "#52ffb8";

        riskScore.style.color = "#52ffb8";

        recommendationText.textContent =
            "This URL appears safe based on the current analysis.";

        riskCircle.style.background =
            `conic-gradient(
                #52ffb8 ${score * 3.6}deg,
                rgba(255,255,255,0.06) ${score * 3.6}deg
            )`;
    }


    /* =========================
       SUSPICIOUS
    ========================= */

    else if (data.status === "Suspicious") {

        securityStatus.textContent = "⚠ Suspicious URL";

        securityStatus.style.color = "#ffb84d";

        riskScore.style.color = "#ffb84d";

        recommendationText.textContent =
            data.reasons.join(" • ");

        riskCircle.style.background =
            `conic-gradient(
                #ffb84d ${score * 3.6}deg,
                rgba(255,255,255,0.06) ${score * 3.6}deg
            )`;
    }


    /* =========================
       PHISHING
    ========================= */

    else {

        securityStatus.textContent =
            "🚨 Phishing Detected";

        securityStatus.style.color = "#ff4d6d";

        riskScore.style.color = "#ff4d6d";

        recommendationText.textContent =
            "This URL contains multiple suspicious indicators. Avoid entering sensitive information.";

        riskCircle.style.background =
            `conic-gradient(
                #ff4d6d ${score * 3.6}deg,
                rgba(255,255,255,0.06) ${score * 3.6}deg
            )`;
    }

}


function closeModal() {
    modal.classList.remove("active");
}

function closeModal() {

    modal.classList.remove("active");

}
function saveScan(data) {

    let scans = JSON.parse(
        localStorage.getItem("phishguard_scans")
    ) || [];

    const scan = {
        url: data.url,
        risk_score: data.risk_score,
        status: data.status,
        reasons: data.reasons,
        time: new Date().toLocaleString()
    };

    scans.unshift(scan);

    // Keep latest 50 scans
    scans = scans.slice(0, 50);

    localStorage.setItem(
        "phishguard_scans",
        JSON.stringify(scans)
    );
}
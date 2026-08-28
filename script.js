/* =====================================================
   PHISHGUARD — MAIN JAVASCRIPT
===================================================== */

const API_URL = "http://127.0.0.1:5000/scan";

document.addEventListener("DOMContentLoaded", () => {

    /* Enter key → Scan */
    const urlInput = document.getElementById("urlInput");

    if (urlInput) {
        urlInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                scanURL();
            }

        });
    }

});


/* =====================================================
   SCAN URL
===================================================== */

async function scanURL() {

    const input = document.getElementById("urlInput");

    if (!input) return;

    let url = input.value.trim();

    if (!url) {

        alert("Please enter a website URL.");

        input.focus();

        return;
    }


    /* Add https if user doesn't type protocol */

    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {
        url = "https://" + url;
    }


    openModal();

    showScanning();


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url: url
            })

        });


        if (!response.ok) {

            throw new Error(
                "Server returned " + response.status
            );

        }


        const data = await response.json();


        /* Small scanning animation */

        await delay(1200);


        showResult(data);


    } catch (error) {

        console.error("PhishGuard Error:", error);

        showConnectionError();

    }

}


/* =====================================================
   OPEN MODAL
===================================================== */

function openModal() {

    const modal =
        document.getElementById("resultModal");

    if (!modal) return;

    modal.style.display = "flex";

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeModal() {

    const modal =
        document.getElementById("resultModal");

    if (!modal) return;

    modal.style.display = "none";

}


/* =====================================================
   SCANNING SCREEN
===================================================== */

function showScanning() {

    const scanning =
        document.getElementById("scanning");

    const result =
        document.getElementById("result");

    if (scanning) {
        scanning.style.display = "block";
    }

    if (result) {
        result.style.display = "none";
    }


    const scanText =
        document.getElementById("scanText");


    const messages = [

        "Checking URL structure...",

        "Analyzing domain information...",

        "Detecting suspicious patterns...",

        "Calculating security risk..."

    ];


    let index = 0;


    if (scanText) {

        scanText.textContent =
            messages[0];


        const interval =
            setInterval(() => {

                index++;

                if (index >= messages.length) {
                    clearInterval(interval);
                    return;
                }

                scanText.textContent =
                    messages[index];

            }, 350);

    }

}


/* =====================================================
   SHOW RESULT
===================================================== */

function showResult(data) {

    const scanning =
        document.getElementById("scanning");

    const result =
        document.getElementById("result");


    if (scanning) {
        scanning.style.display = "none";
    }

    if (result) {
        result.style.display = "block";
    }


    const score =
        Number(data.risk_score) || 0;


    const status =
        data.status || "Unknown";


    const reasons =
        Array.isArray(data.reasons)
            ? data.reasons
            : [];


    /* URL */

    const resultURL =
        document.getElementById("resultURL");

    if (resultURL) {

        resultURL.textContent =
            data.url || "Unknown URL";

    }


    /* Score */

    const riskScore =
        document.getElementById("riskScore");

    if (riskScore) {

        animateScore(
            riskScore,
            score
        );

    }


    /* Circle */

    updateRiskCircle(
        score,
        status
    );


    /* Status */

    updateSecurityStatus(
        status
    );


    /* Security checks */

    updateChecks(
        data.url || "",
        reasons
    );


    /* Recommendation */

    updateRecommendation(
        score,
        status
    );

}


/* =====================================================
   ANIMATE SCORE
===================================================== */

function animateScore(element, target) {

    let current = 0;

    const duration = 700;

    const startTime = performance.now();


    function update(time) {

        const progress =
            Math.min(
                (time - startTime) / duration,
                1
            );


        current =
            Math.round(
                progress * target
            );


        element.textContent =
            current;


        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }


    requestAnimationFrame(update);

}


/* =====================================================
   RISK CIRCLE
===================================================== */

function updateRiskCircle(score, status) {

    const circle =
        document.getElementById("riskCircle");

    if (!circle) return;


    let color = "#52ffb8";


    if (status === "Suspicious") {

        color = "#ffb84d";

    }


    if (
        status === "Phishing" ||
        status === "Dangerous" ||
        score >= 80
    ) {

        color = "#ff4d6d";

    }


    const degrees =
        Math.min(score, 100) * 3.6;


    circle.style.background =
        `conic-gradient(
            ${color} ${degrees}deg,
            #1b202d ${degrees}deg
        )`;

}


/* =====================================================
   SECURITY STATUS
===================================================== */

function updateSecurityStatus(status) {

    const element =
        document.getElementById(
            "securityStatus"
        );


    if (!element) return;


    if (status === "Safe") {

        element.textContent =
            "✓ URL Appears Safe";

        element.style.color =
            "#52ffb8";

    }

    else if (status === "Suspicious") {

        element.textContent =
            "⚠ Suspicious Website Detected";

        element.style.color =
            "#ffb84d";

    }

    else {

        element.textContent =
            "🚨 Phishing Website Detected";

        element.style.color =
            "#ff4d6d";

    }

}


/* =====================================================
   SECURITY CHECKS
===================================================== */

function updateChecks(url, reasons) {

    const checks =
        document.getElementById("checks");

    if (!checks) return;


    const isHTTPS =
        url.startsWith("https://");


    const ipPattern =
        /^https?:\/\/(\d{1,3}\.){3}\d{1,3}/;


    const usesIP =
        ipPattern.test(url);


    const suspicious =
        reasons.length > 0 &&
        !(
            reasons.length === 1 &&
            reasons[0].includes(
                "No major suspicious"
            )
        );


    /* HTTPS */

    const items =
        checks.querySelectorAll(
            ".check-item"
        );


    if (items.length >= 1) {

        const icon =
            items[0].querySelector("span");

        const small =
            items[0].querySelector("small");


        if (isHTTPS) {

            icon.textContent = "✓";

            icon.style.color =
                "#52ffb8";

            small.textContent =
                "Secure connection";

        } else {

            icon.textContent = "⚠";

            icon.style.color =
                "#ffb84d";

            small.textContent =
                "HTTPS is not being used";

        }

    }


    /* URL Structure */

    if (items.length >= 2) {

        const icon =
            items[1].querySelector("span");

        const small =
            items[1].querySelector("small");


        if (usesIP) {

            icon.textContent = "⚠";

            icon.style.color =
                "#ffb84d";

            small.textContent =
                "IP address detected";

        } else {

            icon.textContent = "✓";

            icon.style.color =
                "#52ffb8";

            small.textContent =
                "Normal URL structure";

        }

    }


    /* Suspicious Patterns */

    if (items.length >= 3) {

        const icon =
            items[2].querySelector("span");

        const small =
            items[2].querySelector("small");


        if (suspicious) {

            icon.textContent = "⚠";

            icon.style.color =
                "#ffb84d";

            small.textContent =
                reasons.join(" • ");

        } else {

            icon.textContent = "✓";

            icon.style.color =
                "#52ffb8";

            small.textContent =
                "No major indicators";

        }

    }

}


/* =====================================================
   RECOMMENDATION
===================================================== */

function updateRecommendation(score, status) {

    const recommendation =
        document.getElementById(
            "recommendationText"
        );


    if (!recommendation) return;


    if (status === "Safe") {

        recommendation.textContent =
            "This URL appears safe based on the current analysis. Always verify the website before entering sensitive information.";

    }

    else if (status === "Suspicious") {

        recommendation.textContent =
            "Be careful with this website. Avoid entering passwords, payment information, or other sensitive data.";

    }

    else {

        recommendation.textContent =
            "Do not continue to this website. Multiple suspicious indicators were detected.";

    }

}


/* =====================================================
   CONNECTION ERROR
===================================================== */

function showConnectionError() {

    const scanning =
        document.getElementById("scanning");

    const result =
        document.getElementById("result");


    if (scanning) {
        scanning.style.display = "none";
    }


    if (result) {
        result.style.display = "block";
    }


    const score =
        document.getElementById("riskScore");

    if (score) {
        score.textContent = "--";
    }


    const status =
        document.getElementById(
            "securityStatus"
        );

    if (status) {

        status.textContent =
            "⚠ Connection Error";

        status.style.color =
            "#ffb84d";

    }


    const recommendation =
        document.getElementById(
            "recommendationText"
        );

    if (recommendation) {

        recommendation.textContent =
            "Start the PhishGuard Flask server and try scanning again.";

    }

}


/* =====================================================
   UTILITY
===================================================== */

function delay(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


/* =====================================================
   SCROLL TO SCANNER
===================================================== */

function scrollToScanner() {

    const scanner =
        document.getElementById("scanner");

    if (!scanner) return;


    scanner.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    const input =
        document.getElementById("urlInput");

    if (input) {

        setTimeout(() => {
            input.focus();
        }, 500);

    }

}


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

const modal =
    document.getElementById("resultModal");


if (modal) {

    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {

                closeModal();

            }

        }
    );

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);
/* =====================================================
   SCREENSHOT ANALYSIS
===================================================== */

async function analyzeScreenshot(event) {

    const file = event.target.files[0];

    if (!file) return;

    const preview =
        document.getElementById("screenshotPreview");

    const result =
        document.getElementById("screenshotResult");


    // Show image
    const imageURL =
        URL.createObjectURL(file);

    preview.src = imageURL;

    preview.style.display = "block";


    // Loading message
    result.innerHTML = `
        <div class="analysis-loading">
            <div class="mini-loader"></div>

            <h3>Analyzing Screenshot...</h3>

            <p>
                Scanning visible text for suspicious indicators.
            </p>
        </div>
    `;


    try {

        // OCR
        const { data } =
            await Tesseract.recognize(
                imageURL,
                "eng",
                {
                    logger: info => {

                        if (info.status === "recognizing text") {

                            const percent =
                                Math.round(info.progress * 100);

                            result.innerHTML = `
                                <div class="analysis-loading">

                                    <div class="mini-loader"></div>

                                    <h3>
                                        Analyzing Screenshot ${percent}%
                                    </h3>

                                    <p>
                                        Detecting suspicious text...
                                    </p>

                                </div>
                            `;
                        }

                    }
                }
            );


        const text =
            data.text.toLowerCase();


        // Suspicious indicators
        const suspiciousWords = [

            "verify your account",
            "verify account",
            "login",
            "sign in",
            "password",
            "confirm your account",
            "urgent",
            "account suspended",
            "account locked",
            "click here",
            "security alert",
            "update payment",
            "payment failed",
            "bank",
            "otp",
            "verification",
            "free gift",
            "claim now"

        ];


        let matches = [];


        suspiciousWords.forEach(word => {

            if (text.includes(word)) {

                matches.push(word);

            }

        });


        // Calculate risk
        let riskScore =
            matches.length * 10;


        // Limit to 100
        riskScore =
            Math.min(riskScore, 100);


        // Extra indicators
        if (
            text.includes("http://") ||
            text.includes("https://")
        ) {

            riskScore += 5;

        }


        if (
            text.includes("urgent") &&
            text.includes("verify")
        ) {

            riskScore += 15;

        }


        riskScore =
            Math.min(riskScore, 100);


        // Status
        let status;
        let statusClass;
        let recommendation;


        if (riskScore >= 70) {

            status =
                "🚨 High Risk Screenshot";

            statusClass =
                "danger";

            recommendation =
                "Multiple suspicious indicators were detected. Avoid interacting with this website.";

        }

        else if (riskScore >= 40) {

            status =
                "⚠ Suspicious Screenshot";

            statusClass =
                "warning";

            recommendation =
                "Several suspicious indicators were detected. Proceed carefully.";

        }

        else {

            status =
                "✓ Low Risk Screenshot";

            statusClass =
                "safe";

            recommendation =
                "No major suspicious text indicators were detected.";

        }


        // Show result
        result.innerHTML = `

            <div class="screenshot-result">

                <div class="result-title">

                    <span class="${statusClass}">
                        ${status}
                    </span>

                </div>


                <div class="screenshot-risk">

                    <strong>
                        ${riskScore}
                    </strong>

                    <span>
                        / 100
                    </span>

                </div>


                <div class="risk-bar">

                    <div
                        class="risk-progress ${statusClass}"
                        style="width:${riskScore}%"
                    ></div>

                </div>


                <div class="detected-items">

                    <h4>
                        Detected Indicators
                    </h4>

                    ${
                        matches.length
                        ?
                        matches.map(item => `
                            <span>
                                ⚠ ${item}
                            </span>
                        `).join("")
                        :
                        `
                            <span class="no-threat">
                                ✓ No major suspicious indicators
                            </span>
                        `
                    }

                </div>


                <div class="recommendation-box">

                    🛡️

                    <div>

                        <strong>
                            Security Recommendation
                        </strong>

                        <p>
                            ${recommendation}
                        </p>

                    </div>

                </div>

            </div>

        `;


    }

    catch (error) {

        console.error(error);

        result.innerHTML = `

            <div class="analysis-error">

                ❌ Screenshot analysis failed.

                <p>
                    Please try another image.
                </p>

            </div>

        `;

    }

}
/* =====================================================
   QR DETECTION
===================================================== */

function openQRScanner() {

    const modal =
        document.getElementById("qrModal");

    modal.style.display = "flex";

}


function scanQR(event) {

    const file =
        event.target.files[0];

    if (!file) return;


    const result =
        document.getElementById(
            "qrResult"
        );


    const canvas =
        document.getElementById(
            "qrCanvas"
        );


    const ctx =
        canvas.getContext("2d");


    const image =
        new Image();


    const reader =
        new FileReader();


    reader.onload = function(e) {

        image.onload = function() {

            canvas.width =
                image.width;

            canvas.height =
                image.height;


            ctx.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
            );


            const imageData =
                ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


            if (typeof jsQR === "undefined") {

                result.style.display = "block";

                result.innerHTML = `
                    ⚠️ QR engine is loading.
                    Please refresh and try again.
                `;

                return;
            }


            const code =
                jsQR(
                    imageData.data,
                    imageData.width,
                    imageData.height
                );


            result.style.display = "block";


            if (code) {

                const qrURL =
                    code.data;


                result.innerHTML = `
                    <strong>
                        ✓ QR Code Detected
                    </strong>

                    <br><br>

                    <span>
                        ${escapeHTML(qrURL)}
                    </span>

                    <br><br>

                    <button
                        class="scan-btn"
                        onclick="analyzeQRURL('${encodeURIComponent(qrURL)}')">

                        Analyze QR URL →

                    </button>
                `;

            }

            else {

                result.innerHTML = `
                    ⚠️ No QR code detected.
                    <br>
                    Try a clearer QR image.
                `;

            }

        };


        image.src =
            e.target.result;

    };


    reader.readAsDataURL(file);

}



/* =====================================================
   ANALYZE QR URL
===================================================== */

function analyzeQRURL(encodedURL) {

    const url =
        decodeURIComponent(encodedURL);


    closeTools();


    document.getElementById(
        "urlInput"
    ).value = url;


    scanURL();

}



/* =====================================================
   CLOSE TOOL MODALS
===================================================== */

function closeTools() {

    const screenshot =
        document.getElementById(
            "screenshotModal"
        );

    const qr =
        document.getElementById(
            "qrModal"
        );


    if (screenshot) {
        screenshot.style.display = "none";
    }


    if (qr) {
        qr.style.display = "none";
    }

}



/* =====================================================
   BASIC HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

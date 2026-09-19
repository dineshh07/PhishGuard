const API_URL = "http://127.0.0.1:5000/scan";


document.addEventListener("DOMContentLoaded", () => {

    scanCurrentTab();

});


async function scanCurrentTab() {

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });


    if (!tabs.length) {
        return;
    }


    const url = tabs[0].url;

    document.getElementById("currentUrl")
        .textContent = url;


    // Browser internal pages cannot be scanned
    if (
        !url ||
        url.startsWith("chrome://") ||
        url.startsWith("edge://") ||
        url.startsWith("about:")
    ) {

        showMessage(
            "--",
            "Not Scannable",
            "This browser page cannot be analyzed."
        );

        return;
    }


    await analyzeURL(url);

}


async function analyzeURL(url) {

    setLoading();


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
            throw new Error("API error");
        }


        const data = await response.json();

        showResult(data);


    } catch (error) {

        showMessage(
            "--",
            "Connection Error",
            "Start the PhishGuard Flask server and try again."
        );

        console.error(error);

    }

}


function setLoading() {

    document.getElementById("score")
        .textContent = "...";

    document.getElementById("status")
        .textContent = "Analyzing...";

    document.getElementById("message")
        .textContent =
        "Checking this website for suspicious patterns.";

}


function showResult(data) {

    const score =
        data.risk_score;


    document.getElementById("score")
        .textContent = score;


    const circle =
        document.getElementById("scoreCircle");

    circle.style.background =
        `conic-gradient(
            #52ffb8 ${score * 3.6}deg,
            #1b1b24 ${score * 3.6}deg
        )`;


    const status =
        document.getElementById("status");


    const message =
        document.getElementById("message");


    if (data.status === "Safe") {

        status.textContent =
            "✓ URL Appears Safe";

        status.style.color =
            "#52ffb8";

        message.textContent =
            "No major suspicious patterns were detected.";

    }

    else if (data.status === "Suspicious") {

        status.textContent =
            "⚠ Suspicious URL";

        status.style.color =
            "#ffb84d";

        circle.style.background =
            `conic-gradient(
                #ffb84d ${score * 3.6}deg,
                #1b1b24 ${score * 3.6}deg
            )`;

        message.textContent =
            data.reasons.join(" • ");

    }

    else {

        status.textContent =
            "🚨 Phishing Detected";

        status.style.color =
            "#ff4d6d";

        circle.style.background =
            `conic-gradient(
                #ff4d6d ${score * 3.6}deg,
                #1b1b24 ${score * 3.6}deg
            )`;

        message.textContent =
            "Multiple suspicious indicators were detected.";

    }

}


function showMessage(score, title, message) {

    document.getElementById("score")
        .textContent = score;

    document.getElementById("status")
        .textContent = title;

    document.getElementById("status")
        .style.color = "#ffb84d";

    document.getElementById("message")
        .textContent = message;

}


document.getElementById("scanAgain")
    .addEventListener("click", scanCurrentTab);
document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

});


function loadDashboard() {

    const scans = JSON.parse(
        localStorage.getItem("phishguard_scans")
    ) || [];


    /* =========================
       STATISTICS
    ========================= */

    const total = scans.length;

    const safe = scans.filter(
        scan => scan.status === "Safe"
    ).length;

    const suspicious = scans.filter(
        scan => scan.status === "Suspicious"
    ).length;

    const phishing = scans.filter(
        scan => scan.status === "Phishing"
    ).length;


    document.getElementById("totalScans")
        .textContent = total.toLocaleString();

    document.getElementById("safeScans")
        .textContent = safe.toLocaleString();

    document.getElementById("suspiciousScans")
        .textContent = suspicious.toLocaleString();

    document.getElementById("phishingScans")
        .textContent = phishing.toLocaleString();


    /* =========================
       RECENT SCANS
    ========================= */

    const scanList =
        document.querySelector(".scan-list");

    if (!scanList) return;


    if (scans.length === 0) {

        scanList.innerHTML = `
            <div class="empty-state">
                <div>🔍</div>
                <strong>No scans yet</strong>
                <p>
                    Scan a URL to see your activity here.
                </p>
            </div>
        `;

        return;
    }


    scanList.innerHTML = "";


    scans.slice(0, 10).forEach(scan => {

        const row =
            document.createElement("div");

        row.className = "scan-row";


        let icon = "✓";
        let type = "safe";


        if (scan.status === "Suspicious") {

            icon = "⚠";
            type = "warning";

        }

        else if (scan.status === "Phishing") {

            icon = "!";
            type = "danger";

        }


        row.innerHTML = `

            <div class="scan-info">

                <div class="scan-icon ${type}">
                    ${icon}
                </div>

                <div>

                    <strong>
                        ${escapeHTML(scan.url)}
                    </strong>

                    <small>
                        ${scan.time}
                    </small>

                </div>

            </div>


            <span class="scan-score ${type}-text">

                ${scan.risk_score} / 100

            </span>


            <span class="scan-status ${type}-badge">

                ${scan.status}

            </span>

        `;


        scanList.appendChild(row);

    });

}


/* =========================
   BASIC HTML ESCAPE
========================= */

function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
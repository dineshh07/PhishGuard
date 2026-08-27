from urllib.parse import urlparse
import re


def analyze_url(url):
    """
    Basic phishing URL analysis.
    Returns a risk score and reasons.
    """

    score = 0
    reasons = []

    # Add protocol if missing
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    parsed = urlparse(url)

    domain = parsed.netloc
    path = parsed.path

    # 1. HTTPS check
    if parsed.scheme != "https":
        score += 15
        reasons.append("HTTPS is not being used")

    # 2. URL length
    if len(url) > 100:
        score += 15
        reasons.append("Unusually long URL")

    # 3. @ symbol
    if "@" in url:
        score += 25
        reasons.append("Suspicious @ symbol detected")

    # 4. IP address instead of domain
    ip_pattern = r"^(?:\d{1,3}\.){3}\d{1,3}$"

    if re.match(ip_pattern, domain.split(":")[0]):
        score += 25
        reasons.append("URL uses an IP address instead of a domain")

    # 5. Suspicious keywords
    suspicious_words = [
        "login",
        "verify",
        "verification",
        "account",
        "password",
        "secure",
        "update",
        "confirm",
        "signin"
    ]

    found_words = []

    for word in suspicious_words:
        if word in url.lower():
            found_words.append(word)

    if found_words:
        score += min(len(found_words) * 8, 24)
        reasons.append(
            "Suspicious keyword(s): " + ", ".join(found_words)
        )

    # 6. Too many subdomains
    if domain.count(".") >= 4:
        score += 15
        reasons.append("Unusual number of subdomains")

    # 7. Hyphen-heavy domain
    if domain.count("-") >= 3:
        score += 10
        reasons.append("Domain contains many hyphens")

    # Keep score between 0 and 100
    score = min(score, 100)

    # Final classification
    if score >= 60:
        status = "Phishing"
    elif score >= 30:
        status = "Suspicious"
    else:
        status = "Safe"

    if not reasons:
        reasons.append("No major suspicious patterns detected")

    return {
        "url": url,
        "risk_score": score,
        "status": status,
        "reasons": reasons
    }
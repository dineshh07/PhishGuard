from flask import Flask, request, jsonify
from flask_cors import CORS

from detector import analyze_url


app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "PhishGuard API is running",
        "status": "online"
    })


@app.route("/scan", methods=["POST"])
def scan():

    data = request.get_json()

    if not data or "url" not in data:
        return jsonify({
            "error": "URL is required"
        }), 400

    url = data["url"].strip()

    if not url:
        return jsonify({
            "error": "URL cannot be empty"
        }), 400

    result = analyze_url(url)

    return jsonify(result)


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
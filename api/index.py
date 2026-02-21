from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import os
import sys

# Ensure the api directory is in the path for relative imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from auth.email_validator import is_valid_email, is_disposable
from auth.spam_detector import get_spam_score


app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# In-memory logging for demonstration
blocked_emails = []

@app.route("/auth/validate-email", methods=["POST"])
def validate_email():
    data = request.json
    email = data.get("email", "")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # 1. Format Validation
    if not is_valid_email(email):
        return jsonify({
            "status": "invalid",
            "message": "Invalid Email Format",
            "score": 1.0
        }), 200

    # 2. Disposable Domain Check
    if is_disposable(email):
        log_blocked_email(email, "Disposable Domain", 1.0)
        return jsonify({
            "status": "blocked",
            "message": "Disposable Email Not Allowed",
            "score": 1.0
        }), 200

    # 3. ML Spam Probability Check
    spam_score = get_spam_score(email)
    
    if spam_score > 0.7:
        log_blocked_email(email, "High Spam Score", spam_score)
        return jsonify({
            "status": "suspicious",
            "message": "Suspicious Email Detected",
            "score": spam_score
        }), 200

    return jsonify({
        "status": "success",
        "message": "Email verified",
        "score": spam_score
    }), 200

@app.route("/stats", methods=["GET"])
def get_stats():
    return jsonify({
        "total_blocked": len(blocked_emails),
        "recent_blocks": blocked_emails[-5:]
    })

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.datetime.now().isoformat()})


def log_blocked_email(email, reason, score):
    blocked_emails.append({
        "email": email,
        "reason": reason,
        "score": round(score, 2),
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)

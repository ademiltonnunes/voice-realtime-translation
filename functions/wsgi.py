import os
from flask import Flask, jsonify, request
from firebase_functions import https_fn
from main import translationService

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "healthy", "message": "Firebase Functions are running"})

@app.route('/translationService', methods=['POST', 'OPTIONS'])
def translation_endpoint():
    return translationService(request)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
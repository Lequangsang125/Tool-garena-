from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/save", methods=["POST"])
def save_images():
    if "images" not in request.files:
        return jsonify({"error": "No images uploaded"}), 400
    
    files = request.files.getlist("images")
    saved_files = []
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        saved_files.append(file.filename)
    
    return jsonify({"message": "Images saved successfully", "files": saved_files})

if __name__ == "__main__":
    app.run(debug=True)

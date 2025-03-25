from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import your_asl_model  # Import your actual model

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Requests

@app.route('/asl-recognize', methods=['POST'])
def recognize_asl():
    if 'frame' not in request.files:
        return jsonify({'error': 'No frame provided'}), 400
    
    # Read the image file
    file = request.files['frame']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # Process with your ASL model
    predicted_text = your_asl_model.predict(img)  # Replace with your model's function
    
    return jsonify({'text': predicted_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
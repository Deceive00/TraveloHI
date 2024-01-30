import cv2
from flask import Flask, request, jsonify
from keras.models import load_model
from flask_cors import CORS
import base64
from PIL import Image
import numpy as np
import io

app = Flask(__name__)
CORS(app)
model = load_model('./location_checker.h5')

def preprocess_image(img):
    dimensions = (224, 224)
    resized_img = cv2.resize(img, dimensions)
    normalized_img = resized_img.astype('float32') / 255
    return np.expand_dims(normalized_img, axis=0)

@app.route('/api/predict', methods=['POST'])
def predict():
    data_url = request.json['data']
    _, data = data_url.split(',', 1)
    image_data = base64.b64decode(data)
    img = np.array(Image.open(io.BytesIO(image_data)))
    processed_img = preprocess_image(img)
    prediction = model.predict(processed_img)
    predicted_class_index = np.argmax(prediction)
    
    return jsonify({'predictedIndex': int(predicted_class_index)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8090)

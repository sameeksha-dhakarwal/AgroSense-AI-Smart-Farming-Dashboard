import json
import numpy as np
import tensorflow as tf
from PIL import Image

MODEL_PATH = "models/disease_cnn.keras"
LABELS_PATH = "models/labels.json"
DISEASE_INFO_PATH = "models/disease_info.json"

IMG_SIZE = 224

# Load model once
model = tf.keras.models.load_model(MODEL_PATH)

with open(LABELS_PATH) as f:
    labels = json.load(f)

with open(DISEASE_INFO_PATH) as f:
    disease_info = json.load(f)


def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)


def predict_disease(image_path):
    image = preprocess_image(image_path)
    preds = model.predict(image)[0]

    top_idx = np.argmax(preds)
    confidence = float(preds[top_idx])

    class_name = labels[str(top_idx)]

    info = disease_info.get(class_name, {
        "crop": "Unknown",
        "disease": class_name,
        "treatment": ["Consult an agricultural expert"]
    })

    return {
        "crop": info["crop"],
        "disease": info["disease"],
        "confidence": round(confidence * 100, 2),
        "treatment": info["treatment"]
    }


# For quick CLI testing
if __name__ == "__main__":
    result = predict_disease("test.jpg")
    print(result)

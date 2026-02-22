from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI()

# =========================
# CORS (Allow Node Backend)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow Node server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# LOAD MODEL
# =========================
try:
    model = tf.keras.models.load_model("models/disease_cnn.keras")
except Exception as e:
    print("MODEL LOAD ERROR:", e)
    raise e

# =========================
# CLASS NAMES
# =========================
CLASS_NAMES = [
    "Apple Scab","Apple Black Rot","Apple Cedar Rust","Apple Healthy",
    "Corn Cercospora Leaf Spot","Corn Common Rust","Corn Healthy",
    "Grape Black Rot","Grape Esca","Grape Leaf Blight",
    "Potato Early Blight","Potato Late Blight","Potato Healthy",
    "Tomato Bacterial Spot","Tomato Early Blight","Tomato Late Blight",
    "Tomato Leaf Mold","Tomato Septoria Leaf Spot","Tomato Spider Mites",
    "Tomato Target Spot","Tomato Yellow Leaf Curl Virus",
    "Tomato Mosaic Virus","Tomato Healthy",
]

NUM_CLASSES = len(CLASS_NAMES)

# =========================
# AI KNOWLEDGE BASE
# =========================
def generate_info(name: str):
    crop = name.split()[0]
    return {
        "plants": [crop],
        "description": f"{name} is a plant disease affecting {crop} crops.",
        "treatment": [
            "Remove infected plant parts",
            "Apply recommended fungicide",
            "Improve air circulation",
            "Avoid overhead irrigation",
            "Practice crop rotation",
        ],
    }

CLASS_INFO = {
    name: generate_info(name)
    for name in CLASS_NAMES if "Healthy" not in name
}

# =========================
# IMAGE PREPROCESSING
# =========================
def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))
    arr = np.array(image).astype("float32") / 255.0
    return np.expand_dims(arr, axis=0)

# =========================
# PREDICT (ML ONLY - NO AUTH)
# =========================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image file")

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = preprocess_image(image)

        preds = model.predict(img)[0]
        indexed = sorted(
            enumerate(preds),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        predictions = []
        for idx, prob in indexed:
            disease = CLASS_NAMES[idx] if idx < NUM_CLASSES else "Unknown Disease"
            predictions.append({
                "disease": disease,
                "confidence": round(float(prob) * 100, 2),
            })

        top_conf = predictions[0]["confidence"]

        # =========================
        # CONFIDENCE FILTERING
        # =========================
        if top_conf < 60:
            result = {
                "predictions": [
                    {
                        "disease": "Uncertain Diagnosis",
                        "confidence": top_conf,
                    }
                ],
                "plants": [],
                "description": "The AI is not confident in this diagnosis.",
                "treatment": [
                    "Ensure proper lighting",
                    "Upload a clearer image",
                    "Consult agricultural expert",
                ],
            }
        else:
            main = predictions[0]["disease"]
            info = CLASS_INFO.get(main)

            result = {
                "predictions": predictions,
                "plants": info["plants"] if info else [],
                "description": info["description"] if info else "Healthy plant detected.",
                "treatment": info["treatment"] if info else ["No treatment required"],
            }

        return result

    except Exception as e:
        print("PREDICTION ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
import tensorflow as tf

MODEL_PATH = "models/disease_cnn.h5"
DATA_DIR = "data/raw/color"
IMG_SIZE = 224
BATCH_SIZE = 32

model = tf.keras.models.load_model(MODEL_PATH)

test_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATA_DIR,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    validation_split=0.2,
    subset="validation",
    seed=42
)

loss, acc = model.evaluate(test_ds)
print(f"✅ Validation Accuracy: {acc * 100:.2f}%")

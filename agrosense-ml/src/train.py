import os
import json
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# -------------------- CONFIG --------------------

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10

DATA_DIR = "data_distribution_for_SVM"
TRAIN_DIR = os.path.join(DATA_DIR, "train")
TEST_DIR = os.path.join(DATA_DIR, "test")

MODEL_DIR = "models"
MODEL_NAME = "disease_cnn.keras"
LABELS_PATH = os.path.join(MODEL_DIR, "labels.json")

os.makedirs(MODEL_DIR, exist_ok=True)

# -------------------- DATA LOADERS --------------------

train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=25,
    zoom_range=0.2,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.15,
    horizontal_flip=True,
)

test_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
)

test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False,
)

NUM_CLASSES = train_generator.num_classes

print(f"✅ Classes found: {NUM_CLASSES}")

# Save label mapping
labels = {v: k for k, v in train_generator.class_indices.items()}
with open(LABELS_PATH, "w") as f:
    json.dump(labels, f, indent=2)

print("✅ labels.json saved")

# -------------------- MODEL --------------------

model = models.Sequential(
    [
        layers.Input(shape=(224, 224, 3)),

        layers.Conv2D(32, (3, 3), activation="relu"),
        layers.MaxPooling2D(),

        layers.Conv2D(64, (3, 3), activation="relu"),
        layers.MaxPooling2D(),

        layers.Conv2D(128, (3, 3), activation="relu"),
        layers.MaxPooling2D(),

        layers.Flatten(),
        layers.Dense(256, activation="relu"),
        layers.Dropout(0.5),

        layers.Dense(NUM_CLASSES, activation="softmax"),
    ]
)

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()

# -------------------- TRAIN --------------------

history = model.fit(
    train_generator,
    validation_data=test_generator,
    epochs=EPOCHS,
)

# -------------------- SAVE MODEL --------------------

model.save(os.path.join(MODEL_DIR, MODEL_NAME))
print(f"✅ Model saved to {MODEL_DIR}/{MODEL_NAME}")

# Optional legacy format (only if you want)
model.save(os.path.join(MODEL_DIR, "disease_cnn.h5"))
print("ℹ️ Legacy .h5 model also saved")

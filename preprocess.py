import os
import json

DATA_DIR = "data/raw/color"
LABELS_PATH = "models/labels.json"

def generate_labels():
    classes = sorted([
        d for d in os.listdir(DATA_DIR)
        if os.path.isdir(os.path.join(DATA_DIR, d))
    ])

    label_map = {cls: idx for idx, cls in enumerate(classes)}

    os.makedirs("models", exist_ok=True)
    with open(LABELS_PATH, "w") as f:
        json.dump(label_map, f, indent=2)

    print("✅ Labels generated:")
    for k, v in label_map.items():
        print(f"{v}: {k}")

if __name__ == "__main__":
    generate_labels()

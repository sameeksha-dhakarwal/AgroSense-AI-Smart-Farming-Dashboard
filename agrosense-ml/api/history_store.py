import json
from pathlib import Path

DB_FILE = Path("scan_history.json")

def load_history():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {}

def save_history(data):
    DB_FILE.write_text(json.dumps(data, indent=2))

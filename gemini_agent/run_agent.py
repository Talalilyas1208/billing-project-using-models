# Gemini Background Code-Fixer for Billing Project
import os
import sys
from pathlib import Path

# Add script directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from watcher import start_watcher

if __name__ == "__main__":
    # Watches the parent directory (BILLING-PROJECT-USING-MODEL)
    project_root = Path(__file__).resolve().parent.parent
    start_watcher(project_root)

import os
import re
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

# Look for .env in current agent directory or parent project directory
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

SYSTEM_INSTRUCTION = """You are an expert automated background code-repair agent.
You are given a broken source file (React/JSX/JS/CSS/Python/JSON), its filename, and the corresponding error traceback/test failure/linter output.

Your job:
1. Analyze the exact cause of the failure.
2. Fix all bugs, syntax errors, missing imports, unclosed tags, or logic mismatches so that the project builds and runs without errors.
3. Preserve existing functional code, styling (Tailwind/Ant Design), state logic (Redux/React Hooks), and clean formatting.
4. Output the complete repaired file inside a single code block matching the language:
```javascript
// or ```jsx
// fixed code here
```
Do NOT include preamble, greeting, or conversational commentary outside the code block."""

# Official Google Gemini API model fallback list
FALLBACK_MODELS = [
    os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro-latest",
    "gemini-1.5-pro",
]

def _call_gemini_rest_api(prompt: str, api_key: str, model: str = "gemini-2.5-flash") -> str:
    """Fallback / Direct REST API caller for Google Gemini with automatic model fallback."""
    candidate_models = []
    for m in [model] + FALLBACK_MODELS:
        if m and m not in candidate_models:
            candidate_models.append(m)

    last_err = None

    for candidate in candidate_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{candidate}:generateContent?key={api_key}"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"SYSTEM INSTRUCTION:\n{SYSTEM_INSTRUCTION}\n\nUSER REQUEST:\n{prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "topP": 0.95
            }
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=60)
            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    return "".join(part.get("text", "") for part in parts)
            elif response.status_code == 404:
                last_err = f"Model {candidate} not found (404), trying next model..."
                continue
            else:
                last_err = f"Gemini API Error ({response.status_code}): {response.text}"
        except Exception as e:
            last_err = str(e)

    raise RuntimeError(f"Gemini API Failed after trying available models: {last_err}")

def call_gemini(prompt: str) -> str:
    """Invokes Gemini with auto-fallback."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not set. Please add it to your environment or .env file.\n"
            "Get a key at: https://aistudio.google.com/"
        )
    
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    return _call_gemini_rest_api(prompt, api_key, model=model_name)

def extract_code_block(raw_text: str) -> str:
    """Extracts the cleanest code block from the LLM output."""
    match = re.search(r"```(?:[a-zA-Z0-9_\-]+)?\n([\s\S]*?)```", raw_text)
    if match:
        return match.group(1).rstrip()
    return raw_text.strip()

def repair_file(file_path: Path, error_log: str) -> tuple[bool, str]:
    """
    Reads the broken file, sends it with the error log to Gemini,
    and returns (success, fixed_code_string).
    """
    if not file_path.exists():
        return False, f"File {file_path} does not exist."
    
    original_code = file_path.read_text(encoding="utf-8")
    
    prompt = f"""Target File: {file_path.name}
File Path: {file_path}

=== CURRENT FILE SOURCE CODE ===
{original_code}

=== ERROR / TEST FAILURE / LINTER LOG ===
{error_log}

Please output the complete repaired source code for {file_path.name}."""

    try:
        raw_response = call_gemini(prompt)
        fixed_code = extract_code_block(raw_response)
        if not fixed_code or len(fixed_code) < 10:
            return False, "Gemini returned empty or invalid code."
        return True, fixed_code
    except Exception as e:
        return False, str(e)

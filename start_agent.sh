
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

pip3 install -q requests python-dotenv watchdog rich google-generativeai

python3 gemini_agent/run_agent.py

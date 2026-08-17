import subprocess
import re
from pathlib import Path
from typing import NamedTuple

class TestResult(NamedTuple):
    passed: bool
    return_code: int
    output: str
    failed_files: list[Path]

def run_tests(target_dir: Path, command: list[str] = None) -> TestResult:
    """
    Runs linter / build check in the billing project.
    Uses `oxlint` or `npx vite build` or `npm run lint`.
    """
    if command is None:
        if (target_dir / "package.json").exists():
            # Check if oxlint or build scripts exist
            command = ["npx", "oxlint", "--deny-warnings"]
        else:
            command = ["pytest", "-v"]

    try:
        proc = subprocess.run(
            command,
            cwd=target_dir,
            capture_output=True,
            text=True
        )
        output = proc.stdout + "\n" + proc.stderr
        passed = (proc.return_code == 0)
    except Exception as e:
        return TestResult(passed=False, return_code=1, output=str(e), failed_files=[])
    
    failed_files: list[Path] = []
    if not passed:
        # Match error filenames in output
        potential_files = set(re.findall(r"([a-zA-Z0-9_\-/\\]+\.(?:jsx?|tsx?|py|css|json))", output))
        for p in potential_files:
            candidate = target_dir / p
            if candidate.exists() and candidate.is_file() and not any(ign in str(candidate) for ign in ["node_modules", ".git", "dist", "gemini_agent"]):
                failed_files.append(candidate.resolve())
            else:
                candidate_rel = Path(p)
                if candidate_rel.exists() and candidate_rel.is_file() and not any(ign in str(candidate_rel) for ign in ["node_modules", ".git", "dist", "gemini_agent"]):
                    failed_files.append(candidate_rel.resolve())

    return TestResult(
        passed=passed,
        return_code=proc.return_code,
        output=output,
        failed_files=list(set(failed_files))
    )

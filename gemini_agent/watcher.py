import time
import os
import sys
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Add current agent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from gemini_fixer import repair_file
from test_runner import run_tests

try:
    from rich.console import Console
    console = Console()
    def log(msg, style=None): console.print(msg, style=style)
except ImportError:
    def log(msg, style=None): print(msg)

SUPPORTED_EXTENSIONS = (".jsx", ".js", ".tsx", ".ts", ".css", ".json", ".py")
IGNORED_DIRS = ("node_modules", ".git", "dist", "gemini_agent", "__pycache__", ".vite")

class BillingFixerHandler(FileSystemEventHandler):
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.last_triggered = 0.0
        self.is_fixing = False

    def on_modified(self, event):
        if event.is_directory or self.is_fixing:
            return
        
        # Check ignored paths
        if any(ignored in event.src_path for ignored in IGNORED_DIRS):
            return

        if not event.src_path.endswith(SUPPORTED_EXTENSIONS):
            return

        now = time.time()
        # Debounce rapid file writes
        if now - self.last_triggered < 1.5:
            return
        self.last_triggered = now

        file_changed = Path(event.src_path)
        self.process_change(file_changed)

    def process_change(self, changed_file: Path):
        log(f"\n[bold cyan]👀 Detected change in:[/bold cyan] {changed_file.name}")
        log("[dim]Running project linter/build checks in background...[/dim]")

        test_res = run_tests(self.project_root)
        if test_res.passed:
            log("[bold green]✅ No errors or lint warnings detected! Clean build.[/bold green]")
            return

        log("[bold yellow]⚠️ Issue detected! Invoking Gemini Background Fixer...[/bold yellow]")
        
        target_to_repair = changed_file
        if test_res.failed_files and changed_file not in test_res.failed_files:
            target_to_repair = test_res.failed_files[0]

        log(f"[bold magenta]🤖 Asking Gemini ({os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')}) to repair:[/bold magenta] {target_to_repair.name}")

        self.is_fixing = True
        try:
            success, fixed_code = repair_file(target_to_repair, test_res.output)
            if not success:
                log(f"[bold red]❌ Repair failed:[/bold red] {fixed_code}")
                return

            target_to_repair.write_text(fixed_code, encoding="utf-8")
            log(f"[bold blue]💾 Applied AI patch to {target_to_repair.name}. Re-validating...[/bold blue]")

            retest = run_tests(self.project_root)
            if retest.passed:
                log(f"[bold green]🎉 SUCCESS! Gemini resolved the error in {target_to_repair.name}. Code is healthy![/bold green]")
            else:
                log(f"[bold yellow]⚠️ Some warnings/issues remain. Output preview:[/bold yellow]\n{retest.output[:250]}...")
        finally:
            time.sleep(1.0)
            self.is_fixing = False

def start_watcher(project_root: Path):
    event_handler = BillingFixerHandler(project_root)
    observer = Observer()
    observer.schedule(event_handler, str(project_root), recursive=True)
    observer.start()

    log(f"\n[bold green]🚀 Gemini Background Code-Fixer is ACTIVE for your Billing Project![/bold green]")
    log(f"[bold]Watching:[/bold] {project_root}")
    log("[dim]Whenever you save a file in VS Code, Gemini will auto-fix errors in the background.[/dim]")
    log("[dim]Press Ctrl+C to stop.\n[/dim]")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        log("\n[yellow]Watcher stopped.[/yellow]")
    observer.join()

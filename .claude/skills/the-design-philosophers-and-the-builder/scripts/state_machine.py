from pathlib import Path
import runpy

# Claude Code project-skill wrapper.
# When this skill lives in this repository, delegate to the canonical script.
# For standalone installation, replace this wrapper with the canonical scripts/state_machine.py content.

root_script = Path(__file__).resolve().parents[4] / "scripts" / "state_machine.py"
if root_script.exists():
    globals().update(runpy.run_path(str(root_script)))
else:
    raise FileNotFoundError(
        "Canonical state_machine.py not found. Copy scripts/state_machine.py into this skill's scripts folder for standalone use."
    )

# Linux Codex CLI Distribution

This package is the Linux Codex CLI bridge for The Design Philosophers and the Builder.

Codex CLI discovers project instructions from `AGENTS.md`. This distribution provides an `AGENTS.md` file that tells Codex CLI to use the philosopher-stack workflow, read the repository control documents first, and run the repository validation commands.

This package does **not** install Codex CLI itself. Install Codex CLI separately using the official OpenAI instructions for your Linux environment.

## Files

```text
linux/codex-cli/
  AGENTS.md
  install.sh
  README.md
```

## Project-local install

From this directory:

```bash
./install.sh --project /path/to/project
```

This copies:

```text
/path/to/project/AGENTS.md
```

Use this for a specific repository.

## Global install

From this directory:

```bash
./install.sh --global
```

This copies:

```text
~/.codex/AGENTS.md
```

Use this only when you want the philosopher-stack behavior to apply broadly to Codex CLI sessions.

## Overwrite behavior

The installer refuses to overwrite an existing `AGENTS.md` unless `--force` is used:

```bash
./install.sh --project /path/to/project --force
./install.sh --global --force
```

## Validation after install

In the target repository, run:

```bash
test -f AGENTS.md
python tools/verify_changelog_policy.py
python tools/verify_packages.py
(cd proofs/lean && lake build)
```

If a command is unavailable, report that plainly. Do not claim it passed.

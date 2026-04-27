#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Install The Design Philosophers and the Builder AGENTS.md bridge for Codex CLI on Linux.

Usage:
  ./install.sh --project /path/to/project
  ./install.sh --global

Options:
  --project PATH   Copy AGENTS.md into PATH/AGENTS.md.
  --global         Copy AGENTS.md into ~/.codex/AGENTS.md.
  --force          Overwrite an existing AGENTS.md.
  --help           Show this help.

This installer does not install Codex CLI itself. Install Codex CLI separately using the official OpenAI instructions for your environment.
USAGE
}

mode=""
target_project=""
force="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      [[ $# -ge 2 ]] || { echo "--project requires a path" >&2; exit 2; }
      mode="project"
      target_project="$2"
      shift 2
      ;;
    --global)
      mode="global"
      shift
      ;;
    --force)
      force="true"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$mode" ]]; then
  echo "choose --project PATH or --global" >&2
  usage >&2
  exit 2
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source_file="$script_dir/AGENTS.md"

if [[ ! -f "$source_file" ]]; then
  echo "missing source AGENTS.md beside installer: $source_file" >&2
  exit 1
fi

if [[ "$mode" == "project" ]]; then
  mkdir -p "$target_project"
  destination="$target_project/AGENTS.md"
else
  mkdir -p "$HOME/.codex"
  destination="$HOME/.codex/AGENTS.md"
fi

if [[ -e "$destination" && "$force" != "true" ]]; then
  echo "refusing to overwrite existing file: $destination" >&2
  echo "rerun with --force to replace it" >&2
  exit 1
fi

install -m 0644 "$source_file" "$destination"
printf 'installed %s\n' "$destination"

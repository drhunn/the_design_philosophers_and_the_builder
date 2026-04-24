# AnythingLLM Package

The self-contained AnythingLLM plugin package is here:

`plugins/agent-skills/the-design-philosophers-and-the-builder/`

Copy that whole folder into AnythingLLM's custom agent skills directory.

## Contents

- `plugin.json`
- `handler.js`
- `README.md`
- `agents/`
- `templates/handoff.toml`

The state machine is embedded directly in `handler.js`, so the plugin does not depend on repo-root files.

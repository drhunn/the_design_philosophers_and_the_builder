# Global Agent Rules

These rules apply to every agent step loaded by the state-machine dispatcher.

## Changelog Decision Required

Every handoff must explicitly set changelog.repo_changed to true or false.

Pure analysis that does not touch the repository sets repo_changed to false, required to false, and updated to false.

A repository change includes source code, documentation, templates, package metadata, workflow or CI files, proof models, verification scripts, licensing, repository layout, generated artifacts, and maintenance policy.

If the step changes the repository, it must update CHANGELOG.md and set repo_changed to true, required to true, updated to true, and path to CHANGELOG.md.

A repo-changing handoff must include date_time, scope, summary, and either commit_or_merge_hash or pending_hash set to true.

No agent may change the repository without recording this decision in the handoff.

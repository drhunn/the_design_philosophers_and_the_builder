# Changelog

All meaningful repository changes must be recorded here, not just source-code changes.

Repository-level changes include documentation, workflow files, package metadata, proof models, verification scripts, templates, licensing, repository layout, generated artifacts, and maintenance policy changes.

## Entry Format

Each entry must contain:

- date and time
- summary
- commit or merge hash
- scope

Use America/Chicago time unless a release process explicitly switches the repository to UTC.

```text
YYYY-MM-DD HH:MM:SS -05:00 | Scope | Summary | Commit/Merge Hash
```

For pull-request workflows, use the merge commit hash when available. For direct commits, use the direct commit hash. A future entry may fill in the hash for a previous changelog-maintenance commit; a commit cannot know its own final hash before it is created.

## 2026-04-25

| Date & Time | Scope | Summary | Commit/Merge Hash |
|---|---|---|---|
| 2026-04-25 06:20:04 -05:00 | Repository docs | Documented the changelog rule in the root README, including repo-level change coverage and required fields. | `5d5fb26b0f7d38497c4f5a807c3d83db318ac5d8` |
| 2026-04-25 06:18:33 -05:00 | Verification | Updated package verifier to require a repository changelog with date/time, summary, scope, and commit/merge hash entries. | `f606c07370730760427138ea836fba95e742ca44` |
| 2026-04-25 06:17:21 -05:00 | Repository docs | Added `CHANGELOG.md` and documented that repository-level changes, not only source-code changes, must be recorded. | `417aea553798fc569a063ac007985f5b6062ea90` |
| 2026-04-25 06:15:09 -05:00 | Repository docs | Documented Plato PRD workflow, including PRD handoff rules and verifier coverage. | `4a25e1a5e922e230f6f200f0160c7d7ca46a1189` |
| 2026-04-25 06:14:00 -05:00 | Package metadata | Updated AnythingLLM plugin metadata for Plato PRD Markdown output and PRD handoff links. | `d3ca102c4907fb38f5a6776e6ec65a4828a00634` |
| 2026-04-25 06:13:00 -05:00 | Package docs | Documented the AnythingLLM PRD template and Plato PRD output rule. | `90e4d4c49977b23c348a9242e52bf9c5cb58b1d0` |
| 2026-04-25 06:12:04 -05:00 | Package docs | Documented the Claude PRD template and Plato PRD output rule. | `987a5e988df90ea1796a4505c2c40385a8d7fdc2` |
| 2026-04-25 06:10:34 -05:00 | Package docs | Documented the Codex PRD template and Plato PRD output rule. | `6387556234a92283545a970519ef3e0f1b40fa15` |
| 2026-04-25 06:09:19 -05:00 | Verification | Updated package verifier to require Plato PRD artifacts, PRD template files, and `[markdown_links].prd`. | `91b7a0752df0196679eeab107ac4a51df4ad0bfa` |
| 2026-04-25 06:07:46 -05:00 | AnythingLLM runtime | Added PRD markdown link to embedded AnythingLLM handoff template. | `3a8b4a2700fdde067aac9779e32728a8c01d0a41` |
| 2026-04-25 06:03:12 -05:00 | AnythingLLM template | Added PRD markdown handoff link to AnythingLLM package TOML template. | `b3e3e9ac45bba861e038d1ebbd047ec1f8bbf116` |
| 2026-04-25 06:02:31 -05:00 | Claude template | Added PRD markdown handoff link to Claude package TOML template. | `dc06e0bdb1422193cd75a21d53f046659c3ded04` |
| 2026-04-25 06:01:40 -05:00 | Codex template | Added PRD markdown handoff link to Codex package TOML template. | `421c142bc9191c6c3df85f1965a4ceaf3b23b563` |
| 2026-04-25 05:58:01 -05:00 | AnythingLLM template | Added AnythingLLM PRD Markdown template. | `680ecfa827f0fa0de0b42b40ba8a7c531352c016` |
| 2026-04-25 05:57:15 -05:00 | Claude template | Added Claude PRD Markdown template. | `6f15f231b2a01fdec5ead9e1a6aa8a283b9638b9` |
| 2026-04-25 05:55:33 -05:00 | Codex template | Added Codex PRD Markdown template. | `0595518e9714a586daf815cf02ade1f5e4425f95` |
| 2026-04-25 05:54:59 -05:00 | AnythingLLM agent docs | Required AnythingLLM Plato to produce PRD Markdown before `ideal_model_complete`. | `2c1cb556a43b51d6023ded07039a918a056dd71e` |
| 2026-04-25 05:47:06 -05:00 | Claude agent docs | Required Claude Plato to produce PRD Markdown before `ideal_model_complete`. | `440400386be41314db7d2ee9941190b0f7ca5273` |
| 2026-04-25 05:46:08 -05:00 | Codex agent docs | Repaired truncated Plato PRD instructions. | `49582d509095beb277b567c58e60a6cfcf5c8b50` |
| 2026-04-25 05:45:20 -05:00 | Codex agent docs | Began requiring Plato PRD Markdown output. | `2356e9c128918350d940a36c445cb3d64d82ef55` |
| 2026-04-25 05:24:12 -05:00 | Verification | Added JS loader regression check rejecting path-like action names. | `8a586167c35082b2cde48081443151eb33695557` |
| 2026-04-25 05:15:57 -05:00 | AnythingLLM docs | Documented AnythingLLM dispatcher loader. | `0c9552e1a731332a054a6b37ca931c3b63394b80` |
| 2026-04-25 05:15:02 -05:00 | Claude docs | Documented Claude dispatcher loader. | `39e6767eddcfa4f2e929c96efd2a0a2660227159` |
| 2026-04-25 05:14:23 -05:00 | Codex docs | Documented Codex dispatcher loader. | `0a2a00864046f9cfae4d53bf5151b7d8ecd2f07b` |
| 2026-04-25 05:13:14 -05:00 | Repository docs | Documented action dispatcher loader in the root README. | `6f761e14888eff581662d2864ec94c2f77501def` |
| 2026-04-25 05:12:13 -05:00 | Verification | Updated verifier to check action dispatcher loaders. | `18b1ac66dbffd181dd3860214ecd0b1c82366a10` |
| 2026-04-25 05:09:56 -05:00 | AnythingLLM runtime | Added AnythingLLM action dispatcher loader operations. | `2a542fd35fa79420096a91fbeefd8515689418b0` |
| 2026-04-25 05:08:11 -05:00 | Claude runtime | Added Claude action dispatcher loader. | `b15a7e14e95d7e2f7c1db071406b68be56dee7cb` |
| 2026-04-24 22:34:56 -05:00 | Codex runtime | Added Codex action dispatcher loader. | `33e6436f1953d10bc92c1dd7a323d47a8a342cc0` |

## 2026-04-24

| Date & Time | Scope | Summary | Commit/Merge Hash |
|---|---|---|---|
| 2026-04-24 22:08:22 -05:00 | Lean proof project | Added Lake manifest for Lean proofs. | `7f7e72e50e3f60ec0614a26a6f47b3d40895fc62` |
| 2026-04-24 21:55:53 -05:00 | Repository docs | Documented Lean proof checks. | `06f8a4c60cc30bca52b73f70bceade3152fa0d1e` |
| 2026-04-24 21:54:40 -05:00 | GitHub workflow | Added Lean proof verification workflow. | `92d6016676dc844bd1c3ea893b84e1c4a54d7642` |
| 2026-04-24 21:54:05 -05:00 | Lean proof model | Added Lean state-machine proof model. | `c6c88d665ba3fa7190a300abdf19c5a887489c17` |

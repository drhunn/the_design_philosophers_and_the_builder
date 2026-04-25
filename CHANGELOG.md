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
| 2026-04-25 10:45:00 -05:00 | Package docs | Updated Codex and Claude package READMEs to document full package contents, dispatcher loader behavior, and PRD/changelog handoff artifacts. | `PENDING` |
| 2026-04-25 10:30:00 -05:00 | Changelog | Backfilled missing changelog entries and recorded the changelog/runtime conformance cleanup. | `14b924c33c5b9a4c3b802fc0550b0741ddc2df17` |
| 2026-04-25 10:29:14 -05:00 | Verification | Added verifier checks for PRD guard enforcement, changelog decisions, Lean PRD markers, and runtime conformance markers. | `1c76fd148de60d4291ad99f2d63fba902b5ea017` |
| 2026-04-25 10:25:00 -05:00 | Lean proof model | Guarded `idealModelComplete` with PRD Markdown evidence in the Lean model and added PRD guard theorems. | `7ce34c868ad9793031eabf3009c1b04140867393` |
| 2026-04-25 10:22:00 -05:00 | AnythingLLM runtime | Aligned AnythingLLM transitions and handoff validation with changelog and PRD-link guard requirements. | `539a7f087a91c6228f8b62bed7fe0c09082468c2` |
| 2026-04-25 10:18:00 -05:00 | Claude runtime | Enforced changelog and PRD handoff guards in the Claude Python runtime. | `d330b65b614665e134aef678bc1217fac7f8849e` |
| 2026-04-25 10:16:00 -05:00 | Codex runtime | Enforced changelog and PRD handoff guards in the Codex Python runtime. | `5900243604e64db2969e7b66d34211a6669881d3` |
| 2026-04-25 10:00:49 -05:00 | Repository docs | Documented the global changelog handoff rule, global agent preamble, and global loader behavior in the root README. | `a73628d15834847ba4a0ef3378713c75beae27b8` |
| 2026-04-25 09:50:50 -05:00 | Package docs | Documented AnythingLLM global changelog preamble behavior. | `52cda400b6bef79cf94013d94d3bc057fc501c6d` |
| 2026-04-25 09:49:26 -05:00 | Package docs | Documented Claude global changelog preamble behavior. | `740b141f09005d187cf901bed744f6e1211325af` |
| 2026-04-25 09:47:00 -05:00 | Package docs | Documented Codex global changelog preamble behavior. | `b9833985f413ba9dab5fa24a74966ede8c15f2c7` |
| 2026-04-25 09:25:00 -05:00 | Verification | Added verifier coverage for global changelog decisions. | `af7b007387287ce8fd5d312fcb815cf1bad9c1a8` |
| 2026-04-25 09:21:41 -05:00 | AnythingLLM metadata | Set AnythingLLM to use the global-preamble wrapper handler. | `00305bef67ad2f6534d9a36db8b18cebf591ba1b` |
| 2026-04-25 09:18:43 -05:00 | AnythingLLM runtime | Added AnythingLLM global preamble wrapper. | `b268dd5c7080f2bbf580ee69336b4247042d520e` |
| 2026-04-25 08:57:00 -05:00 | Claude runtime | Updated Claude dispatcher to prepend the global agent preamble. | `8753d058f67c0efb825cc4818f9db562a4823777` |
| 2026-04-25 08:54:26 -05:00 | Codex runtime | Updated Codex dispatcher to prepend the global agent preamble. | `c9f60c0da318e6b92345f5987860f7fee39b0553` |
| 2026-04-25 08:48:23 -05:00 | AnythingLLM agent docs | Added AnythingLLM global agent preamble. | `1230b1a785589b39e8544784ecb383e436eb8a6e` |
| 2026-04-25 08:47:40 -05:00 | Claude agent docs | Added Claude global agent preamble. | `ce29aadddc0e01247437a38ec54c187697ad71c3` |
| 2026-04-25 08:29:43 -05:00 | Codex agent docs | Added Codex global agent preamble. | `97b6fa8afbdbfb751a2de454c5a614824b289945` |
| 2026-04-25 08:26:40 -05:00 | Codex agent docs | Required Codex Aristotle to make an explicit changelog decision. | `370032ba7d1bad6502e87b9546ca2bf2b5756e86` |
| 2026-04-25 06:45:38 -05:00 | Codex agent docs | Required Codex Plato to make an explicit changelog decision. | `b769e2a077f9b3e80c2a00f58b30e2d0c3f6c652` |
| 2026-04-25 06:44:50 -05:00 | Codex agent docs | Required Codex Socrates to make an explicit changelog decision. | `4163b54cf80d39950fa97add9b6d1a3286066b14` |
| 2026-04-25 06:43:43 -05:00 | Codex agent docs | Documented Codex agent changelog decision requirements. | `193461b6b10a483a9d6e2ccec59b6786779bf767` |
| 2026-04-25 06:42:11 -05:00 | AnythingLLM runtime | Added changelog handoff decision fields to the embedded AnythingLLM runtime template. | `f74f75eca1cc43066ff2fd46c8185148c5cde839` |
| 2026-04-25 06:39:06 -05:00 | AnythingLLM template | Added AnythingLLM changelog handoff decision fields. | `01bc3ac27026a8556027559cb6603a86577e1748` |
| 2026-04-25 06:38:12 -05:00 | Claude template | Added Claude changelog handoff decision fields. | `75052f4d35446dd3c2e04889ac1a226e36ac7c80` |
| 2026-04-25 06:35:01 -05:00 | Codex template | Added Codex changelog handoff decision fields. | `85f3e7638e6c108758c072dbfffea676cbbcbfeb` |
| 2026-04-25 06:27:10 -05:00 | Changelog | Recorded the README changelog-rule documentation commit. | `6104fb4f8324b27c28f9b32530c6bf89b6be18ca` |
| 2026-04-25 06:25:52 -05:00 | Repository docs | Documented the changelog requirement in the root README. | `5d5fb26b0f7d38497c4f5a807c3d83db318ac5d8` |
| 2026-04-25 06:24:23 -05:00 | Changelog | Recorded verifier changelog enforcement. | `3adf9f062724b97246fd4bf12ac12405b45c0ac9` |
| 2026-04-25 06:23:06 -05:00 | Verification | Updated package verifier to require a repository changelog with date/time, summary, scope, and commit/merge hash entries. | `f606c07370730760427138ea836fba95e742ca44` |
| 2026-04-25 06:21:52 -05:00 | Repository docs | Added `CHANGELOG.md` and documented that repository-level changes, not only source-code changes, must be recorded. | `417aea553798fc569a063ac007985f5b6062ea90` |
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

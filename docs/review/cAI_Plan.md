# Code Review & Fix Process Optimization Plan

## Notes
- The code review process is split into Reviewer AI (rAI: analysis/report only, no code changes) and Coder AI (cAI: fix implementation only, with risk/approval gates).
- rAI uses `.windsurf/workflows/code-review.md` and `docs/scripts/code-review-analyzer.js` to produce structured reports, enforcing fresh analysis and mandatory task order.
- cAI uses `.windsurf/workflows/code-fix.md` and `docs/scripts/code-fix.js` to fix issues in a strict, approval-driven sequence.
- Key strengths: separation of concerns, fail-fast enforcement, safety-first, comprehensive analysis, structured communication.
- Identified optimization opportunities: automate file filtering (single --mode=full-review flag for full codebase, otherwise infer recent/manual from supplied files), dynamic risk assessment, automated pattern recognition, parallelize safe operations, introduce pattern memory.
- Key note: clarified file filtering logic—single flag for full review; default is git porcelain (recent), or process supplied files only.
- Pattern recognition automation should supplement and guide cAI, not replace manual/AI judgment—serves as a shortcut and context provider, not a sole authority.
- For Phase 1.2, "pattern recognition" refers primarily to TypeScript types and interfaces reuse (preventing duplicate type creation), with secondary focus on critical safety patterns (e.g., fail-fast error composition to prevent error swallowing). Abstract design patterns (e.g., Factory, Strategy) are not in scope for violation detection.
- In Phase 2, type/interface similarity detection should combine property name/type matching, structure similarity, and semantic similarity (including prefix-based name matching, e.g., User/UserActions) to robustly identify base class/interface duplication and type reuse opportunities. These strategies are complementary and should be used together.
- In confidence scoring for type/interface similarity, "Location Context" means types/interfaces defined in the same directory or module are more likely to be related or intended for reuse, so matches within the same folder (e.g., `lib/`, `types/`, or a specific feature folder) receive a higher confidence boost. This helps prioritize local reuse over cross-domain suggestions.
- For performance, the plan is to run a full scan of all source directories (app/, components/, lib/, hooks/, types/) every time, as script speed is expected to be sufficient. Add timing instrumentation to the script to output time spent per violation class in the summary, allowing real-world monitoring and future optimization if needed.
- For type/interface discovery, use the TypeScript AST (Abstract Syntax Tree) as the gold standard for accuracy and completeness, with performance metrics to monitor and optimize if needed.
- For critical safety pattern detection (Phase 2.2), expand error swallowing detection beyond fallback data to include silent try-catch, console-only error handling, ignored promise rejections, and swallowed async errors, with nuanced handling for legitimate fallback cases (e.g., missing images from third-party sources). Use full AST-based analysis for React hook dependency violations, tracking all risky dependency array changes and common mistakes.
- All pattern recognition tool decisions (type similarity and safety patterns) are now finalized; Phase 2 is complete.
- Architectural analysis complete: Fresh start with extracted utilities recommended for new architecture. Implementation handover document created for session continuity (`docs/review/implementation-handover.md`).
- Key workflow challenge: cAI often loses or ignores initial pattern/context guidance during long or complex fix sessions; persistent, contextually reinforced presentation of guidance is needed to keep fixes aligned with rAI recommendations.
- All fix tasks should be presented as standalone, context-rich units. Persistent context (e.g. lint, workflow, or command syntax guides) should be re-injected regularly, either by batching violations with context-loaders or limiting batch size to ensure context is always freshly loaded.
- New: The cAI (coder AI) process is explicitly phase-driven: cAI completes each phase in turn, reports at the end of the phase, then waits for rAI review. If issues are identified by rAI, cAI implements the findings, then seeks approval to continue with the next phase. No proactive code changes are made outside this cycle.
- All violations must be resolved before review completion; risk levels are for fix complexity/caution, not for deciding what to fix. Remove any tri-tier/tiered language from output and documentation.
- Need to establish and maintain a mapping between violation types and their most relevant context docs/workflows, so that context can be injected at the start of each batch of fixes for a given class of violation.
- Context docs in `docs/guides` are highly optimized for cognitive load (≤7800 bytes) due to an 8K stdout limit; context is injected via `.windsurf/workflows` orchestrators and `docs/scripts/docs-loader.js` to force cAI/AI ingestion. The batching and context injection architecture must respect this stdout constraint.
- New: rAI has identified a critical architectural flaw: `code-check.js` silently truncates stdout at 8K, causing incomplete violation display and technical debt risk. Solution requires JSON fallback output, critical cAI instructions, and extraction of a shared JSON output utility. See `docs/review/output/8k-truncation-solution.md` for full analysis and implementation steps.
- Future task: Analyze and/or extract new violation-specific context docs from existing guides and workflows to better support code review batching and context injection within the 8K limit.
- It may be necessary to create new, highly-targeted guides and workflows for each violation class by extracting and combining only the most relevant portions of existing docs, so that each class of violation receives the most optimized and concise context possible for the code review process.
- Supplement the implementation plan with a dedicated guidance markdown file to capture ongoing detailed observations, architectural nuances, and rationale that may not fit in the summary plan.
- Architectural split: Two scripts—`docs/review/code-review.js` (rAI, JSON output, per-task guidance, no stdout limit) and `docs/review/code-check.js` (cAI, stdout only, violation class batching, 8K limit aware).
- `docs/review/code-review.js` can output rich JSON with per-task guidance/context for rAI; no stdout size concerns.
- `docs/review/code-check.js` must gather violations across files, batch by class, and output guidance once per class to avoid 8K stdout bloat for cAI.
- Extracted utilities and output files are now located in `docs/review/utils/` and `docs/review/output/` respectively.
- Integration of code duplication detection (using jscpd) as a new violation class is planned; guidance should be provided on refactoring duplicated code into reusable functions/components.
- Risk assessment is progressive: trust cAI on mechanical fixes (e.g., console, comments, unused imports/variables, simple TypeScript annotations, basic formatting fixes, import path corrections) and allow batch approval for these classes. For high-risk or ambiguous violations (e.g., new type creation, complex error handling, function signature changes, state management modifications, API endpoint modifications, cross-component refactoring, React/hook dependency array changes, custom hook signature changes, context provider modifications), progressive guidance is applied as risk increases: advise more analysis at 7/10, insist on analysis at 8/10, and require a full re-analysis and explicit approval at 9/10+ (kill-switch). Risk scores must be normalized to a 10-point scale. Complex error handling is assigned a high risk score to force further analysis and/or approval. Missing semicolons are not a violation in this workflow. Other high-risk patterns (security/auth, config, build/deploy, data flow) are not currently in scope due to implementation overhead and lack of real-world issues so far, but may be revisited in future phases.
- `.windsurf/workflows/tech-code-quality.md` acts as a workflow orchestrator, loading highly optimized code quality context (ESLint, Prettier, TypeScript, structure standards) via sub-guides using `docs-loader.js` to ensure relevant context is injected into stdout for AI/cAI consumption, all within the 8K limit. Reorganization of context docs is not required at this time.

## Task List
- [x] Analyze code-review and code-fix workflows in detail
- [x] Analyze code-review-analyzer.js and code-fix.js scripts
- [x] Identify strengths and vulnerabilities in current process
- [x] Develop actionable optimization recommendations
- [x] Write structured implementation plan
- [x] Complete Phase 2.1: finalize type similarity, scoring, performance, and parsing decisions
- [x] Complete Phase 2.2: comprehensive error swallowing and React hook dependency detection (AST-based)
- [x] Analyze and recommend: clone existing script vs. rewrite from scratch for new architecture (COMPLETE)
- [x] Review/approve plan and prioritize optimizations for implementation
- [x] Begin utility extraction and dual-script foundation
- [x] Move extracted utilities to `docs/review/utils/` and create `docs/review/output/`
- [x] Implement architectural split: create `docs/review/code-review.js` (rAI) and `docs/review/code-check.js` (cAI) scripts
  - [x] `docs/review/code-review.js`: add file filtering, full-review mode, JSON output, per-task guidance/context
  - [x] `docs/review/code-check.js`: manual file args, stdout batching by violation class, guidance per class, no JSON output
- [x] Update file filtering script to support clarified --mode=full-review flag and logic (default: git porcelain if no files, process supplied files if given)
- [ ] Implement rAI architectural correction: remove tiered violation messaging, unify violation urgency, update risk guidance usage in code-check.js and code-review.js
- [ ] Establish and maintain a violation-type → context-doc/workflow mapping for targeted context batching
- [ ] Analyze and optimize existing context docs; extract/generate violation-specific context docs for review workflow
  - [ ] Identify which parts of existing docs are most relevant for each violation class
  - [ ] Create new, highly-targeted context docs and workflows as needed for each violation class
- [x] Implement critical 8K truncation solution:
  - [x] Extract JSON output utility from code-review.js to utils/json-output.js
  - [x] Refactor code-check.js to use JSON fallback output when stdout would exceed 8K
  - [x] Add critical cAI instructions to stdout when truncation occurs, per rAI report
  - [x] Validate: small violation sets use stdout; large sets use JSON fallback and clear instructions
  - [x] Test for zero violation masking, file path accuracy, and data completeness

## Current Goal
Violation context batching and mapping
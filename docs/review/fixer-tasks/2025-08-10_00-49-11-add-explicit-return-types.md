# Fixer Task: Add Explicit TypeScript Return Types (7 violations)

Timestamp: 2025-08-10T00:49:11+01:00
Source report: `docs/review/code_review.md` (updated 2025-08-10T00:46:39+01:00)
Scope: Changed production files only (app/, components/, lib/, types/, hooks/)

## Goal
Add missing explicit return types for the items below so the analyzer passes with 0 TypeScript return-type violations.

## Files and Checklist

### components/wizard/SpecificationWizard.tsx

- [ ] Line 47 — `handleStepClick`
  - Prefer one of:
    - Annotate variable: `const handleStepClick: (...args) => void = useCallback(...)`
    - or Generic on wrapper: `useCallback<(...args) => void>(...)`
  - Guidance:
    - Match actual parameter types by inspecting usages of `handleStepClick` within this file (e.g., step index, event). Avoid `any`.
    - Likely return type is `void`. If body returns a value, annotate accordingly.

- [ ] Line 60 — `steps`
  - Prefer one of:
    - If built via helper (e.g., `createWizardSteps()`), annotate from helper: `const steps: ReturnType<typeof createWizardSteps> = useMemo(...)`
    - If defined inline, introduce/align to a domain type like `WizardStep[]` if it already exists. If not, define a minimal type in `types/` and import here.
  - Guidance:
    - Keep types canonical and reusable. Do not inline large literal types if a named type already exists.

- [ ] Line 69 — `progressSteps`
  - Prefer one of:
    - Derive from `steps`: `type Step = typeof steps[number]` then extend: `const progressSteps: Array<Step & { isComplete: boolean }>`
    - If a helper creates these, use `ReturnType<typeof helper>`.
  - Guidance:
    - Keep the element type explicit and expressive. Avoid `any`/`unknown` unless strictly necessary.

### components/wizard/hooks/useCharacteristicEnums.ts

Four `selector` callbacks missing explicit return types:

- [ ] Line 9 — `selector`
- [ ] Line 14 — `selector`
- [ ] Line 19 — `selector`
- [ ] Line 24 — `selector`

Guidance:
- Choose one of the following approaches per selector:
  1) Variable annotation:
     - `const selector: (enums: CharacteristicEnums) => DesiredReturn = useCallback((enums) => ..., [deps])`
  2) Wrapper generic:
     - `useCallback<(enums: CharacteristicEnums) => DesiredReturn>((enums) => ..., [deps])`
- Determine `CharacteristicEnums` (or equivalent) and `DesiredReturn` from the implementation and existing types under `types/` or `lib/types/`.
- Prefer domain types over structural literals when such types exist.

## Constraints
- Do not refactor logic; only add explicit types.
- Keep types precise; avoid `any`. Use `void` where functions only produce side-effects.
- Align with existing canonical domain types in `types/` and `lib/types/` where possible.

## Validation Steps
1) Per-file quick check during fixes:
```bash
cmd /c node docs/scripts/code-review-analyzer.js components/wizard/SpecificationWizard.tsx
cmd /c node docs/scripts/code-review-analyzer.js components/wizard/hooks/useCharacteristicEnums.ts
```
2) Full scoped run after all changes:
```bash
cmd /c node docs/scripts/code-review-analyzer.js app/edit-specification/[id]/page.tsx components/layout/NavContent.tsx components/wizard/SpecificationWizard.tsx components/wizard/hooks/useCharacteristicEnums.ts components/wizard/hooks/useEnumUtils.ts types/enum-value.ts types/enum.ts types/index.ts types/specification.ts hooks/useTrials.ts lib/repositories/includes/trial-include.ts lib/repositories/trial-brand-read-repository.ts lib/repositories/trial-junction-service.ts lib/repositories/trial-read-repository.ts lib/repositories/trial-write-repository.ts lib/repositories/types/trial-types.ts lib/services/trial-service.ts lib/services/trial-transformers-api.ts lib/services/trial-transformers-db.ts lib/types/trial.ts lib/validators/trial-validator.ts
```
3) Compile TypeScript to ensure no type errors are introduced.

## Acceptance Criteria
- `docs/scripts/code-review-analyzer.js` reports: `CODE REVIEW: 21 files | 21 passed | 0 failed` for the above scope.
- TypeScript build succeeds without new errors.
- No behavior changes.

## Notes
- If you need to introduce a new shared type for steps, place it under `types/` (or reuse existing) and import locally.
- Prefer `ReturnType<typeof fn>`/`Parameters<typeof fn>` to keep types consistent with helpers.
- For database schema work (not in scope here): after any DB schema change, always run `npx prisma db pull` and `npx prisma generate` to sync Prisma; never edit `prisma/schema.prisma` manually.

# Code Update Sequence Plan

## Overview
Systematic plan for updating code references after database table renaming, organized by risk level and dependencies.

## Update Sequence Strategy

### Risk Classification
- **HIGH RISK**: Database operations, business logic, API transformations
- **MEDIUM RISK**: Type definitions, include configurations
- **LOW RISK**: Generated files (auto-update), simple reference updates

### Dependency Order
1. Core schema changes (enables everything else)
2. Service layer (handles database operations)
3. Type definitions (used by other code)
4. Include configurations (used by services)
5. API transformers (depend on types and services)

## Phase-by-Phase Update Plan

### PHASE 1: Core Schema Updates ⚡ HIGH PRIORITY
**Goal**: Update Prisma schema to match new table names

**Files to Update:**
1. `prisma/schema.prisma` - **CRITICAL**
   - Update model names (5 models)
   - Update relation field names in `specifications` model
   - Update foreign key constraint map attributes
   - Update index map attributes

**Risk**: HIGH - Schema is foundation for everything else
**Dependencies**: Must be completed before any code changes
**Validation**: `npx prisma generate` must succeed

---

### PHASE 2: Service Layer Updates ⚡ HIGH RISK
**Goal**: Update database operations to use new table names

**Priority Order (by risk):**

#### 2.1 Junction Table Operations (HIGHEST RISK)
**File**: `lib/repositories/specification-junction-service.ts`
- Line 19: `tx.spec_cures.createMany(` → `tx.spec_junction_cures.createMany(`
- Line 22: `tx.spec_tasting_notes.createMany(` → `tx.spec_junction_tasting_notes.createMany(`
- Line 26: `tx.spec_tobacco_types.createMany(` → `tx.spec_junction_tobacco_types.createMany(`
- Line 35: `tx.spec_cures.deleteMany(` → `tx.spec_junction_cures.deleteMany(`
- Line 38: `tx.spec_tasting_notes.deleteMany(` → `tx.spec_junction_tasting_notes.deleteMany(`
- Line 42: `tx.spec_tobacco_types.deleteMany(` → `tx.spec_junction_tobacco_types.deleteMany(`

#### 2.2 AI Synthesis Operations (HIGH RISK)
**File**: `lib/repositories/ai-synth-service.ts`
- Line 23: `prisma.ai_synth_metadata.findMany(` → `prisma.ai_spec_metadata.findMany(`
- Line 33: `prisma.ai_synth_metadata.findUnique(` → `prisma.ai_spec_metadata.findUnique(`
- Line 42: `prisma.ai_synth_metadata.create(` → `prisma.ai_spec_metadata.create(`
- Line 57: `prisma.ai_synth_metadata.update(` → `prisma.ai_spec_metadata.update(`
- Line 72: `prisma.ai_synth_metadata.delete(` → `prisma.ai_spec_metadata.delete(`
- Line 89: `prisma.ai_synth_sources.createMany(` → `prisma.ai_spec_sources.createMany(`
- Line 98: `prisma.ai_synth_sources.deleteMany(` → `prisma.ai_spec_sources.deleteMany(`

**Risk**: HIGH - Core business operations
**Dependencies**: Requires Phase 1 completion and Prisma regeneration
**Validation**: TypeScript compilation after each file

---

### PHASE 3: Type Definition Updates 🔶 MEDIUM RISK
**Goal**: Update TypeScript interfaces and type references

#### 3.1 Core Type Definitions
**File**: `types/ai-synth.ts`
- Line 50: `spec_tasting_notes: Array<{` → `spec_junction_tasting_notes: Array<{`
- Line 52: `spec_tobacco_types: Array<{` → `spec_junction_tobacco_types: Array<{`
- Line 53: `enum_tobacco_types: { id: number; name: string }` (verify AI table relations)

**File**: `types/enum.ts`
- Line 49: `| 'enum_tasting_notes'` (related to junction tables - verify needed)
- Line 51: `| 'enum_tobacco_types'` (related to junction tables - verify needed)
- Line 71: `'enum_tasting_notes',` (validation array)
- Line 73: `'enum_tobacco_types',` (validation array)

**Risk**: MEDIUM - Type errors will surface in compilation
**Dependencies**: Requires Phase 2 service updates
**Validation**: TypeScript compilation, no type errors

---

### PHASE 4: Include Configuration Updates 🔶 MEDIUM RISK
**Goal**: Update Prisma query include configurations

#### 4.1 AI Synthesis Includes
**File**: `lib/repositories/includes/ai-synth-include.ts`
- Line 8: `ai_synth_metadata: {` → `ai_spec_metadata: {`
- Line 11: `spec_cures: {` → `spec_junction_cures: {`
- Line 14: `spec_tasting_notes: {` → `spec_junction_tasting_notes: {`
- Line 18: `spec_tobacco_types: {` → `spec_junction_tobacco_types: {`

#### 4.2 Specification Includes
**File**: `lib/repositories/includes/specification-include.ts`
- Line 9: `spec_cures: {` → `spec_junction_cures: {`
- Line 12: `spec_tasting_notes: {` → `spec_junction_tasting_notes: {`
- Line 16: `spec_tobacco_types: {` → `spec_junction_tobacco_types: {`

**Risk**: MEDIUM - Query includes affect data loading
**Dependencies**: Requires Phase 1-2 completion
**Validation**: Query operations work correctly

---

### PHASE 5: API Transformer Updates 🟡 MEDIUM-LOW RISK
**Goal**: Update API response transformations

**File**: `lib/services/specification-transformers-api.ts`
- Line 21: `specification.spec_tasting_notes?.map(` → `specification.spec_junction_tasting_notes?.map(`
- Line 22: `specification.spec_tobacco_types?.map(stt => stt.enum_tobacco_types.id)` → `specification.spec_junction_tobacco_types?.map(...)`
- Line 45: `specification.spec_tasting_notes?.map(` → `specification.spec_junction_tasting_notes?.map(`
- Line 46: `specification.spec_tobacco_types?.map(stt => stt.enum_tobacco_types)` → `specification.spec_junction_tobacco_types?.map(...)`

**File**: `lib/services/specification-transformers-ai.ts`
- Line 8: Verify `enum_ai_confidence: { id: number; name: string }` (related to ai_spec_metadata)

**Risk**: MEDIUM-LOW - API transformation logic
**Dependencies**: Requires Phase 1-4 completion
**Validation**: API responses maintain correct structure

---

### PHASE 6: Final Validation 🟢 LOW RISK
**Goal**: Comprehensive testing and validation

#### 6.1 Regenerate Prisma Client
```bash
npx prisma generate
```

#### 6.2 TypeScript Compilation
```bash
npx tsc --noEmit
```

#### 6.3 Test Database Operations
- Verify junction table operations work
- Verify AI synthesis queries work
- Verify API transformations work
- Check for any remaining old table references

**Risk**: LOW - Validation and testing
**Dependencies**: All previous phases complete
**Validation**: All tests pass, no compilation errors

## Critical Success Factors

### Before Each Phase
1. Ensure previous phase is fully complete
2. Run TypeScript compilation check
3. Verify no breaking changes

### During Each Phase
1. Update one file at a time
2. Test compilation immediately after each file
3. Rollback if unexpected errors occur

### After Each Phase
1. Full TypeScript compilation check
2. Verify expected functionality works
3. Document any issues discovered

## Rollback Strategy

### If Phase Fails
1. Revert all changes made in current phase
2. Diagnose root cause
3. Update plan if needed
4. Retry with fixes

### Emergency Rollback
1. Revert database migration if needed
2. Restore original Prisma schema
3. Regenerate original Prisma client
4. Verify system returns to working state

---
*Generated: 2025-01-15*
*Status: Ready for Phase 1 Execution*

# Database Table Renaming Mapping

## Overview
Comprehensive mapping of table names to be renamed and all their references throughout the codebase.

## Proposed Renaming Scheme

### Junction Tables
- `spec_cures` → `spec_junction_cures`
- `spec_tasting_notes` → `spec_junction_tasting_notes`
- `spec_tobacco_types` → `spec_junction_tobacco_types`

### AI Synthesis Tables
- `ai_synth_metadata` → `ai_spec_metadata`
- `ai_synth_sources` → `ai_spec_sources`

### User Table (if needed)
- `users` → `app_users`

## Reference Analysis

### 1. spec_cures → spec_junction_cures

**Prisma Schema References:**
- `prisma/schema.prisma` line 128: `model spec_cures {`
- `prisma/schema.prisma` line 190: `spec_cures spec_cures[]` (in specifications model)
- Junction model with composite primary key: `[specification_id, enum_cure_id]`
- Foreign key relations to `enum_cures` and `specifications`

**Code References:**
- `lib/repositories/specification-junction-service.ts` line 19: `tx.spec_cures.createMany(`
- `lib/repositories/specification-junction-service.ts` line 35: `tx.spec_cures.deleteMany(`
- `lib/repositories/includes/ai-synth-include.ts` line 11: `spec_cures: {`
- `lib/repositories/includes/specification-include.ts` line 9: `spec_cures: {`

**Type References:**
- Generated Prisma client files (will regenerate automatically)

### 2. spec_tasting_notes → spec_junction_tasting_notes

**Prisma Schema References:**
- `prisma/schema.prisma` line 140: `model spec_tasting_notes {`
- `prisma/schema.prisma` line 191: `spec_tasting_notes spec_tasting_notes[]` (in specifications model)
- Junction model with composite primary key: `[specification_id, enum_tasting_note_id]`
- Foreign key relations to `enum_tasting_notes` and `specifications`

**Code References:**
- `lib/repositories/specification-junction-service.ts` line 22: `tx.spec_tasting_notes.createMany(`
- `lib/repositories/specification-junction-service.ts` line 38: `tx.spec_tasting_notes.deleteMany(`
- `lib/repositories/includes/ai-synth-include.ts` line 14: `spec_tasting_notes: {`
- `lib/repositories/includes/specification-include.ts` line 12: `spec_tasting_notes: {`
- `lib/services/specification-transformers-api.ts` line 21: `specification.spec_tasting_notes?.map(`
- `lib/services/specification-transformers-api.ts` line 45: `specification.spec_tasting_notes?.map(`

**Type References:**
- `types/ai-synth.ts` line 50: `spec_tasting_notes: Array<{`
- Generated Prisma client files (will regenerate automatically)

### 3. spec_tobacco_types → spec_junction_tobacco_types

**Prisma Schema References:**
- `prisma/schema.prisma` line 158: `model spec_tobacco_types {`
- `prisma/schema.prisma` line 191: `spec_tobacco_types spec_tobacco_types[]` (in specifications model)
- Junction model with composite primary key: `[specification_id, enum_tobacco_type_id]`
- Foreign key relations to `enum_tobacco_types` and `specifications`

**Code References:**
- `lib/repositories/specification-junction-service.ts` line 26: `tx.spec_tobacco_types.createMany(`
- `lib/repositories/specification-junction-service.ts` line 42: `tx.spec_tobacco_types.deleteMany(`
- `lib/repositories/includes/ai-synth-include.ts` line 18: `spec_tobacco_types: {`
- `lib/repositories/includes/specification-include.ts` line 16: `spec_tobacco_types: {`
- `lib/services/specification-transformers-api.ts` line 22: `specification.spec_tobacco_types?.map(`
- `lib/services/specification-transformers-api.ts` line 46: `specification.spec_tobacco_types?.map(`

**Type References:**
- `types/ai-synth.ts` line 52: `spec_tobacco_types: Array<{`
- Generated Prisma client files (will regenerate automatically)

### 4. ai_synth_metadata → ai_spec_metadata

**Prisma Schema References:**
- `prisma/schema.prisma` line 241: `model ai_synth_metadata {`
- `prisma/schema.prisma` line 182: `ai_synth_metadata ai_synth_metadata?` (in specifications model)
- Relations to `enum_ai_confidence`, `specifications`, and `ai_synth_sources`
- Multiple indexes on `confidence`, `shopify_handle`, `specification_id`, `updated_at`

**Code References:**
- `lib/repositories/ai-synth-service.ts` line 23: `prisma.ai_synth_metadata.findMany(`
- `lib/repositories/ai-synth-service.ts` line 33: `prisma.ai_synth_metadata.findUnique(`
- `lib/repositories/ai-synth-service.ts` line 42: `prisma.ai_synth_metadata.create(`
- `lib/repositories/ai-synth-service.ts` line 57: `prisma.ai_synth_metadata.update(`
- `lib/repositories/ai-synth-service.ts` line 72: `prisma.ai_synth_metadata.delete(`
- `lib/repositories/includes/ai-synth-include.ts` line 8: `ai_synth_metadata: {`

**Type References:**
- Multiple files use `ai_synth_metadata` in TypeScript interfaces
- Generated Prisma client files (will regenerate automatically)

### 5. ai_synth_sources → ai_spec_sources

**Prisma Schema References:**
- `prisma/schema.prisma` line 260: `model ai_synth_sources {`
- `prisma/schema.prisma` line 183: `ai_synth_sources ai_synth_sources[]` (in specifications model)
- Junction model with composite primary key: `[ai_spec_id, source_spec_id]`
- Foreign key relations to `ai_synth_metadata` and `specifications`
- Indexes on `ai_spec_id` and `source_spec_id`

**Code References:**
- `lib/repositories/ai-synth-service.ts` line 89: `prisma.ai_synth_sources.createMany(`
- `lib/repositories/ai-synth-service.ts` line 98: `prisma.ai_synth_sources.deleteMany(`

**Type References:**
- Generated Prisma client files (will regenerate automatically)

### 6. enum_ai_confidence (Related to AI tables)

**Referenced by ai_synth_metadata:**
- `prisma/schema.prisma` line 248: Foreign key relation in ai_synth_metadata
- `lib/services/specification-transformers-ai.ts` line 8: `enum_ai_confidence: { id: number; name: string }`

### 7. enum_tasting_notes (Related to junction tables)

**Referenced by spec_tasting_notes:**
- `prisma/schema.prisma` line 85: `model enum_tasting_notes {`
- `types/enum.ts` line 49: `| 'enum_tasting_notes'`
- `types/enum.ts` line 71: `'enum_tasting_notes',`

### 8. enum_tobacco_types (Related to junction tables)

**Referenced by spec_tobacco_types:**
- `prisma/schema.prisma` line 97: `model enum_tobacco_types {`
- `types/enum.ts` line 51: `| 'enum_tobacco_types'`
- `types/enum.ts` line 73: `'enum_tobacco_types',`

## Critical Files to Update

### Prisma Schema Changes Required
1. **Model definitions** in `prisma/schema.prisma`
2. **Relation field names** in `specifications` model
3. **Foreign key constraint names** (map attributes)
4. **Index names** (map attributes)

### TypeScript Code Changes Required
1. **Service layer**: `lib/repositories/` files
2. **Include configurations**: `lib/repositories/includes/` files
3. **Type definitions**: `types/` files
4. **API transformers**: `lib/services/specification-transformers-*.ts`

### Files That Will Auto-Update
- All files in `node_modules/.prisma/client/` (regenerated by Prisma)
- Generated TypeScript type definitions

## Migration Strategy

### Phase 1: Schema Planning
1. ✅ **Complete reference discovery** (this document)
2. Create detailed Prisma migration script
3. Plan code update sequence

### Phase 2: Database Migration
1. Create Prisma migration with table renames
2. Update all foreign key constraints
3. Update all index names

### Phase 3: Code Updates
1. Update Prisma schema model definitions
2. Update service layer code
3. Update type definitions
4. Update include configurations
5. Update API transformers

### Phase 4: Validation
1. Regenerate Prisma client
2. Run TypeScript compilation
3. Test database operations
4. Validate all references updated

## Risk Assessment

### High Risk Areas
- Junction table operations in `specification-junction-service.ts`
- API response transformations that rely on relation names
- Any dynamic SQL or raw queries (none found)

### Low Risk Areas
- Generated Prisma client code (auto-updates)
- Type-only references (will cause compilation errors if missed)

## Next Steps
1. **User approval** for this mapping and approach
2. Create detailed Prisma migration script
3. Begin systematic code updates following the methodology
4. Test each change incrementally

---
*Generated: 2025-01-15*
*Status: Discovery Complete - Awaiting Approval*

# Plan: Optimize Document Graph Data Structure

## Problem Statement

The `document-graph.json` contains significant data redundancy and potential legacy fields that may not be used during AI document ingestion. This creates:

1. **Bloated file size** - Unnecessary data in the graph
2. **Maintenance overhead** - Multiple fields tracking similar data  
3. **Confusion** - Unclear which fields are actually used
4. **Legacy cruft** - Old script outputs mixed with current data

## Current Redundancy Analysis

### **Example Node (ID: 1001):**
```json
{
  "cogLoad": 62.83,             // ❓ Field #1
  "cognitiveLoadScore": 61.78,  // ❓ Field #2  
  "cognitiveLoadFull": 61.78,   // ❓ Field #3 (same as #2?)
  "cognitiveLoadComponents": {   // ❓ Detailed breakdown
    "readability": 96.75,
    "lexical": 66.67,
    "coherence": 10.27
  },
  "codeExcluded": false,        // ❓ Processing flag
  "lastCLSUpdate": "2025-06-20..." // ❓ Maintenance timestamp
}
```

### **Questions to Answer:**
1. Which cognitive load field is the "source of truth"?
2. Are detailed components (readability/lexical/coherence) used?
3. Is cognitive load data used during AI ingestion at all?
4. Should processing metadata be separated from ingestion data?

## Investigation Plan

### **Step 1: Analyze Ingestion Engine Usage**
```bash
# Search for cognitive load field usage in ingestion scripts
grep -r "cogLoad\|cognitiveLoad" docs/ai/ingestion/scripts/
grep -r "readability\|lexical\|coherence" docs/ai/ingestion/scripts/
grep -r "codeExcluded\|lastCLSUpdate" docs/ai/ingestion/scripts/
```

### **Step 2: Trace Field Origins**
```bash
# Find scripts that generate these fields
grep -r "cogLoad" docs/ai/maintenance/scripts/
grep -r "cognitiveLoadScore" docs/ai/maintenance/scripts/
grep -r "lastCLSUpdate" docs/ai/maintenance/scripts/
```

### **Step 3: Determine Essential vs Optional Data**

**Essential for AI Ingestion:**
- `id` - Link resolution
- `path` - File loading
- `workflows` - Workflow mapping
- `type` - Context categorization
- `priority` - Loading order
- `description` - AI context

**Potentially Optional:**
- All cognitive load fields (if not used during ingestion)
- Processing flags (`codeExcluded`)
- Maintenance timestamps (`lastCLSUpdate`)
- Detailed metrics (components breakdown)

## Proposed Solutions

### **Option A: Minimal Graph (Aggressive Cleanup)**
```json
{
  "id": 1001,
  "path": "docs/ai/ingestion/ai-workflow-guide.md",
  "type": "index",
  "priority": 1,
  "description": "Primary entry point for AI documentation navigation",
  "workflows": ["docs-ai-context"]
}
```

### **Option B: Separated Concerns**
```json
// Core ingestion data
{
  "id": 1001,
  "path": "docs/ai/ingestion/ai-workflow-guide.md", 
  "type": "index",
  "priority": 1,
  "description": "Primary entry point for AI documentation navigation",
  "workflows": ["docs-ai-context"],
  
  // Optional: Move metrics to separate section
  "metrics": {
    "cognitiveLoadScore": 61.78,
    "lastUpdated": "2025-06-20T21:48:18.961Z"
  }
}
```

### **Option C: Single Source of Truth**
```json
{
  "id": 1001,
  "path": "docs/ai/ingestion/ai-workflow-guide.md",
  "type": "index", 
  "priority": 1,
  "description": "Primary entry point for AI documentation navigation",
  "workflows": ["docs-ai-context"],
  "cognitiveLoad": 61.78  // Single field, clear name
}
```

## Investigation Tasks

### **Task 1: Usage Analysis**
- [ ] Check if ingestion engine uses cognitive load scores
- [ ] Identify which scripts generate `cogLoad` vs `cognitiveLoadScore`
- [ ] Determine if detailed components are consumed anywhere
- [ ] Find references to `codeExcluded` and `lastCLSUpdate`

### **Task 2: Field Reconciliation**
- [ ] Compare values between `cogLoad`, `cognitiveLoadScore`, `cognitiveLoadFull`
- [ ] Identify the "canonical" cognitive load value
- [ ] Determine if multiple fields serve different purposes
- [ ] Check for legacy field naming patterns

### **Task 3: Impact Assessment**
- [ ] Test ingestion with minimal graph structure
- [ ] Verify workflow systems still function
- [ ] Ensure link resolution continues working
- [ ] Validate cognitive load scripts compatibility

### **Task 4: Cleanup Implementation**
- [ ] Create graph optimization script
- [ ] Add backward compatibility checks
- [ ] Update dependent scripts if needed
- [ ] Test with various workflow scenarios

## Success Criteria

1. ✅ **Eliminate redundant fields** (multiple cognitive load fields)
2. ✅ **Maintain ingestion functionality** (no broken workflows)
3. ✅ **Reduce file size** (remove unused metadata)
4. ✅ **Clarify data purposes** (ingestion vs maintenance data)
5. ✅ **Single source of truth** (one cognitive load field if needed)

## Potential Benefits

- **Smaller graph file** - Faster loading and processing
- **Clearer data model** - Easier maintenance and debugging  
- **Reduced complexity** - Fewer fields to manage
- **Better separation** - Ingestion data vs processing metadata
- **Eliminated confusion** - Clear field purposes

## Risks & Mitigation

**Risk:** Breaking existing scripts that depend on removed fields
**Mitigation:** Thorough usage analysis before removal

**Risk:** Losing valuable cognitive load data
**Mitigation:** Identify actual usage before cleanup

**Risk:** Workflow disruption
**Mitigation:** Test with minimal viable graph structure

## Next Steps

1. **Tomorrow:** Investigate actual field usage in ingestion engine
2. **Analyze:** Which cognitive load field is canonical
3. **Test:** Minimal graph structure functionality
4. **Implement:** Cleanup script based on findings
5. **Validate:** All workflows continue functioning

---

**Status:** Ready for investigation
**Priority:** MEDIUM - Optimization, not critical functionality
**Estimated Effort:** 4-6 hours investigation + 2-3 hours cleanup

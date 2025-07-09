# Lint Cleanup & Error Handling Methodology - Handover Documentation

## 🚨 Critical Policies - NEVER VIOLATE

### Error Handling Permission Protocol
- **NEVER fix error handling without explicit user approval**
- All error handling changes are classified as **RISKY** and require permission
- Only **SAFE** fixes (unused imports, console.log removal) can be auto-applied
- When in doubt, **ASK FIRST** - never assume permission

### Error Classification System

#### **SAFE Fixes** (Auto-Approved)
- Remove unused variables/imports
- Remove `console.log`/`console.error` statements
- Fix TypeScript `any` types with existing interfaces
- Remove duplicate interfaces (consolidate to canonical)

#### **RISKY Fixes** (Requires Permission)
- Any logic changes in catch blocks
- Modifying function signatures
- Changing error propagation patterns
- Adding/removing try/catch blocks
- State management modifications

### Error Composition Pattern (Mandatory)

#### ❌ **ERROR SWALLOWING ANTI-PATTERN** (Forbidden)
```javascript
// NEVER DO THIS - Silent error swallowing
try {
  await riskyOperation()
} catch (error) {
  return [] // ← Swallows error, hides failure
}
```

#### ✅ **ERROR COMPOSITION PATTERN** (Required)
```javascript
// ALWAYS DO THIS - Fail-fast with context
try {
  await riskyOperation()
} catch (error) {
  throw new Error(`Failed to perform risky operation: ${error.message}`)
}
```

## 🔧 Lint Cleanup Methodology

### Step-by-Step Protocol
1. **ONE issue at a time** - Fix single lint error, then checkpoint
2. **Classify risk level** - Safe vs Risky before proceeding
3. **Batch safe fixes** only when explicitly confirmed
4. **Never cascade fixes** - avoid "while I'm here" improvements
5. **Test compilation** after each significant change

### Risk Assessment Questions
- Does this change logic flow? → **RISKY**
- Does this modify error handling? → **RISKY** 
- Does this change function behavior? → **RISKY**
- Is this just removing unused code? → **SAFE**

### Tunnel Vision Prevention
- **Focus only on the specific lint error**
- **Resist urge to "improve" surrounding code**
- **Ask permission before any logic modifications**
- **Stop after each fix to reassess**

## 📋 Error Handling Patterns

### Replace Console Errors
```javascript
// ❌ Before
catch (error) {
  console.error('Something failed:', error)
}

// ✅ After  
catch (error) {
  throw new Error(`Operation failed with context: ${error.message}`)
}
```

### Enhance Try/Catch Blocks
```javascript
// ❌ Before (swallows error)
try {
  await operation()
} catch (error) {
  return null
}

// ✅ After (preserves fail-fast)
try {
  await operation()
} catch (error) {
  throw new Error(`Context-specific operation failed: ${error.message}`)
}
```

### Unused Error Parameters
```javascript
// ❌ Before
catch (error) { // unused error
  return defaultValue
}

// ✅ After (if truly unused)
catch (_error) {
  return defaultValue
}

// ✅ Better (use error composition)
catch (error) {
  throw new Error(`Operation failed: ${error.message}`)
}
```

## 🛡️ Protected Files & Areas

### Wizard Files (NEVER MODIFY)
- **Any file in `components/wizard/`**
- **Wizard-related imports, types, or logic**
- **Do not resolve wizard import errors**
- **Do not remove wizard dependencies**

### Script Files (CONSOLE ALLOWED)
- `docs/scripts/` may legitimately use `console.log` for CLI output
- **Distinguish between debug logs (remove) vs intentional output (keep)**
- **Ask for clarification when uncertain**

## 🔍 Type Safety Protocol

### TypeScript `any` Fixes
1. **Find existing interface first** (search codebase)
2. **Use canonical API types** when available
3. **Remove duplicate local interfaces**
4. **NEVER create new types without investigation & approval**

### Interface Consolidation Priority
1. API types (`app/api/*/types.ts`) - **CANONICAL**
2. Shared types (`types/*.ts`) - Secondary
3. Local interfaces - **REMOVE** if duplicating above

## ⚠️ Common Mistakes to Avoid

1. **Cascading fixes** - fixing multiple unrelated issues
2. **Logic improvements** - rewriting code "to make it better"
3. **Error swallowing** - returning fallback data on errors
4. **Premature optimization** - changing patterns beyond lint fixes
5. **Missing permissions** - assuming risky changes are approved

## 📊 Success Metrics

- **ESLint errors: 0**
- **ESLint warnings: 0** 
- **TypeScript compilation: ✅**
- **No runtime regressions**
- **Error handling: Fail-fast preserved**

## 🔄 Handover Checklist

- [ ] All lint errors classified and addressed
- [ ] Error composition pattern applied consistently
- [ ] No error swallowing anti-patterns remain
- [ ] Wizard files untouched
- [ ] Script dependencies preserved (via knip config)
- [ ] Type safety improved without new type creation
- [ ] User approval obtained for all risky changes

---

**Remember: When in doubt, ask for permission. Better to check twice than break production.**

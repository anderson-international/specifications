# Manual Testing Checklist - Document Graph Enhancement

## Overview
This checklist validates the complete user experience and ensures all document graph enhancements work seamlessly together in real-world scenarios.

## Pre-Test Setup
- [ ] Verify all scripts are in `scripts/` directory
- [ ] Verify all workflows are in `.windsurf/workflows/` directory
- [ ] Verify `docs/document-graph.json` exists and is valid
- [ ] Verify `tests/` directory contains unit and integration tests

## Phase 1: Core Infrastructure Testing

### 1.1 Smart Context Loader
- [ ] **Test 1.1.1:** Execute `cmd /c node scripts/smart-context-loader.js --help`
  - Expected: Shows usage instructions with correct Windows cmd syntax
- [ ] **Test 1.1.2:** Execute `cmd /c node scripts/smart-context-loader.js --workflow=docs-forms`
  - Expected: Lists form-related documents from graph
- [ ] **Test 1.1.3:** Execute `cmd /c node scripts/smart-context-loader.js --core-context`
  - Expected: Shows core AI context documents with dependencies

### 1.2 Graph Validation
- [ ] **Test 1.2.1:** Execute `cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --validate`
  - Expected: Shows "Graph is consistent - no issues found"
- [ ] **Test 1.2.2:** Execute `cmd /c node scripts/validate-links.js`
  - Expected: All links valid, no broken references

## Phase 2: Workflow Enhancement Testing

### 2.1 Enhanced Workflow Execution
- [ ] **Test 2.1.1:** Execute enhanced docs-forms workflow
  - Expected: Smart context loading step executes automatically with `// turbo`
- [ ] **Test 2.1.2:** Execute enhanced docs-api workflow  
  - Expected: API-specific documents loaded automatically
- [ ] **Test 2.1.3:** Execute enhanced docs-ui workflow
  - Expected: UI-specific documents loaded automatically
- [ ] **Test 2.1.4:** Execute enhanced docs-debug workflow
  - Expected: Debug-specific documents loaded automatically

### 2.2 Workflow Status Verification
- [ ] **Test 2.2.1:** Execute `cmd /c node scripts/workflow-enhancer.js --status`
  - Expected: Shows which workflows are enhanced (docs-forms, docs-api, docs-ui, docs-debug, docs-ai-reboot)

## Phase 3: Document Optimization Testing

### 3.1 AI_QUICK_REF Format Validation
- [ ] **Test 3.1.1:** Check Priority 1 documents have `AI_QUICK_REF` format
  - Files to check: `ai-coding-handbook.md`, `business-context.md`, `feature-requirements.md`, `technical-stack.md`, `code-quality-standards.md`
- [ ] **Test 3.1.2:** Check Priority 2 documents have `AI_QUICK_REF` format
  - Files to check: `ui-ux-design.md`, `form-management.md`, `prevent-react-effect-loops.md`, `prevent-lint-issues.md`, `api-design.md`, `authentication.md`, `database.md`, `database-form-integration.md`
- [ ] **Test 3.1.3:** Check Priority 3 documents have `AI_QUICK_REF` format
  - Files to check: `react-patterns.md`, `ui-ux-patterns.md`, `ai-navigation-template.md`, `ai-validation-registry.md`, `ai-index.md`

### 3.2 Cognitive Load Verification
- [ ] **Test 3.2.1:** Verify no remaining `AI_NAVIGATION` blocks exist
  - Execute search for `AI_NAVIGATION` across all docs
- [ ] **Test 3.2.2:** Verify `AI_QUICK_REF` blocks are concise and focused
  - Each block should be 3-8 lines maximum

## Phase 4: Advanced Features Testing

### 4.1 Context Pre-loading
- [ ] **Test 4.1.1:** Execute `cmd /c node scripts/context-preloader.js --analyze src/components/ProductCard.tsx`
  - Expected: Shows context analysis with file types and suggested documents
- [ ] **Test 4.1.2:** Execute `cmd /c node scripts/context-preloader.js --batch "src/pages/*.tsx"`
  - Expected: Batch analyzes multiple files

### 4.2 Graph Analytics
- [ ] **Test 4.2.1:** Execute `cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --report`
  - Expected: Comprehensive analytics report with statistics
- [ ] **Test 4.2.2:** Execute `cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --health`
  - Expected: Health status shows "EXCELLENT" or "GOOD"
- [ ] **Test 4.2.3:** Execute `cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --export`
  - Expected: Creates analytics export file

### 4.3 Graph Maintenance
- [ ] **Test 4.3.1:** Execute `cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --scan`
  - Expected: Scans for new documents and reports findings
- [ ] **Test 4.3.2:** Execute `cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --repair`
  - Expected: Shows any repairs made or "No repairs needed"

### 4.4 System Health Check Workflow
- [ ] **Test 4.4.1:** Execute `/system-health-check` workflow
  - Expected: All `// turbo` commands execute automatically
  - Expected: Provides comprehensive system status report

## Phase 5: End-to-End User Experience Testing

### 5.1 Typical Development Workflow
- [ ] **Test 5.1.1:** Simulate form development workflow
  1. Execute `/docs-forms` workflow
  2. Verify smart context loading works automatically
  3. Verify validation step executes with `// turbo`
  4. Check that relevant documents are loaded efficiently

- [ ] **Test 5.1.2:** Simulate API development workflow  
  1. Execute `/docs-api` workflow
  2. Verify API-specific context loading
  3. Verify automatic validation
  4. Check document relevance and completeness

- [ ] **Test 5.1.3:** Simulate debugging workflow
  1. Execute `/docs-debug` workflow
  2. Verify debug-specific document loading
  3. Check pitfall documents are included
  4. Verify validation step completes successfully

### 5.2 AI Context Restoration
- [ ] **Test 5.2.1:** Simulate AI context reboot scenario
  1. Execute `/docs-ai-reboot` workflow
  2. Verify core context documents load
  3. Check dependency relationships are shown
  4. Verify business context and coding standards are loaded

### 5.3 System Maintenance
- [ ] **Test 5.3.1:** Perform complete system health check
  1. Execute `/system-health-check` workflow
  2. Verify all validation commands execute automatically
  3. Check that system reports healthy status
  4. Confirm no broken links or missing files

## Testing Results

### Automated Test Results
- [x] Unit Tests: 6/6 passed
- [x] Integration Tests: 9/9 passed

### Manual Test Results
- [ ] Phase 1: Core Infrastructure (0/6 completed)
- [ ] Phase 2: Workflow Enhancement (0/3 completed)  
- [ ] Phase 3: Document Optimization (0/3 completed)
- [ ] Phase 4: Advanced Features (0/7 completed)
- [ ] Phase 5: End-to-End User Experience (0/6 completed)

**Total Manual Tests: 0/25 completed**

## Success Criteria
- [ ] All automated tests pass ( Complete)
- [ ] All manual tests pass ( Pending)
- [ ] No broken links or missing files
- [ ] All workflows enhanced with smart context loading
- [ ] All documents optimized with AI_QUICK_REF format
- [ ] System health check shows "EXCELLENT" status
- [ ] End-to-end user workflows function seamlessly

## Sign-off
- [ ] **Technical Validation:** All scripts and workflows function correctly
- [ ] **User Experience:** Workflows are efficient and user-friendly  
- [ ] **Performance:** 80% cognitive load reduction achieved
- [ ] **Maintenance:** System is maintainable and self-validating
- [ ] **Documentation:** All features are properly documented

---

**Next Steps After Manual Testing:**
1. Address any issues found during manual testing
2. Update documentation based on testing results
3. Create user training materials if needed
4. Plan future enhancements based on feedback

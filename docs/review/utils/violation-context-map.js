/**
 * Violation Context Mapping System
 * 
 * Maps specific violation types to their most relevant context documents/workflows
 * for targeted context injection during code review fixes.
 * 
 * Each violation type includes:
 * - workflows: Array of workflow commands to execute for context loading
 * - description: Brief explanation of what context this provides
 * 
 * CRITICAL: All violations are BLOCKING and must be fixed.
 * No prioritization or tiers - all violations are equally mandatory.
 */

const violationContextMap = {
  // Console Error Violations
  'console-errors': {
    workflows: ['/tech-code-quality', '/tech-react-debug'],
    description: 'Code quality standards and error handling patterns',
    contextNotes: 'Focus on fail-fast methodology and proper error throwing vs console logging'
  },

  // Fallback Data Violations (All subtypes)
  'fallback-data': {
    workflows: ['/tech-react-debug', '/code-rules'],
    description: 'Fail-fast methodology and error composition patterns',
    contextNotes: 'Emphasize composed error throwing over silent fallbacks and data masking',
    subtypes: {
      'return_null': {
        specificGuidance: 'Replace null returns with composed errors that preserve context'
      },
      'or_fallback': {
        specificGuidance: 'Replace || fallbacks with validation and error throwing'
      },
      'optional_chaining_fallback': {
        specificGuidance: 'Clarify data contracts, add validation, throw on missing required data'
      },
      'ternary_fallback': {
        specificGuidance: 'Replace ternary defaults with validation and clear error messages'
      },
      'empty_catch_return': {
        specificGuidance: 'Never swallow exceptions - compose and re-throw with context'
      }
    }
  },

  // TypeScript Violations
  'typescript-violations': {
    workflows: ['/code-types', '/tech-code-quality'],
    description: 'TypeScript standards and type annotation requirements',
    contextNotes: 'Ensure all functions have explicit return types for clarity and safety'
  },

  // Comment Violations
  'comment-violations': {
    workflows: ['/code-rules'],
    description: 'Code quality standards regarding comments and documentation',
    contextNotes: 'Remove unnecessary comments, ensure code is self-documenting'
  },

  // ESLint/Generic Violations (fallback)
  'eslint-violations': {
    workflows: ['/tech-code-quality', '/code-rules'],
    description: 'General code quality standards and linting rules',
    contextNotes: 'Follow established patterns for imports, exports, and formatting'
  }
};

/**
 * Get context workflows for a specific violation type
 * @param {string} violationType - The type of violation
 * @param {string} subtype - Optional subtype for more specific guidance
 * @returns {Object} Context information including workflows and guidance
 */
function getContextForViolation(violationType, subtype = null) {
  const context = violationContextMap[violationType];
  
  if (!context) {
    // Fallback to general code quality context
    return violationContextMap['eslint-violations'];
  }

  const result = {
    workflows: context.workflows,
    description: context.description,
    contextNotes: context.contextNotes
  };

  // Add subtype-specific guidance if available
  if (subtype && context.subtypes && context.subtypes[subtype]) {
    result.specificGuidance = context.subtypes[subtype].specificGuidance;
  }

  return result;
}

/**
 * Get all unique workflows needed for a batch of violations
 * @param {Array} violations - Array of violation objects with type property
 * @returns {Array} Array of unique workflows in alphabetical order
 */
function getWorkflowsForViolationBatch(violations) {
  const workflowSet = new Set();

  violations.forEach(violation => {
    const context = getContextForViolation(violation.type, violation.subtype);
    context.workflows.forEach(workflow => {
      workflowSet.add(workflow);
    });
  });

  // Convert to array and sort alphabetically (no priority implications)
  return Array.from(workflowSet).sort();
}

/**
 * Generate context loading instructions for cAI
 * @param {Array} violations - Array of violation objects
 * @returns {Object} Instructions and workflow list for context loading
 */
function generateContextInstructions(violations) {
  const workflows = getWorkflowsForViolationBatch(violations);
  const violationTypes = [...new Set(violations.map(v => v.type))];
  
  const instructions = {
    workflows: workflows,
    violationTypes: violationTypes,
    loadingInstructions: [
      '🎯 CONTEXT LOADING REQUIRED: Execute the following workflows before fixing violations:',
      ...workflows.map(workflow => `   ${workflow}`),
      '',
      '📋 VIOLATION FOCUS AREAS:',
      ...violationTypes.map(type => {
        const context = getContextForViolation(type);
        return `   • ${type}: ${context.description}`;
      }),
      '',
      '⚠️  CRITICAL: Review loaded context before making any code changes',
      '⚠️  CRITICAL: Apply fail-fast methodology - throw errors, never mask problems',
      '⚠️  CRITICAL: ALL VIOLATIONS ARE BLOCKING - fix every violation before completion'
    ].join('\n')
  };

  return instructions;
}

module.exports = {
  violationContextMap,
  getContextForViolation,
  getWorkflowsForViolationBatch,
  generateContextInstructions
};

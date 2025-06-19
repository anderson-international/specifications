#!/usr/bin/env node

/**
 * Workflow Enhancer - Batch enhancement of AI workflows
 * Provides utilities for enhancing multiple workflows with graph-based document loading
 */

const fs = require('fs');
const path = require('path');

class WorkflowEnhancer {
  constructor() {
    this.workflowDir = path.join(process.cwd(), '.windsurf', 'workflows');
    this.smartContextLoader = path.join(process.cwd(), 'docs', 'ai', 'maintenance', 'scripts', 'smart-context-loader.js');
    
    // Verify smart context loader exists
    if (!fs.existsSync(this.smartContextLoader)) {
      throw new Error('Smart Context Loader not found. Please ensure docs/ai/maintenance/scripts/smart-context-loader.js exists.');
    }
  }

  /**
   * Get list of all workflow files
   */
  getWorkflowFiles() {
    if (!fs.existsSync(this.workflowDir)) {
      throw new Error('Workflow directory not found: ' + this.workflowDir);
    }

    return fs.readdirSync(this.workflowDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(this.workflowDir, file));
  }

  /**
   * Check if workflow is already enhanced
   */
  isWorkflowEnhanced(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('smart-context-loader.js');
  }

  /**
   * Enhance a single workflow with graph-based loading
   */
  enhanceWorkflow(filePath) {
    const workflowName = path.basename(filePath, '.md');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already enhanced
    if (this.isWorkflowEnhanced(filePath)) {
      console.log(`⏭️  ${workflowName}: Already enhanced`);
      return false;
    }

    // Find the step section (usually after description)
    const lines = content.split('\n');
    let insertIndex = -1;
    
    // Look for the first step or section after frontmatter
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^#{1,2}\s+\d+\.|^#{1,2}\s+Step\s+\d+/)) {
        insertIndex = i;
        break;
      }
    }
    
    if (insertIndex === -1) {
      console.log(`⚠️  ${workflowName}: Could not find insertion point`);
      return false;
    }

    // Create enhanced step
    const enhancedStep = [
      '## Smart Context Loading',
      '',
      '// turbo',
      '```bash',
      `node docs/ai/maintenance/scripts/smart-context-loader.js --workflow=${workflowName}`,
      '```',
      '',
      'This step loads relevant documents based on the document graph for this workflow.',
      ''
    ];

    // Insert the enhanced step
    lines.splice(insertIndex, 0, ...enhancedStep);
    
    // Write enhanced workflow
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`✅ ${workflowName}: Enhanced with graph-based loading`);
    return true;
  }

  /**
   * Enhance all workflows
   */
  enhanceAllWorkflows() {
    console.log('🔧 Workflow Enhancer - Batch Enhancement Tool\n');
    
    const workflowFiles = this.getWorkflowFiles();
    console.log(`📁 Found ${workflowFiles.length} workflow files\n`);
    
    let enhancedCount = 0;
    let skippedCount = 0;
    
    workflowFiles.forEach(filePath => {
      if (this.enhanceWorkflow(filePath)) {
        enhancedCount++;
      } else {
        skippedCount++;
      }
    });
    
    console.log(`\n📊 Enhancement Summary:`);
    console.log(`   ✅ Enhanced: ${enhancedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📄 Total: ${workflowFiles.length}`);
  }

  /**
   * List workflow enhancement status
   */
  listWorkflowStatus() {
    console.log('📋 Workflow Enhancement Status\n');
    
    const workflowFiles = this.getWorkflowFiles();
    
    workflowFiles.forEach(filePath => {
      const workflowName = path.basename(filePath, '.md');
      const isEnhanced = this.isWorkflowEnhanced(filePath);
      const status = isEnhanced ? '✅ Enhanced' : '❌ Not Enhanced';
      console.log(`   ${status}: ${workflowName}`);
    });
  }

  /**
   * CLI interface
   */
  handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Workflow Enhancer - Batch enhancement of AI workflows

Usage:
  cmd /c node workflow-enhancer.js [options]

Options:
  --enhance-all    Enhance all workflows with graph-based loading
  --status         Show enhancement status of all workflows
  --help, -h       Show this help message

Examples:
  cmd /c node workflow-enhancer.js --enhance-all
  cmd /c node workflow-enhancer.js --status`);
      return;
    }

    if (args.includes('--enhance-all')) {
      this.enhanceAllWorkflows();
      return;
    }

    if (args.includes('--status')) {
      this.listWorkflowStatus();
      return;
    }

    // Default: show status
    this.listWorkflowStatus();
  }
}

// CLI execution
if (require.main === module) {
  try {
    const enhancer = new WorkflowEnhancer();
    enhancer.handleCLI();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = WorkflowEnhancer;

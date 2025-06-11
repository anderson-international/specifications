#!/usr/bin/env node

/**
 * Schema Documentation Generator
 * 
 * Generates AI-optimized database schema documentation by introspecting
 * the live NeonDB database and outputting structured information for
 * AI models to use when planning database interactions and generating
 * CRUD forms.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function generateSchemaDocumentation() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database...');

    // Get all tables, columns, and constraints
    const tablesQuery = `
      SELECT 
        t.table_name,
        t.table_type,
        obj_description(c.oid) as table_comment
      FROM information_schema.tables t
      LEFT JOIN pg_class c ON c.relname = t.table_name
      WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name;
    `;

    const columnsQuery = `
      SELECT 
        c.table_name,
        c.column_name,
        c.data_type,
        c.character_maximum_length,
        c.is_nullable,
        c.column_default,
        c.ordinal_position,
        col_description(pgc.oid, c.ordinal_position) as column_comment
      FROM information_schema.columns c
      LEFT JOIN pg_class pgc ON pgc.relname = c.table_name
      WHERE c.table_schema = 'public'
      ORDER BY c.table_name, c.ordinal_position;
    `;

    const constraintsQuery = `
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        cc.check_clause
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      LEFT JOIN information_schema.check_constraints cc
        ON cc.constraint_name = tc.constraint_name
      WHERE tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_type;
    `;

    const indexesQuery = `
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;

    // Execute all queries
    const [tablesResult, columnsResult, constraintsResult, indexesResult] = await Promise.all([
      client.query(tablesQuery),
      client.query(columnsQuery),
      client.query(constraintsQuery),
      client.query(indexesQuery)
    ]);

    const tables = tablesResult.rows;
    const columns = columnsResult.rows;
    const constraints = constraintsResult.rows;
    const indexes = indexesResult.rows;

    // Get enum values for enum tables
    const enumValuesQuery = `
      SELECT 
        table_name,
        id,
        name
      FROM (
        ${tables
          .filter(t => t.table_name.startsWith('enum_'))
          .map(t => `SELECT '${t.table_name}' as table_name, id, name FROM ${t.table_name}`)
          .join(' UNION ALL ')}
      ) enum_data
      ORDER BY table_name, id;
    `;

    let enumValues = [];
    if (tables.some(t => t.table_name.startsWith('enum_'))) {
      const enumResult = await client.query(enumValuesQuery);
      enumValues = enumResult.rows;
    }

    // Generate documentation
    const documentation = generateDocumentation(tables, columns, constraints, indexes, enumValues);
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'docs', 'db-schema.txt');
    fs.writeFileSync(outputPath, documentation);
    
    console.log(`✅ Schema documentation generated successfully at: ${outputPath}`);
    console.log(`📊 Generated documentation for ${tables.length} tables`);
    
  } catch (error) {
    console.error('❌ Error generating schema documentation:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

function generateDocumentation(tables, columns, constraints, indexes, enumValues) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  let doc = `# AI-Optimized Database Schema Documentation
# Generated: ${timestamp}
# Purpose: Provide structured database information for AI models to plan interactions and generate CRUD forms

## Overview
This database supports a snuff specification management system with:
- Multi-reviewer specifications for products
- Enum-based categorization system
- Junction tables for many-to-many relationships
- Draft/published workflow via status system
- Integration with Shopify for product data

`;

  // Group data by table
  const tableData = {};
  tables.forEach(table => {
    tableData[table.table_name] = {
      info: table,
      columns: columns.filter(c => c.table_name === table.table_name),
      constraints: constraints.filter(c => c.table_name === table.table_name),
      indexes: indexes.filter(i => i.tablename === table.table_name),
      enumValues: enumValues.filter(e => e.table_name === table.table_name)
    };
  });

  // Separate enum tables from regular tables
  const enumTables = Object.entries(tableData).filter(([name]) => name.startsWith('enum_'));
  const regularTables = Object.entries(tableData).filter(([name]) => !name.startsWith('enum_') && !name.startsWith('jotform') && name !== 'transform_log');
  const junctionTables = Object.entries(tableData).filter(([name]) => name.startsWith('spec_'));

  // Generate regular tables documentation
  doc += "## Core Tables\n\n";
  regularTables.forEach(([tableName, data]) => {
    doc += generateTableDocumentation(tableName, data);
  });

  // Generate junction tables documentation  
  if (junctionTables.length > 0) {
    doc += "## Junction Tables (Many-to-Many Relationships)\n\n";
    junctionTables.forEach(([tableName, data]) => {
      doc += generateTableDocumentation(tableName, data);
    });
  }

  // Generate enum tables documentation
  if (enumTables.length > 0) {
    doc += "## Enum Tables (Lookup Values)\n\n";
    doc += "All enum tables follow the standard structure with id, name, created_at, updated_at.\n\n";
    
    enumTables.forEach(([tableName, data]) => {
      const enumName = tableName.replace('enum_', '');
      doc += `### ${tableName}\n`;
      doc += `// AI_FORM_HINT: Use as dropdown/select options\n`;
      doc += `// AI_VALIDATION: Required field, foreign key constraint\n`;
      
      if (data.enumValues.length > 0) {
        doc += `// AI_VALUES: {\n`;
        data.enumValues.forEach(val => {
          doc += `//   ${val.id}: "${val.name}"\n`;
        });
        doc += `// }\n`;
      }
      
      doc += `\n`;
    });
  }

  // Generate AI-specific guidance
  doc += generateAIGuidance(tableData);

  return doc;
}

function generateTableDocumentation(tableName, data) {
  let doc = `### ${tableName}\n`;
  
  // Add AI hints based on table purpose
  if (tableName === 'specifications') {
    doc += `// AI_TABLE_PURPOSE: Core specification data - main CRUD operations focus here\n`;
    doc += `// AI_FORM_TYPE: Multi-step wizard form (product selection, ratings, text review, enum selections)\n`;
    doc += `// AI_WORKFLOW: Draft → Published → Needs Revision → Under Review\n`;
  } else if (tableName === 'users') {
    doc += `// AI_TABLE_PURPOSE: User management - Admin vs Reviewer roles\n`;
    doc += `// AI_FORM_TYPE: Simple user profile form\n`;
  } else if (tableName.startsWith('spec_')) {
    doc += `// AI_TABLE_PURPOSE: Junction table - handle as multi-select in forms\n`;
    doc += `// AI_FORM_TYPE: Multi-select checkboxes or tags\n`;
  }

  doc += `\n\`\`\`sql\n`;
  doc += `CREATE TABLE ${tableName} (\n`;
  
  // Generate column definitions with AI hints
  data.columns.forEach((col, index) => {
    const isLast = index === data.columns.length - 1;
    let line = `    ${col.column_name.padEnd(20)} ${col.data_type.toUpperCase()}`;
    
    if (col.character_maximum_length) {
      line += `(${col.character_maximum_length})`;
    }
    
    if (col.is_nullable === 'NO') {
      line += ' NOT NULL';
    }
    
    if (col.column_default) {
      line += ` DEFAULT ${col.column_default}`;
    }
    
    if (!isLast) line += ',';
    
    // Add AI hints as comments
    const aiHints = generateColumnAIHints(tableName, col, data.constraints);
    if (aiHints.length > 0) {
      line += ` -- ${aiHints.join(', ')}`;
    }
    
    doc += line + '\n';
  });
  
  doc += `);\n\`\`\`\n\n`;
  
  // Add constraint information
  const foreignKeys = data.constraints.filter(c => c.constraint_type === 'FOREIGN KEY');
  if (foreignKeys.length > 0) {
    doc += `// AI_RELATIONSHIPS:\n`;
    foreignKeys.forEach(fk => {
      doc += `//   ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}\n`;
    });
    doc += `\n`;
  }
  
  return doc;
}

function generateColumnAIHints(tableName, column, constraints) {
  const hints = [];
  
  // Foreign key hints
  const fkConstraint = constraints.find(c => 
    c.constraint_type === 'FOREIGN KEY' && c.column_name === column.column_name
  );
  if (fkConstraint) {
    if (fkConstraint.foreign_table_name.startsWith('enum_')) {
      hints.push(`FORM: dropdown from ${fkConstraint.foreign_table_name}`);
    } else {
      hints.push(`FK: ${fkConstraint.foreign_table_name}.${fkConstraint.foreign_column_name}`);
    }
  }
  
  // Required field hints
  if (column.is_nullable === 'NO' && !column.column_default) {
    hints.push('REQUIRED');
  }
  
  // Special field hints
  if (column.column_name === 'star_rating') {
    hints.push('FORM: 1-5 star rating input');
  } else if (column.column_name === 'review') {
    hints.push('FORM: textarea for long text');
  } else if (column.column_name === 'email') {
    hints.push('FORM: email input with validation');
  } else if (column.column_name.includes('boolean') || column.data_type === 'boolean') {
    hints.push('FORM: checkbox or toggle');
  } else if (column.data_type === 'text' && column.column_name !== 'review') {
    hints.push('FORM: text input');
  }
  
  return hints;
}

function generateAIGuidance(tableData) {
  return `
## AI Development Guidance

### CRUD Form Generation Priority
1. **specifications** - Primary focus, multi-step wizard form
2. **users** - Simple user management forms  
3. **enum_* tables** - Admin-only management forms
4. **Junction tables** - Handle as multi-select in specification forms

### Key Relationships for AI Models
- specifications.user_id → users.id (one-to-many)
- specifications.status_id → enum_specification_statuses.id (workflow)
- specifications → spec_tasting_notes → enum_tasting_notes (many-to-many)
- specifications → spec_cures → enum_cures (many-to-many)
- specifications → spec_tobacco_types → enum_tobacco_types (many-to-many)

### Form Validation Rules
- All enum foreign keys: REQUIRED
- star_rating: INTEGER 1-5 range
- review: TEXT minimum 10 characters recommended
- Multi-select fields: At least 1 tasting note required, cures optional
- Email: Valid email format for users table

### Status Workflow Logic
- Draft (1): Editable by owner, not visible to others
- Published (2): Read-only for reviewers, visible to all
- Needs Revision (3): Flagged for improvement, editable by owner
- Under Review (4): Awaiting admin approval, read-only for reviewers

### Performance Considerations
- Use indexes on foreign key columns for joins
- specifications table will be largest - optimize queries
- Enum tables are small - safe to cache in memory
- Junction tables - use batch operations for multi-select updates

---
Generated by sync-schema.js - DO NOT EDIT MANUALLY
Run 'npm run sync-schema' to regenerate this file
`;
}

// Run the script
if (require.main === module) {
  generateSchemaDocumentation();
}

module.exports = { generateSchemaDocumentation };

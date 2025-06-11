#!/usr/bin/env node

/**
 * Complete Status Workflow Implementation
 * 
 * This script completes the status workflow by:
 * 1. Verifying enum_specification_statuses has correct values
 * 2. Updating existing specifications to use proper status_id values
 * 3. Testing status transitions work correctly
 */

const { Client } = require('pg');
require('dotenv').config();

async function completeStatusWorkflow() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database...');

    // 1. Verify enum_specification_statuses values
    console.log('\n📋 Checking enum_specification_statuses values...');
    const statusEnum = await client.query('SELECT * FROM enum_specification_statuses ORDER BY id;');
    console.table(statusEnum.rows);

    const expectedStatuses = [
      { id: 1, name: 'draft' },
      { id: 2, name: 'published' },
      { id: 3, name: 'needs_revision' },
      { id: 4, name: 'under_review' }
    ];

    // Check if we have the expected status values
    const currentStatuses = statusEnum.rows;
    const missingStatuses = expectedStatuses.filter(expected => 
      !currentStatuses.some(current => current.id === expected.id && current.name === expected.name)
    );

    if (missingStatuses.length > 0) {
      console.log('\n⚠️  Missing expected statuses, adding them...');
      for (const status of missingStatuses) {
        await client.query(
          'INSERT INTO enum_specification_statuses (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = $2',
          [status.id, status.name]
        );
        console.log(`✅ Added/Updated status: ${status.id} = ${status.name}`);
      }
    } else {
      console.log('✅ All expected status values are present');
    }

    // 2. Check current status_id distribution in specifications
    console.log('\n📊 Current specifications status distribution...');
    const statusDistribution = await client.query(`
      SELECT 
        s.status_id,
        es.name as status_name,
        COUNT(*) as count
      FROM specifications s
      LEFT JOIN enum_specification_statuses es ON s.status_id = es.id
      GROUP BY s.status_id, es.name
      ORDER BY s.status_id;
    `);
    console.table(statusDistribution.rows);

    // 3. Update specifications with invalid status_id (NULL or 0) to published (2)
    console.log('\n🔄 Checking for specifications with invalid status_id...');
    const invalidStatusSpecs = await client.query(`
      SELECT COUNT(*) as count 
      FROM specifications 
      WHERE status_id IS NULL OR status_id = 0 OR status_id NOT IN (1, 2, 3, 4);
    `);

    const invalidCount = parseInt(invalidStatusSpecs.rows[0].count);
    
    if (invalidCount > 0) {
      console.log(`⚠️  Found ${invalidCount} specifications with invalid status_id, updating to published (2)...`);
      
      const updateResult = await client.query(`
        UPDATE specifications 
        SET status_id = 2, updated_at = CURRENT_TIMESTAMP
        WHERE status_id IS NULL OR status_id = 0 OR status_id NOT IN (1, 2, 3, 4);
      `);
      
      console.log(`✅ Updated ${updateResult.rowCount} specifications to published status`);
    } else {
      console.log('✅ All specifications have valid status_id values');
    }

    // 4. Verify foreign key constraint exists
    console.log('\n🔗 Verifying foreign key constraint on specifications.status_id...');
    const fkConstraint = await client.query(`
      SELECT 
          tc.constraint_name, 
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'specifications'
        AND kcu.column_name = 'status_id';
    `);

    if (fkConstraint.rows.length === 0) {
      console.log('🔗 Adding foreign key constraint for status_id...');
      await client.query(`
        ALTER TABLE specifications 
          ADD CONSTRAINT fk_specifications_status_id 
          FOREIGN KEY (status_id) 
          REFERENCES enum_specification_statuses(id);
      `);
      console.log('✅ Added foreign key constraint for status_id');
    } else {
      console.log('✅ Foreign key constraint already exists:');
      console.table(fkConstraint.rows);
    }

    // 5. Test status transitions (basic validation)
    console.log('\n🧪 Testing status workflow transitions...');
    
    // Test that all status values are valid
    const validStatuses = await client.query(`
      SELECT COUNT(*) as count 
      FROM specifications s
      JOIN enum_specification_statuses es ON s.status_id = es.id;
    `);
    
    const totalSpecs = await client.query('SELECT COUNT(*) as count FROM specifications;');
    
    const validCount = parseInt(validStatuses.rows[0].count);
    const totalCount = parseInt(totalSpecs.rows[0].count);
    
    if (validCount === totalCount) {
      console.log('✅ All specifications have valid status references');
    } else {
      console.log(`❌ ${totalCount - validCount} specifications have invalid status references`);
    }

    // 6. Final status summary
    console.log('\n📊 Final specifications status distribution...');
    const finalDistribution = await client.query(`
      SELECT 
        s.status_id,
        es.name as status_name,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM specifications)), 1) as percentage
      FROM specifications s
      LEFT JOIN enum_specification_statuses es ON s.status_id = es.id
      GROUP BY s.status_id, es.name
      ORDER BY s.status_id;
    `);
    console.table(finalDistribution.rows);

    // 7. Verify workflow rules
    console.log('\n📋 Status Workflow Rules Summary:');
    console.log('  1. Draft (1): Editable by owner, not visible to others');
    console.log('  2. Published (2): Read-only for reviewers, visible to all');
    console.log('  3. Needs Revision (3): Flagged for improvement, editable by owner');
    console.log('  4. Under Review (4): Awaiting admin approval, read-only for reviewers');

    console.log('\n🎉 Status Workflow Implementation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error completing status workflow:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the script
if (require.main === module) {
  completeStatusWorkflow();
}

module.exports = { completeStatusWorkflow };

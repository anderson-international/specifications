#!/usr/bin/env node

/**
 * Complete User Role Normalization
 * 
 * This script finishes the user role normalization by:
 * 1. Dropping the old 'role' TEXT column from users table
 * 2. Ensuring foreign key constraint is properly set up for role_id
 */

const { Client } = require('pg');
require('dotenv').config();

async function completeUserRoleNormalization() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database...');

    // Check current state
    console.log('\n📋 Checking current users table structure...');
    const currentStructure = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.table(currentStructure.rows);

    // Check enum_roles values
    console.log('\n🏷️  Current enum_roles values:');
    const enumRoles = await client.query('SELECT * FROM enum_roles ORDER BY id;');
    console.table(enumRoles.rows);

    // Check if old role column exists
    const hasOldRoleColumn = currentStructure.rows.some(row => row.column_name === 'role');
    
    if (hasOldRoleColumn) {
      console.log('\n🗑️  Dropping old role TEXT column...');
      await client.query('ALTER TABLE users DROP COLUMN role;');
      console.log('✅ Successfully dropped old role column');
    } else {
      console.log('\n✅ Old role column already removed');
    }

    // Check if foreign key constraint exists
    console.log('\n🔗 Checking existing foreign key constraints...');
    const existingConstraints = await client.query(`
      SELECT 
          tc.constraint_name, 
          tc.table_name, 
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'users'
        AND kcu.column_name = 'role_id';
    `);

    if (existingConstraints.rows.length === 0) {
      console.log('\n🔗 Adding foreign key constraint for role_id...');
      try {
        await client.query(`
          ALTER TABLE users 
            ADD CONSTRAINT fk_users_role_id 
            FOREIGN KEY (role_id) 
            REFERENCES enum_roles(id);
        `);
        console.log('✅ Successfully added foreign key constraint');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('✅ Foreign key constraint already exists');
        } else {
          throw error;
        }
      }
    } else {
      console.log('✅ Foreign key constraint already exists:');
      console.table(existingConstraints.rows);
    }

    // Verify final state
    console.log('\n📋 Updated users table structure:');
    const finalStructure = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    console.table(finalStructure.rows);

    // Verify all constraints
    console.log('\n🔗 All foreign key constraints on users table:');
    const allConstraints = await client.query(`
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
        AND tc.table_name = 'users';
    `);
    console.table(allConstraints.rows);

    console.log('\n🎉 User Role Normalization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error completing user role normalization:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the script
if (require.main === module) {
  completeUserRoleNormalization();
}

module.exports = { completeUserRoleNormalization };

-- Query to find all indexes that need renaming
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND (
    indexname LIKE '%ai_synth%' 
    OR indexname LIKE '%enum_%'
    OR indexname LIKE '%spec_cures%'
    OR indexname LIKE '%spec_tasting%'
    OR indexname LIKE '%spec_tobacco%'
    OR indexname LIKE '%users%'
)
ORDER BY tablename, indexname;

-- Query to find all constraints that need renaming
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    contype as constraint_type
FROM pg_constraint 
WHERE conname LIKE '%ai_synth%' 
   OR conname LIKE '%enum_%'
   OR conname LIKE '%spec_cures%'
   OR conname LIKE '%spec_tasting%'
   OR conname LIKE '%spec_tobacco%'
   OR conname LIKE '%users%'
ORDER BY table_name, constraint_name;

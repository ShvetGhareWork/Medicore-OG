SELECT 'CREATE DATABASE heal_clinical'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'heal_clinical')\gexec

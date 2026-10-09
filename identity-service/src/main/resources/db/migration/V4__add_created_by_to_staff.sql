-- V4__add_created_by_to_staff.sql
-- Add created_by_staff_id column to staff table for attribution
ALTER TABLE staff ADD COLUMN IF NOT EXISTS created_by_staff_id VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_staff_created_by ON staff(created_by_staff_id);

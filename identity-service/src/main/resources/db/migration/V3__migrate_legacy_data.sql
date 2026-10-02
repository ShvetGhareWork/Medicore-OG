-- V3__migrate_legacy_data.sql

-- Seed default departments if not present
INSERT INTO departments (name, code)
VALUES
    ('Cardiology', 'CARD'),
    ('Emergency', 'EMERG'),
    ('Neurology', 'NEURO'),
    ('Pediatrics', 'PED'),
    ('General Medicine', 'GEN')
ON CONFLICT (name) DO NOTHING;

-- Backfill staff from user_table if staff table exists and has legacy user records
INSERT INTO staff (
    staff_id,
    full_name,
    email,
    contact_number,
    date_of_birth,
    role,
    department_id,
    designation,
    access_level,
    login_method,
    photo_url,
    status,
    created_at,
    updated_at
)
SELECT
    COALESCE(u.staff_id, CONCAT('STAFF-', u.id)),
    COALESCE(u.full_name, u.username),
    COALESCE(u.email, CONCAT(u.username, '@hospital.org')),
    u.contact_number,
    u.date_of_birth,
    COALESCE(ur.roles, 'ADMINISTRATIVE'),
    d.id,
    u.designation,
    COALESCE(u.access_level, 'STANDARD'),
    COALESCE(u.login_method, 'PASSWORD'),
    u.photo_url,
    COALESCE(u.status, 'ACTIVE'),
    COALESCE(u.created_at, CURRENT_TIMESTAMP),
    COALESCE(u.updated_at, CURRENT_TIMESTAMP)
FROM user_table u
LEFT JOIN (
    SELECT DISTINCT ON (user_id) user_id, roles FROM user_roles
) ur ON u.id = ur.user_id
LEFT JOIN departments d ON LOWER(d.name) = LOWER(u.department)
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS user_table (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    provider_id VARCHAR(255),
    provider_type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    roles VARCHAR(50) NOT NULL,
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES user_table(id) ON DELETE CASCADE
);

ALTER TABLE user_table
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS staff_id VARCHAR(255) UNIQUE,
    ADD COLUMN IF NOT EXISTS department VARCHAR(255),
    ADD COLUMN IF NOT EXISTS designation VARCHAR(255),
    ADD COLUMN IF NOT EXISTS date_of_birth DATE,
    ADD COLUMN IF NOT EXISTS contact_number VARCHAR(255),
    ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS reporting_to_id BIGINT,
    ADD COLUMN IF NOT EXISTS access_level VARCHAR(50),
    ADD COLUMN IF NOT EXISTS login_method VARCHAR(50),
    ADD COLUMN IF NOT EXISTS badge_token VARCHAR(255) UNIQUE,
    ADD COLUMN IF NOT EXISTS badge_version INT NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS status VARCHAR(50),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_user_table_reporting_to'
    ) THEN
        ALTER TABLE user_table
            ADD CONSTRAINT fk_user_table_reporting_to
            FOREIGN KEY (reporting_to_id) REFERENCES user_table(id) ON DELETE SET NULL;
    END IF;
END $$;

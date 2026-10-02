-- V2__init_normalized_schema.sql
-- 1. departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. staff Table
CREATE TABLE IF NOT EXISTS staff (
    id BIGSERIAL PRIMARY KEY,
    staff_id VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_number VARCHAR(50),
    date_of_birth DATE,
    role VARCHAR(50) NOT NULL,
    department_id BIGINT,
    designation VARCHAR(255),
    access_level VARCHAR(50),
    login_method VARCHAR(50),
    photo_url TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_staff_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 3. patients Table
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    contact_number VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(50),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    admitting_diagnosis TEXT,
    triage_level VARCHAR(50),
    attending_doctor_id BIGINT,
    department_id BIGINT,
    ward_number VARCHAR(50),
    bed_number VARCHAR(50),
    admission_status VARCHAR(50) DEFAULT 'PENDING',
    admission_date TIMESTAMP WITHOUT TIME ZONE,
    expected_discharge_date DATE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patients_attending_doctor FOREIGN KEY (attending_doctor_id) REFERENCES staff(id) ON DELETE SET NULL,
    CONSTRAINT fk_patients_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Indexes on FK columns
CREATE INDEX IF NOT EXISTS idx_staff_department_id ON staff(department_id);
CREATE INDEX IF NOT EXISTS idx_patients_attending_doctor_id ON patients(attending_doctor_id);
CREATE INDEX IF NOT EXISTS idx_patients_department_id ON patients(department_id);

-- Partial unique index on (ward_number, bed_number) for ADMITTED patients to prevent double-booking
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_bed_occupancy
ON patients(ward_number, bed_number)
WHERE admission_status = 'ADMITTED' AND ward_number IS NOT NULL AND bed_number IS NOT NULL;

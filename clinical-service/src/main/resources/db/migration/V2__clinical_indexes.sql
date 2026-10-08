-- V2: Performance & Scalability Indexes

-- Indexes on encounters
CREATE INDEX IF NOT EXISTS idx_encounters_patient_id ON encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_doctor_id ON encounters(doctor_id);
CREATE INDEX IF NOT EXISTS idx_encounters_status ON encounters(status);
CREATE INDEX IF NOT EXISTS idx_encounters_patient_status ON encounters(patient_id, status);

-- Indexes on clinical_entries
CREATE INDEX IF NOT EXISTS idx_entries_encounter_id ON clinical_entries(encounter_id);
CREATE INDEX IF NOT EXISTS idx_entries_patient_id ON clinical_entries(patient_id);
CREATE INDEX IF NOT EXISTS idx_entries_author_id ON clinical_entries(author_id);
CREATE INDEX IF NOT EXISTS idx_entries_type ON clinical_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_entries_status ON clinical_entries(status);
CREATE INDEX IF NOT EXISTS idx_entries_patient_created ON clinical_entries(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_encounter_created ON clinical_entries(encounter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_orig_entry ON clinical_entries(original_entry_id) WHERE original_entry_id IS NOT NULL;

-- JSONB GIN Index on clinical_entries content_json
CREATE INDEX IF NOT EXISTS idx_entries_content_gin ON clinical_entries USING GIN (content_json jsonb_path_ops);

-- Indexes on nurse_flags
CREATE INDEX IF NOT EXISTS idx_flags_encounter_id ON nurse_flags(encounter_id);
CREATE INDEX IF NOT EXISTS idx_flags_patient_id ON nurse_flags(patient_id);
CREATE INDEX IF NOT EXISTS idx_flags_status ON nurse_flags(status);
CREATE INDEX IF NOT EXISTS idx_flags_severity ON nurse_flags(severity);
CREATE INDEX IF NOT EXISTS idx_flags_patient_open ON nurse_flags(patient_id, status) WHERE status = 'OPEN';

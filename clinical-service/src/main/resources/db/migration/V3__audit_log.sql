-- V3: Clinical Audit Log Schema
CREATE TABLE IF NOT EXISTS clinical_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trace_id VARCHAR(64),
    user_id UUID,
    username VARCHAR(128),
    user_role VARCHAR(64),
    action VARCHAR(64) NOT NULL, -- VIEW_PATIENT_CHART, CREATE_ENTRY, SIGN_ENTRY, AMEND_ENTRY, CREATE_FLAG, RESOLVE_FLAG, EXPORT_CHART
    resource_type VARCHAR(64) NOT NULL, -- ENCOUNTER, CLINICAL_ENTRY, NURSE_FLAG, PATIENT_CHART
    resource_id VARCHAR(128),
    patient_id UUID,
    ip_address VARCHAR(64),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_patient_id ON clinical_audit_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON clinical_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON clinical_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON clinical_audit_logs(created_at DESC);

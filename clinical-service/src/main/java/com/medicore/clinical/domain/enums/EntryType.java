package com.medicore.clinical.domain.enums;

public enum EntryType {
    // Doctor entries
    SOAP_NOTE,
    DIAGNOSIS,
    PRESCRIPTION,
    LAB_ORDER,
    RADIOLOGY_ORDER,
    PROCEDURE_NOTE,
    DISCHARGE_SUMMARY,
    
    // Nurse entries
    VITALS_SIGN,
    NURSE_NOTE,
    MEDICATION_ADMINISTRATION,
    INTAKE_OUTPUT,
    WOUND_CARE,
    SHIFT_HANDOFF
}

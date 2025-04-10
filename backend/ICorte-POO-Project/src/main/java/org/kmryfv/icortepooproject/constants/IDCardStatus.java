package org.kmryfv.icortepooproject.constants;

public enum IDCardStatus {
    PENDING,
    APPROVED,
    REJECTED,
    DELIVERED,
    EMITTED;

    public static IDCardStatus changeStatus(String status) {
        return IDCardStatus.valueOf(status);
    }
}
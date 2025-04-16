package org.kmryfv.icortepooproject.constants;

public enum IDCardStatus {
    PENDING,
    APPROVED,
    REJECTED,
    DELIVERED,
    EMITTED;

    public static IDCardStatus changeStatus(String status) {
        try {
            return IDCardStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado inválido: " + status + ". Valores válidos: PENDING, APPROVED, REJECTED, DELIVERED, EMITTED.");
        }
    }
}
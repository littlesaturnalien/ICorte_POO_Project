package org.kmryfv.icortepooproject.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IDCardStatusUpdateDTO {
    private String status; // must match one of: PENDING, APPROVED, REJECTED, DELIVERED, EMITTED
}
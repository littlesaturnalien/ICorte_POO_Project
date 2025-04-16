package org.kmryfv.icortepooproject.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class IDCardRequestDTO {
    private String cif;
    private String semester;
    private Long requirementId;
    private LocalDateTime deliveryAppointment;
}

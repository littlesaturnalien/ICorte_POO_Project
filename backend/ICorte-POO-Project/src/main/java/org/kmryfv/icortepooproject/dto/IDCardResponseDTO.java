package org.kmryfv.icortepooproject.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class IDCardResponseDTO {
    private Long idCardId;
    private String semester;
    private LocalDate issueDate;
    private LocalDate expirationDate;
    private String status;
    private LocalDateTime deliveryAppointment;

    private String cif;
    private String names;
    private String surnames;
    private Set<String> degrees;
    private Set<String> faculties;
}
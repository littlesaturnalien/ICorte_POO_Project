package org.kmryfv.icortepooproject.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class IDCardRequestDTO {
    private String cif;
    private String semester;
    private Long requirementId;
    private Long selectedDegreeId;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime deliveryAppointment;
}
package org.kmryfv.icortepooproject.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class IDCardResponseDTO {
    private Long idCardId;
    private String semester;
    private int year;
    @JsonFormat(pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate issueDate;
    @JsonFormat(pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate expirationDate;
    private String status;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime deliveryAppointment;
    private String notes;

    private String cif;
    private String names;
    private String surnames;
    private Set<String> degrees;
    private Set<String> faculties;

    private Long selectedDegreeId;
    private String selectedDegreeName;
    private String selectedFacultyName;
}
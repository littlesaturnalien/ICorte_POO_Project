package org.kmryfv.icortepooproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DegreeResponseDTO {
    private Long degreeId;
    private String degreeName;
    private String facultyName;
}

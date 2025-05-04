package org.kmryfv.icortepooproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudyDTO {
    private Long degreeId;
    private String degreeName;
    private Long facultyId;
    private String facultyName;
}
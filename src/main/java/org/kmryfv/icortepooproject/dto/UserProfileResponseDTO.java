package org.kmryfv.icortepooproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@AllArgsConstructor
@Getter
@Setter
public class UserProfileResponseDTO {
    private String cif;
    private String names;
    private String surnames;
    private String email;
    private String role;
    private String type;
    private List<StudyDTO> studies;
    private String phoneNumber;
    private List<IDCardSimplifiedDTO> idCards;
}

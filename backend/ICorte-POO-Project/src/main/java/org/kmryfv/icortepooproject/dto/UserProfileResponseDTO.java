package org.kmryfv.icortepooproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserProfileResponseDTO {
    private String cif;
    private String names;
    private String surnames;
    private String email;
    private String role;
    private String type;
    private List<String> degrees;
    private List<String> faculties;
    private String phoneNumber;
}

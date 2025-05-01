package org.kmryfv.icortepooproject.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserProfileRequestDTO {
    private String cif;
    private String names;
    private String surnames;
    private String email;
    private String role;
    private String type;
    private List<Long> degrees;
    private List<Long> faculties;
    private String phoneNumber;
}

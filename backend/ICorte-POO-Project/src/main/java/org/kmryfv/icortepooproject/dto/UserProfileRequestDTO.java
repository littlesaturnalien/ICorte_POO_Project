package org.kmryfv.icortepooproject.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserProfileRequestDTO {
    private String cif;
    private String password;
    private String names;
    private String surnames;
    private String email;
    private String role;
    private String type;
}
package org.kmryfv.icortepooproject.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@AllArgsConstructor
@ToString @EqualsAndHashCode
public class LoginRequestDTO {
    private String cif;
    private String password;

}
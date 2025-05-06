package org.kmryfv.icortepooproject.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.kmryfv.icortepooproject.constants.UserRole;

@ToString @EqualsAndHashCode
@Getter @Setter @AllArgsConstructor
public class UserDataDTO {

    @JsonProperty("cif")
    private String CIF;

    @JsonProperty("nombres")
    private String firstName;

    @JsonProperty("apellidos")
    private String lastName;

    @JsonProperty("tipo")
    private String type;

    @JsonProperty("correo")
    private String email;

    @JsonProperty("sexo")
    private String gender;

    @JsonProperty("carrera")
    private String degree;

    @JsonProperty("facultad")
    private String faculty;

    @JsonProperty("rol")
    private UserRole role;
}
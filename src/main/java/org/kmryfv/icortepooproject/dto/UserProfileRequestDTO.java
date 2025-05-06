package org.kmryfv.icortepooproject.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.kmryfv.icortepooproject.constants.UserRole;

import java.util.Set;


@Getter
@Setter
public class UserProfileRequestDTO {
    @NotBlank
    private String cif;
    @NotBlank
    private String password;
    @NotBlank
    @Pattern(
            regexp  = "^[A-Za-z]+(?: [A-Za-z]+)*$",
            message = "Los nombres sólo pueden contener letras sin tildes y un único espacio entre palabras"
    )
    private String names;
    @NotBlank
    @Pattern(
            regexp  = "^[A-Za-z]+(?: [A-Za-z]+)*$",
            message = "Los apellidos sólo pueden contener letras sin tildes y un único espacio entre palabras"
    )
    private String surnames;
    @Email
    private String email;
    @NotBlank
    private UserRole role;
    @NotBlank
    @Pattern(
            regexp = "^(Estudiante|Profesor)$",
            message = "El campo type debe ser 'Estudiante' o 'Profesor'"
    )
    private String type;
    @NotBlank
    private Set<Long> degrees;
}
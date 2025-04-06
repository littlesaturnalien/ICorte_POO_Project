package org.kmryfv.icortepooproject.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.kmryfv.icortepooproject.dto.UserRole;

@Entity
@Table(name = "user_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @Column(name = "cif", unique = true, nullable = false)
    private String cif;

    @Column(name = "nombres", nullable = false)
    private String names;

    @Column(name = "apellidos", nullable = false)
    private String surnames;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private UserRole role;

    @Column(name = "tipo")
    private String type;

    @Column(name = "carrera")
    private String degree;

    @Column(name = "facultad")
    private String faculty;

    @Column(name = "numero")
    private String phoneNumber;

    public UserProfile(String cif, String names, String surnames, String email, UserRole role, String type) {
        this.cif = cif;
        this.names = names;
        this.surnames = surnames;
        this.email = email;
        this.role = role;
        this.type = type;
    }
}
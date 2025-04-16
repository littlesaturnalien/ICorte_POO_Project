package org.kmryfv.icortepooproject.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.kmryfv.icortepooproject.constants.UserRole;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "perfil_usuario")
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
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuario_carrera",
            joinColumns = @JoinColumn(name = "cif"),
            inverseJoinColumns = @JoinColumn(name = "degreeId")
    )
    @Size(max = 2, message = "El usuario no puede tener más de 2 carreras")
    private Set<Degree> degrees = new HashSet<>();

    @Column(name = "facultad")
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuario_facultad",
            joinColumns = @JoinColumn(name = "cif"),
            inverseJoinColumns = @JoinColumn(name = "facultyId")
    )
    @Size(max = 2, message = "El usuario no puede tener más de 2 facultades")
    private Set<Faculty> faculties = new HashSet<>();

    @Column(name = "numero")
    private String phoneNumber;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<IDCard> idCards;

    public UserProfile(String cif, String names, String surnames, String email, UserRole role, String type) {
        this.cif = cif;
        this.names = names;
        this.surnames = surnames;
        this.email = email;
        this.role = role;
        this.type = type;
    }
}
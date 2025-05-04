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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserProfile extends BaseUserCredentials {

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

    @OneToMany(mappedBy = "user")
    private Set<IDCard> idCards;

    public UserProfile(String cif, String names, String surnames, String email,
                       UserRole role, String type) {
        super(cif);
        this.names = names;
        this.surnames = surnames;
        this.email = email;
        this.role = role;
        this.type = type;
    }

    public UserProfile(String cif, String password, String names, String surnames,
                       String email, UserRole role, String type) {
        super(cif, password);
        this.names = names;
        this.surnames = surnames;
        this.email = email;
        this.role = role;
        this.type = type;
    }

    public UserProfile(String cif, String password, String names, String surnames, String email,
                       UserRole role, String type, Set<Degree> degrees, Set<Faculty> faculties) {
        super(cif, password);
        this.names = names;
        this.surnames = surnames;
        this.email = email;
        this.role = role;
        this.type = type;
        this.degrees = degrees;
        this.faculties = faculties;
    }
}
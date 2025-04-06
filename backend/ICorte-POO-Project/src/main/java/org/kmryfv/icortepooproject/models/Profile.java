package org.kmryfv.icortepooproject.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "perfil")
@Getter
@Setter
public class Profile {
    @Id
    @Column(name = "cif", unique = true, nullable = false)
    private String cif;

    @Column(name = "nombres", nullable = false)
    private String names;

    @Column(name = "apellidos", nullable = false)
    private String surnames;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "number", nullable = false)
    private String number;

    @OneToMany(mappedBy = "degreeId")
    private List<Degree> degrees = new ArrayList<>();
}

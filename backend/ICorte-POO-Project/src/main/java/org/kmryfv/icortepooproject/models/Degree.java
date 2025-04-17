package org.kmryfv.icortepooproject.models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Carrera")
@Getter @Setter

public class Degree {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long degreeId;
    private String degreeName;
    @ManyToOne
    @JoinColumn(name = "facultyId", nullable = false)
    private Faculty faculties;
}
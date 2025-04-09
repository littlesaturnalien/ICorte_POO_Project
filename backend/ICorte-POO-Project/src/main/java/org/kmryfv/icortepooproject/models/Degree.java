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
    private int facultyId;
    @ManyToOne(targetEntity = Faculty.class)
    private Faculty faculties;
}

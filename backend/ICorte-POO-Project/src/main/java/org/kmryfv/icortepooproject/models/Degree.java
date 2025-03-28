package org.kmryfv.icortepooproject.models;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Carrera")
@Getter @Setter

public class Degree {
    @Id
    private Long degreeId;

    private String degreeName;
    private int facultyId;
    @ManyToOne(targetEntity = Faculty.class)
    private Faculty faculties;
}

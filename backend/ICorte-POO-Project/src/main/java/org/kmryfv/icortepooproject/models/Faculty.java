package org.kmryfv.icortepooproject.models;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Facultad")
@Getter @Setter
public class Faculty {
    @Id
    private int facultyId;
    private String facultyName;
}

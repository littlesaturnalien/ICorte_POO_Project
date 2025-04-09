package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.models.Degree;

import java.util.List;

public interface IDegreeManagement {

    Degree save(Degree degree);

    List<Degree> getAll();

    Degree getDegreeById(Long id);

    Degree updateDegree(Degree degree);

    void deleteDegree(Long id);

    boolean isDegreeExists(String degreeName);

    Degree getDegreeByName(String degreeName);
}
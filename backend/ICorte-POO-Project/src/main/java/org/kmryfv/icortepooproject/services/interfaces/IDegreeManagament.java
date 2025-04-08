package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.models.Degree;

public interface IDegreeManagament {
    Degree createDegree(Degree degree);
    Degree getDegreeById(Long id);
    Degree updateDegree(Degree degree);
    void deleteDegree(Long id);
    boolean isDegreeExists(String degreeName);
    Degree getDegreeByName(String degreeName);
}

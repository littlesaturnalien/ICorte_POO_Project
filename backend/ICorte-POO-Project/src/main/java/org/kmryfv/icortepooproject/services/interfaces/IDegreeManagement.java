package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.DegreeRequestDTO;
import org.kmryfv.icortepooproject.dto.DegreeResponseDTO;
import org.kmryfv.icortepooproject.models.Degree;

import java.util.List;

public interface IDegreeManagement {

    DegreeResponseDTO save(DegreeRequestDTO degree);

    List<DegreeResponseDTO> getAll();

    DegreeResponseDTO getDegreeById(Long id);

    DegreeResponseDTO updateDegree(Degree request);

    void deleteDegree(Long id);

    boolean isDegreeExists(String degreeName);

    DegreeResponseDTO getDegreeByName(String degreeName);

    Degree getEntityById(Long id);
}
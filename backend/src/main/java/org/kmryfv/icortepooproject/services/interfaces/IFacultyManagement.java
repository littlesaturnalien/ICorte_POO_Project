package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.FacultyRequestDTO;
import org.kmryfv.icortepooproject.dto.FacultyResponseDTO;
import org.kmryfv.icortepooproject.models.Faculty;

import java.util.List;

public interface IFacultyManagement {

    FacultyResponseDTO save(FacultyRequestDTO facultyDTO);

    List<Faculty> getAll();

    FacultyResponseDTO getById(Long id);

    FacultyResponseDTO update(Faculty faculty);

    void delete(Long id);

    boolean existsByName(String facultyName);

    FacultyResponseDTO getByName(String facultyName);
}
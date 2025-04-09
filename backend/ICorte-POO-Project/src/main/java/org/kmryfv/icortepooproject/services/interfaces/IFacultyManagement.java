package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.models.Faculty;

import java.util.List;

public interface IFacultyManagement {

    Faculty save(Faculty faculty);

    List<Faculty> getAll();

    Faculty getById(Long id);

    Faculty update(Faculty faculty);

    void delete(Long id);

    boolean existsByName(String facultyName);

    Faculty getByName(String facultyName);
}
package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.models.Faculty;
import org.kmryfv.icortepooproject.repositories.FacultyRepository;
import org.kmryfv.icortepooproject.services.interfaces.IFacultyManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyManagementImpl implements IFacultyManagement {

    private final FacultyRepository facultyRepository;

    @Autowired
    public FacultyManagementImpl(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    @Override
    public Faculty save(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    @Override
    public List<Faculty> getAll() {
        return facultyRepository.findAll();
    }

    @Override
    public Faculty getById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Faculty with ID " + id + " not found."));
    }

    @Override
    public Faculty update(Faculty faculty) {
        if (!facultyRepository.existsById(faculty.getFacultyId())) {
            throw new EntityNotFoundException("Cannot update. Faculty with ID "
                    + faculty.getFacultyId() + " does not exist.");
        }
        return facultyRepository.save(faculty);
    }

    @Override
    public void delete(Long id) {
        if (!facultyRepository.existsById(id)) {
            throw new EntityNotFoundException("Cannot delete. Faculty with ID " + id + " does not exist.");
        }
        facultyRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String facultyName) {
        return facultyRepository.existsByFacultyName(facultyName);
    }

    @Override
    public Faculty getByName(String facultyName) {
        return facultyRepository.findByFacultyName(facultyName)
                .orElseThrow(() -> new EntityNotFoundException("Faculty with name " + facultyName + " not found."));
    }
}
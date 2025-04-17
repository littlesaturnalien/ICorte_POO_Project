package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.dto.FacultyRequestDTO;
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
    public Faculty save(FacultyRequestDTO facultyDTO) {
        Faculty faculty = new Faculty();
        faculty.setFacultyName(facultyDTO.getFacultyName());
        return facultyRepository.save(faculty);
    }

    @Override
    public List<Faculty> getAll() {
        return facultyRepository.findAll();
    }

    @Override
    public Faculty getById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("La facultad con id " + id + " no fue encontrada."));
    }

    @Override
    public Faculty update(Faculty faculty) {
        if (!facultyRepository.existsById(faculty.getFacultyId())) {
            throw new EntityNotFoundException("No se puede actualizar. La facultad con id "
                    + faculty.getFacultyId() + " no existe.");
        }
        return facultyRepository.save(faculty);
    }

    @Override
    public void delete(Long id) {
        if (!facultyRepository.existsById(id)) {
            throw new EntityNotFoundException("No se puede eliminar. La facultad con id " + id + " no existe.");
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
                .orElseThrow(() -> new EntityNotFoundException("Facultad con el nombre " + facultyName + " no fue encontrada."));
    }
}
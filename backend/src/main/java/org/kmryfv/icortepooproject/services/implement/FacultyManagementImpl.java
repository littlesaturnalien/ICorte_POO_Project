package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.dto.FacultyRequestDTO;
import org.kmryfv.icortepooproject.dto.FacultyResponseDTO;
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
    public FacultyResponseDTO save(FacultyRequestDTO facultyDTO) {
        Faculty faculty = new Faculty();
        faculty.setFacultyName(facultyDTO.getFacultyName());
        facultyRepository.save(faculty);
        return new FacultyResponseDTO(faculty.getFacultyId(), faculty.getFacultyName());
    }

    @Override
    public List<Faculty> getAll() {
        return facultyRepository.findAll();
    }

    @Override
    public FacultyResponseDTO getById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("La facultad con id " + id + " no fue encontrada."));
        return new FacultyResponseDTO(faculty.getFacultyId(), faculty.getFacultyName());
    }

    @Override
    public FacultyResponseDTO update(Faculty faculty) {
        if (!facultyRepository.existsById(faculty.getFacultyId())) {
            throw new EntityNotFoundException("No se puede actualizar. La facultad con id "
                    + faculty.getFacultyId() + " no existe.");
        }
        facultyRepository.save(faculty);
        return new FacultyResponseDTO(faculty.getFacultyId(), faculty.getFacultyName());
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
    public FacultyResponseDTO getByName(String facultyName) {
        Faculty faculty = facultyRepository.findByFacultyName(facultyName)
                .orElseThrow(() -> new EntityNotFoundException("Facultad con el nombre " + facultyName + " no fue encontrada."));
        return new FacultyResponseDTO(faculty.getFacultyId(), faculty.getFacultyName());
    }
}
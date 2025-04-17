package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.dto.DegreeRequestDTO;
import org.kmryfv.icortepooproject.dto.DegreeResponseDTO;
import org.kmryfv.icortepooproject.models.Degree;
import org.kmryfv.icortepooproject.models.Faculty;
import org.kmryfv.icortepooproject.repositories.DegreeRepository;
import org.kmryfv.icortepooproject.repositories.FacultyRepository;
import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DegreeManagementImpl implements IDegreeManagement {

    private final DegreeRepository degreeRepository;
    private final FacultyRepository facultyRepository;

    @Autowired
    public DegreeManagementImpl(DegreeRepository degreeRepository,
                                FacultyRepository facultyRepository) {
        this.degreeRepository = degreeRepository;
        this.facultyRepository = facultyRepository;
    }

    @Override
    public DegreeResponseDTO save(DegreeRequestDTO dto) {
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new EntityNotFoundException("Facultad con id " + dto.getFacultyId() + " no encontrada."));

        Degree degree = new Degree();
        degree.setDegreeName(dto.getDegreeName());
        degree.setFaculties(faculty);

        Degree saved = degreeRepository.save(degree);
        return new DegreeResponseDTO(saved.getDegreeId(), saved.getDegreeName(), saved.getFaculties().getFacultyName());
    }

    @Override
    public List<DegreeResponseDTO> getAll() {
        return degreeRepository.findAll().stream()
                .map(degree -> new DegreeResponseDTO(
                        degree.getDegreeId(),
                        degree.getDegreeName(),
                        degree.getFaculties().getFacultyName()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public DegreeResponseDTO getDegreeById(Long id) {
        Degree degree = degreeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carrera con id " + id + " no encontrada."));
        return new DegreeResponseDTO(degree.getDegreeId(), degree.getDegreeName(), degree.getFaculties().getFacultyName());
    }


    @Override
    public DegreeResponseDTO updateDegree(Degree request) {
        Degree degree = degreeRepository.findById(request.getDegreeId())
                .orElseThrow(() -> new EntityNotFoundException("No se pudo actualizar. Carrera con id "
                        + request.getDegreeId() + " no existe."));

        Faculty faculty = facultyRepository.findById(request.getFaculties().getFacultyId())
                .orElseThrow(() -> new EntityNotFoundException("Facultad con id " + request.getFaculties().getFacultyId() + " no encontrada."));

        degree.setDegreeName(request.getDegreeName());
        degree.setFaculties(faculty);

        Degree updated = degreeRepository.save(degree);
        return new DegreeResponseDTO(updated.getDegreeId(), updated.getDegreeName(), updated.getFaculties().getFacultyName());
    }

    @Override
    public void deleteDegree(Long id) {
        if (!degreeRepository.existsById(id)) {
            throw new EntityNotFoundException("No se pudo borrar. Carrear con  id " + id + " no existe.");
        }
        degreeRepository.deleteById(id);
    }

    @Override
    public boolean isDegreeExists(String degreeName) {
        return degreeRepository.existsByDegreeName(degreeName);
    }

    @Override
    public DegreeResponseDTO getDegreeByName(String degreeName) {
        Degree degree = degreeRepository.findByDegreeName(degreeName)
                .orElseThrow(() -> new EntityNotFoundException("Carrera con nombre " + degreeName + " no encontrada."));
        return new DegreeResponseDTO(degree.getDegreeId(), degree.getDegreeName(), degree.getFaculties().getFacultyName());
    }

    @Override
    public Degree getEntityById(Long id) {
        return degreeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carrera con id " + id + " no encontrada."));
    }
}
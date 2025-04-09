package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.models.Degree;
import org.kmryfv.icortepooproject.repositories.DegreeRepository;
import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DegreeManagementImpl implements IDegreeManagement {

    private final DegreeRepository degreeRepository;

    @Autowired
    public DegreeManagementImpl(DegreeRepository degreeRepository) {
        this.degreeRepository = degreeRepository;
    }

    @Override
    public Degree save(Degree degree) {
        return degreeRepository.save(degree);
    }

    @Override
    public List<Degree> getAll() {
        return degreeRepository.findAll();
    }

    @Override
    public Degree getDegreeById(Long id) {
        return degreeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carrera con id " + id + " no encontrado"));
    }

    @Override
    public Degree updateDegree(Degree degree) {
        if (!degreeRepository.existsById(degree.getDegreeId())) {
            throw new EntityNotFoundException("No se pudo actualizar. Carrera con id "
                    + degree.getDegreeId() + " no existe.");
        }
        return degreeRepository.save(degree);
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
    public Degree getDegreeByName(String degreeName) {
        return degreeRepository.findByDegreeName(degreeName)
                .orElseThrow(() -> new EntityNotFoundException("Carrera con nombre " + degreeName + " no encontrado."));
    }
}
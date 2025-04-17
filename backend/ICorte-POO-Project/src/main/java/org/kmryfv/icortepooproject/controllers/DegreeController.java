package org.kmryfv.icortepooproject.controllers;

import jakarta.validation.Valid;
import org.kmryfv.icortepooproject.dto.DegreeRequestDTO;
import org.kmryfv.icortepooproject.dto.DegreeResponseDTO;
import org.kmryfv.icortepooproject.models.Degree;
import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/degree")
public class DegreeController {

    private final IDegreeManagement degreeService;

    @Autowired
    public DegreeController(IDegreeManagement degreeService) {
        this.degreeService = degreeService;
    }

    @GetMapping
    public List<DegreeResponseDTO> getDegrees() {
        return degreeService.getAll();
    }

    @GetMapping("/{id}")
    public DegreeResponseDTO getDegreeById(@PathVariable Long id) {
        return degreeService.getDegreeById(id);
    }

    @GetMapping("/byName/{name}")
    public DegreeResponseDTO getDegreeByName(@PathVariable String name) {
        return degreeService.getDegreeByName(name);
    }

    @GetMapping("/exists")
    public boolean isDegreeExists(@RequestParam String name) {
        return degreeService.isDegreeExists(name);
    }

    @PostMapping
    public DegreeResponseDTO createDegree(@RequestBody DegreeRequestDTO request) {
        return degreeService.save(request);
    }

    @PutMapping("/{id}")
    public DegreeResponseDTO updateDegree(@PathVariable Long id, @Valid @RequestBody Degree updatedDegree) {
        updatedDegree.setDegreeId(id);
        return degreeService.updateDegree(updatedDegree);
    }

    @DeleteMapping("/{id}")
    public void deleteDegree(@PathVariable Long id) {
        degreeService.deleteDegree(id);
    }
}
package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.dto.RequirementRequestDTO;
import org.kmryfv.icortepooproject.dto.RequirementResponseDTO;
import org.kmryfv.icortepooproject.services.interfaces.IRequirementManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requirement")
public class RequirementController {

    @Autowired
    private IRequirementManagement requirementService;

    @PostMapping
    public ResponseEntity<RequirementResponseDTO> create(@RequestBody RequirementRequestDTO dto) {
        return ResponseEntity.ok(requirementService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<RequirementResponseDTO>> getAll() {
        return ResponseEntity.ok(requirementService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequirementResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(requirementService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequirementResponseDTO> update(@PathVariable Long id, @RequestBody RequirementRequestDTO dto) {
        return ResponseEntity.ok(requirementService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        requirementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
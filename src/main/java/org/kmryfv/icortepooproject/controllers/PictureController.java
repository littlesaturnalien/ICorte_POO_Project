package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.dto.PictureRequestDTO;
import org.kmryfv.icortepooproject.dto.PictureResponseDTO;
import org.kmryfv.icortepooproject.services.interfaces.IPictureManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/picture")
public class PictureController {

    @Autowired
    private IPictureManagement pictureService;

    @PostMapping
    public ResponseEntity<PictureResponseDTO> create(@RequestBody PictureRequestDTO dto) {
        return ResponseEntity.ok(pictureService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<PictureResponseDTO>> getAll() {
        return ResponseEntity.ok(pictureService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PictureResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(pictureService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PictureResponseDTO> update(@PathVariable Long id, @RequestBody PictureRequestDTO dto) {
        return ResponseEntity.ok(pictureService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        pictureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
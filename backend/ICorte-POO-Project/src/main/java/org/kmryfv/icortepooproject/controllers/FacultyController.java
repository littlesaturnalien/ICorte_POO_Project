package org.kmryfv.icortepooproject.controllers;

import jakarta.validation.Valid;
import org.kmryfv.icortepooproject.dto.FacultyRequestDTO;
import org.kmryfv.icortepooproject.dto.FacultyResponseDTO;
import org.kmryfv.icortepooproject.models.Faculty;
import org.kmryfv.icortepooproject.services.interfaces.IFacultyManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faculty")
public class FacultyController {

    private final IFacultyManagement facultyService;

    @Autowired
    public FacultyController(IFacultyManagement facultyService) {
        this.facultyService = facultyService;
    }

    // 1. Get all
    @GetMapping
    public List<Faculty> getAllFaculties() {
        return facultyService.getAll();
    }

    // 2. Get by ID
    @GetMapping("/{id}")
    public FacultyResponseDTO getFacultyById(@PathVariable Long id) {
        return facultyService.getById(id);
    }

    // 3. Check if faculty exists by name
    @GetMapping("/exists")
    public boolean existsByName(@RequestParam String name) {
        return facultyService.existsByName(name);
    }

    // 4. Get faculty by name
    @GetMapping("/byName/{name}")
    public FacultyResponseDTO getFacultyByName(@PathVariable String name) {
        return facultyService.getByName(name);
    }

    // 5. Create new faculty
    @PostMapping
    public FacultyResponseDTO createFaculty(@RequestBody FacultyRequestDTO facultyDTO) {
        return facultyService.save(facultyDTO);
    }

    // 6. Update existing faculty
    @PutMapping("/{id}")
    public FacultyResponseDTO updateFaculty(@PathVariable Long id, @Valid @RequestBody Faculty updatedFaculty) {
        updatedFaculty.setFacultyId(id);
        return facultyService.update(updatedFaculty);
    }

    // 7. Delete faculty
    @DeleteMapping("/{id}")
    public void deleteFaculty(@PathVariable Long id) {
        facultyService.delete(id);
    }
}
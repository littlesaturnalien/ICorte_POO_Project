package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.services.interfaces.IStudentManagement;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private IStudentManagement studentManagement;

    @Autowired
    private IUserService userService;

    @GetMapping
    public ResponseEntity<?> getAllStudents(){
        try {
            var students = studentManagement.getAllStudents();
            if (students.isEmpty()){
                return ResponseEntity.status(401).body("No hay estudiantes registrados.");
            } else {
                return ResponseEntity.ok(students);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al listar a los estudiantes.");
        }
    }

    @GetMapping("/byCify={cif}")
    public ResponseEntity<?> getStudentByCif(@PathVariable("cif") String cif){
        try {
            var student = userService.findByCif(cif);
            if (student.isEmpty()){
                return ResponseEntity.status(401).body("No se encuentra el estudiante.");
            } else {
                return ResponseEntity.ok(student);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al buscar al estudiante: " + e.getMessage());
        }
    }

    @GetMapping("/byDegree={id}")
    public ResponseEntity<?> getAllStudentsByDegree(@PathVariable("id") Long id){
        try {
            var students = studentManagement.getAllStudentsByDegree(id);
            if (students.isEmpty()){
                return ResponseEntity.status(401).body("No hay estudiantes de esta carrera registrados.");
            } else {
                return ResponseEntity.ok(students);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al listar a los estudiantes: " + e.getMessage());
        }
    }

    @GetMapping("/byFaculty={id}")
    public ResponseEntity<?> getAllStudentsByFaculty(@PathVariable("id") Long id){
        try {
            var students = studentManagement.getAllStudentsByFaculty(id);
            if (students.isEmpty()){
                return ResponseEntity.status(401).body("No hay estudiantes de esta facultad registrados.");
            } else {
                return ResponseEntity.ok(students);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al listar a los estudiantes: " + e.getMessage());
        }
    }
}

package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagement;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final IUserService userService;
    private final IDegreeManagement degreeManagement;

    @Autowired
    public UserController(IUserService userService, IDegreeManagement degreeManagement) {
        this.userService = userService;
        this.degreeManagement = degreeManagement;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequestDTO loginRequest) {
        try {
            List<UserDataDTO> userData = userService.authenticate(loginRequest);
            if (userData == null || userData.isEmpty()) {
                return ResponseEntity.status(401).body("No se encontraron datos de usuario");
            }
            UserDataDTO user = userData.get(0);
            if (!userService.isAuthorized(user)) {
                return ResponseEntity.status(403).body("Acceso denegado. Solo los estudiantes, administradores o superadministradores tienen acceso automático.");
            }
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al autenticar: " + e.getMessage());
        }
    }

    @PutMapping("/cif={cif}/setDegree={id}")
    public ResponseEntity<?> setDegree(@PathVariable("cif") String cif, @PathVariable("id") Long id){
        try{
            var user = userService.findByCif(cif.toUpperCase());
            if (user.isEmpty()) {
                return ResponseEntity.status(401).body("No se encontró al usuario con cif: " + cif.toUpperCase());
            } else {
                var userProfile = user.get();
                var degree = degreeManagement.getDegreeById(id);
                if (degree == null) {
                    return ResponseEntity.status(404).body("No se encontró la carrera con ID: " + id);
                }
                if (userProfile.getDegrees().contains(degree)) {
                    return ResponseEntity.status(400).body("El usuario ya está inscrito en esta carrera");
                }
                userProfile.getDegrees().add(degree);
                var faculty = degree.getFaculties();
                if (faculty != null && !userProfile.getFaculties().contains(faculty)) {
                    userProfile.getFaculties().add(faculty);
                }
                userService.update(userProfile);
                return ResponseEntity.ok("Carrera y facultad asignadas con éxito");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error para agregar carrera: " + e.getMessage());
        }
    }


    @PutMapping("/cif={cif}/setNumber={number}")
    public ResponseEntity<?> setNumber(@PathVariable("cif") String cif, @PathVariable("number") String number){
        try {
            var user = userService.findByCif(cif.toUpperCase());
            if (user.isEmpty()) {
                return ResponseEntity.status(401).body("No se encontró al estudiante con cif: " + cif.toUpperCase());
            } else {
                var userProfile = user.get();
                userProfile.setPhoneNumber(number);
                userService.update(userProfile);
                return ResponseEntity.ok("Número telefónico actualizado con éxito");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error para agregar número: " + e.getMessage());
        }
    }
}

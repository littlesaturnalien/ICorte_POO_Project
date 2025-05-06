package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
//import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.dto.UserProfileRequestDTO;
//import org.kmryfv.icortepooproject.dto.UserProfileResponseDTO;
import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagement;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private final IUserService userService;
    private final IDegreeManagement degreeManagement;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(IUserService userService, IDegreeManagement degreeManagement, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.degreeManagement = degreeManagement;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequestDTO loginRequest) {
        try {
            var user = userService.authenticateDB(loginRequest);
            if (user == null) {
                return ResponseEntity.status(401).body("No se encontraron datos de usuario");
            }
            if (!userService.isAuthorized(user)) {
                return ResponseEntity.status(403).body("Acceso denegado. Solo los estudiantes, administradores o superadministradores tienen acceso automático.");
            } return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al autenticar: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody UserProfileRequestDTO request){
        try {
            return ResponseEntity.ok(userService.create(request));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear nuevo usuario: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(){
        try {
            var users = userService.getAllUsers();
            if (users.isEmpty()){
                return ResponseEntity.status(401).body("No hay estudiantes registrados.");
            } else {
                return ResponseEntity.ok(users);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al listar a los estudiantes.");
        }
    }

    @GetMapping("/byCif={cif}")
    public ResponseEntity<?> getUserByCif(@PathVariable("cif") String cif){
        try {
            var user = userService.findByCif(cif);
            if (user.isEmpty()){
                return ResponseEntity.status(401).body("Usuario no encontrado");
            }
            return ResponseEntity.ok(user.stream().map(userService::toResponseDTO).toList());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al buscar al estudiante: " + e.getMessage());
        }
    }

    @PatchMapping("/cif={cif}/setDegree={id}")
    public ResponseEntity<?> setDegree(@PathVariable("cif") String cif, @PathVariable("id") Long id){
        try{
            var user = userService.findByCif(cif.toUpperCase());
            if (user.isEmpty()) {
                return ResponseEntity.status(401).body("No se encontró al usuario con cif: " + cif.toUpperCase());
            } else {
                var userProfile = user.get();
                var degree = degreeManagement.getEntityById(id);
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
                return ResponseEntity.ok("Carrera asignada con éxito");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error para agregar carrera: " + e.getMessage());
        }
    }

    @PatchMapping("/cif={cif}/removeDegree={id}")
    public ResponseEntity<?> removeDegree(@PathVariable("cif") String cif, @PathVariable("id") Long id){
        try{
            var user = userService.findByCif(cif.toUpperCase());
            if (user.isEmpty()) {
                return ResponseEntity.status(401).body("No se encontró al usuario con cif: " + cif.toUpperCase());
            } else {
                var userProfile = user.get();
                var degree = degreeManagement.getEntityById(id);
                if (degree == null) {
                    return ResponseEntity.status(404).body("No se encontró la carrera con ID: " + id);
                }
                if (userProfile.getDegrees().contains(degree)) {
                    var faculty = degree.getFaculties();
                    userProfile.getDegrees().remove(degree);
                    boolean hasOtherDegreeFromTheSameFaculty = userProfile.getDegrees().stream()
                            .anyMatch(d -> d.getFaculties().equals(faculty));

                    if (!hasOtherDegreeFromTheSameFaculty) {
                        userProfile.getFaculties().remove(faculty);
                    }
                    userService.update(userProfile);
                    return ResponseEntity.ok("Carrera elminada con éxito");
                } else {
                    return ResponseEntity.status(400).body("El usuario no tiene asignada esta carrera.");
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error para remover la carrera: " + e.getMessage());
        }
    }


    @PatchMapping("/cif={cif}/setNumber={number}")
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

    @PatchMapping("/cif={cif}/setPassword={password}")
    public ResponseEntity<?> setPassword(@PathVariable("cif") String cif, @PathVariable("password") String password){
        try {
            var user = userService.findByCif(cif.toUpperCase());
            if (user.isEmpty()) {
                return ResponseEntity.status(401).body("No se encontró al estudiante con cif: " + cif.toUpperCase());
            } else {
                var userProfile = user.get();
                userProfile.setPassword(passwordEncoder.encode(password));
                userService.update(userProfile);
                return ResponseEntity.ok("Contraseña actualizada con éxito");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error para agregar número: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete={cif}")
    public void deleteUser(@PathVariable String cif) {
        userService.delete(cif);
    }
}
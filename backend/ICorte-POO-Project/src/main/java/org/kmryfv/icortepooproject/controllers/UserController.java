package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.services.interfaces.IRoleAssignment;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final IUserService userService;
    private final IRoleAssignment roleService;

    @Autowired
    public UserController(IUserService userService, IRoleAssignment roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequestDTO loginRequest) {
        try {
            List<UserDataDTO> userData = userService.authenticate(loginRequest);
            if (userData == null || userData.isEmpty()) {
                return ResponseEntity.status(401).body("No se encontraron datos de usuario");
            }
            UserDataDTO user = userData.get(0);
            if (!roleService.isAuthorized(user)) {
                return ResponseEntity.status(403).body("Acceso denegado. Solo los estudiantes, administradores o superadministradores tienen acceso automático.");
            }
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al autenticar: " + e.getMessage());
        }
    }
}

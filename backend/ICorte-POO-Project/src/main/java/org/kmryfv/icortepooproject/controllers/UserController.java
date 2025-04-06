package org.kmryfv.icortepooproject.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.services.interfaces.IRoleAssignment;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    private final IUserService userService;
    private final IRoleAssignment roleService;
    private final ObjectMapper objectMapper = new ObjectMapper();

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
                return ResponseEntity.status(403).body("Acceso denegado. Solo los estudiantes, administradores o superadministradores tienen acceso automático. Contacte al administrador.");
            }
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al autenticar: " + e.getMessage());
        }
    }

    @PostMapping("/{adminCif}/promoteToAdmin")
    public ResponseEntity<?> promoteToAdmin(@PathVariable String adminCif, @RequestBody Map<String, String> cif) {
        try {
            if (!roleService.canManageRoles(adminCif)) {
                return ResponseEntity.status(403).body("No tienes permisos para promover usuarios");
            }
            String targetCif = cif.get("cif");
            roleService.promoteToAdmin(adminCif, targetCif);
            return ResponseEntity.ok("Usuario promovido a administrador con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al promover usuario: " + e.getMessage());
        }
    }
}

package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.services.interfaces.IRoleAssignment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final IRoleAssignment roleService;

    public AdminController(IRoleAssignment roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/{adminCif}/promoteToAdmin")
    public ResponseEntity<?> promoteToAdmin(@PathVariable String adminCif, @RequestBody Map<String, String> cif) {
        try {
            if (!roleService.canManageRoles(adminCif)) {
                return ResponseEntity.status(403).body("No tienes permisos para promover usuarios");
            }
            String targetCif = cif.get("cif");
            roleService.promoteToAdmin(targetCif);
            return ResponseEntity.ok("Usuario promovido a administrador con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al promover usuario: " + e.getMessage());
        }
    }

    @PostMapping("/{adminCif}/revokeAdminRole")
    public ResponseEntity<?> revokeAdminRole(@PathVariable String adminCif, @RequestBody Map<String, String> cif){
        try {
            if (!roleService.canManageRoles(adminCif)) {
                return ResponseEntity.status(403).body("No tienes permisos para revocar el rol de administrador");
            }
            String targetCif = cif.get("cif");
            roleService.revokeAdminRole(targetCif);
            return ResponseEntity.ok("Usuario removido del rol de administrador con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al revocar rol: " + e.getMessage());
        }
    }
}

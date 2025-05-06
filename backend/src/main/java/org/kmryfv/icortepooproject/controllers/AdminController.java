package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.services.interfaces.IAdminManagement;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final IAdminManagement adminService;
    private final IUserService userService;

    public AdminController(IAdminManagement adminService, IUserService userService) {
        this.adminService = adminService;
        this.userService = userService;
    }

    @PatchMapping("/{adminCif}/promoteToAdmin")
    public ResponseEntity<?> promoteToAdmin(@PathVariable String adminCif, @RequestBody Map<String, String> cif) {
        try {
            if (!adminService.canManageRoles(adminCif)) {
                return ResponseEntity.status(403).body("No tienes permisos para promover usuarios");
            }
            String targetCif = cif.get("cif").toUpperCase();
            adminService.promoteToAdmin(targetCif);
            return ResponseEntity.ok("Usuario promovido a administrador con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al promover usuario: " + e.getMessage());
        }
    }

    @PatchMapping("/{adminCif}/revokeAdminRole")
    public ResponseEntity<?> revokeAdminRole(@PathVariable String adminCif, @RequestBody Map<String, String> cif){
        try {
            if (!adminService.canManageRoles(adminCif)) {
                return ResponseEntity.status(403).body("No tienes permisos para revocar el rol de administrador");
            }
            String targetCif = cif.get("cif").toUpperCase();
            adminService.revokeAdminRole(targetCif);
            return ResponseEntity.ok("Usuario removido del rol de administrador con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al revocar rol: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllAdmins() {
        try {
            List<UserProfile> admins = adminService.getAllAdmins();
            return ResponseEntity.ok(admins.stream()
                    .map(userService::toResponseDTO)
                    .toList());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al listar a los administradores: " + e.getMessage());
        }
    }

    @GetMapping("/byCif={cif}")
    public ResponseEntity<?> getAdminByCif(@PathVariable("cif") String cif){
        try {
            var dto = adminService.getAdminByCif(cif);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al buscar al administrador: " + e.getMessage());
        }
    }
}
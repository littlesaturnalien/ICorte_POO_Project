package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.dto.UserRole;
import org.kmryfv.icortepooproject.services.interfaces.IRoleAssignment;
import org.kmryfv.icortepooproject.services.interfaces.IRolePersistence;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoleAssignmentImpl implements IRoleAssignment {
    private static final String SUPERADMIN_CIF = "23010471";
    private final Map<String, UserRole> roleMap = new HashMap<>();
    private final Map<String, Boolean> approvalMap = new HashMap<>();
    private final IRolePersistence persistenceService;

    public RoleAssignmentImpl(IRolePersistence persistenceService) {
        this.persistenceService = persistenceService;
        initializeRoles();
    }

    private void initializeRoles() {
        roleMap.putAll(persistenceService.loadRoles());
        approvalMap.putAll(persistenceService.loadApprovals());

        // Asegurarse de que el superadmin esté inicializado
        if (!roleMap.containsKey(SUPERADMIN_CIF)) {
            roleMap.put(SUPERADMIN_CIF, UserRole.SUPERADMIN);
            approvalMap.put(SUPERADMIN_CIF, true);
            persistenceService.saveRoles(roleMap, approvalMap);
        }
    }

    @Override
    public List<UserDataDTO> assignRoles(List<UserDataDTO> userDataList) {
        return userDataList.stream().map(this::assignRoleToUser).collect(Collectors.toList());
    }

    private UserDataDTO assignRoleToUser(UserDataDTO userDTO) {
        String cif = userDTO.getCIF();

        // Verificar si ya existe en el mapa de roles
        if (roleMap.containsKey(cif)) {
            userDTO.setRole(roleMap.get(cif));
            return userDTO;
        }

        // Asignar rol inicial basado en el tipo de la API
        if ("Estudiante".equalsIgnoreCase(userDTO.getType())) {
            userDTO.setRole(UserRole.STUDENT);
            roleMap.put(cif, UserRole.STUDENT);
            approvalMap.put(cif, true); // Estudiantes siempre aprobados
        } else if ("Profesor".equalsIgnoreCase(userDTO.getType())) {
            userDTO.setRole(UserRole.BLOCKED);
            roleMap.put(cif, UserRole.BLOCKED);
            approvalMap.put(cif, false); // Profesores no aprobados por defecto
        } else {
            userDTO.setRole(UserRole.BLOCKED);
            roleMap.put(cif, UserRole.BLOCKED);
            approvalMap.put(cif, false);
        }
        persistenceService.saveRoles(roleMap, approvalMap);
        return userDTO;
    }

    @Override
    public boolean isAuthorized(UserDataDTO user) {
        if (user.getRole() == null) return false;
        if (user.getRole() == UserRole.SUPERADMIN) return true;
        if (user.getRole() == UserRole.ADMIN) return true;
        if (user.getRole() == UserRole.STUDENT) return true;
        if (user.getRole() == UserRole.BLOCKED) {
            return approvalMap.getOrDefault(user.getCIF(), false);
        }
        return false;
    }

    @Override
    public void promoteToAdmin(String superAdminCif, String targetCif) {
        if (!canManageRoles(superAdminCif)) {
            throw new RuntimeException("No tienes permisos para promover usuarios");
        }
        roleMap.put(targetCif, UserRole.ADMIN);
        approvalMap.put(targetCif, true);
        persistenceService.saveRoles(roleMap, approvalMap);
    }

    @Override
    public boolean canManageRoles(String cif) {
        UserRole role = roleMap.getOrDefault(cif, UserRole.BLOCKED);
        return role == UserRole.SUPERADMIN || role == UserRole.ADMIN;
    }
}

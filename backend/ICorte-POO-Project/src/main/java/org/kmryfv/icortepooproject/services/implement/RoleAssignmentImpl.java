package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.dto.UserRole;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.services.interfaces.IRoleAssignment;
import org.kmryfv.icortepooproject.services.interfaces.IRolePersistenceService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static org.kmryfv.icortepooproject.constants.Superadmin.*;

@Service
public class RoleAssignmentImpl implements IRoleAssignment {
    private final IRolePersistenceService persistenceService;

    public RoleAssignmentImpl(IRolePersistenceService persistenceService) {
        this.persistenceService = persistenceService;
        initializeRoles();
    }

    private void initializeRoles() {
        if (persistenceService.findByCif(SUPERADMIN_CIF).isEmpty()) {
            UserProfile superAdmin = new UserProfile(SUPERADMIN_CIF, SUPERADMIN_NAME,
                    SUPERADMIN_SURNANME, SUPERADMIN_EMAIl, UserRole.SUPERADMIN,
                    SUPERADMIN_TYPE);
            persistenceService.saveUserProfile(superAdmin);
        }
    }

    @Override
    public List<UserDataDTO> assignRoles(List<UserDataDTO> userDataList) {
        return userDataList.stream().map(this::assignRoleToUser).collect(Collectors.toList());
    }

    private UserDataDTO assignRoleToUser(UserDataDTO userDTO) {
        String cif = userDTO.getCIF();

        // Verificar si ya existe en la base de datos
        if (persistenceService.findByCif(cif).isPresent()) {
            UserProfile existingUser = persistenceService.findByCif(cif).get();
            userDTO.setRole(existingUser.getRole());
            return userDTO;
        }

        // Asignar rol inicial basado en el tipo de la API
        if ("Estudiante".equalsIgnoreCase(userDTO.getType())) {
            userDTO.setRole(UserRole.STUDENT);
        } else {
            userDTO.setRole(UserRole.BLOCKED);
        }
        // Guardar el nuevo usuario en la base de datos
        UserProfile newUser = new UserProfile(
                userDTO.getCIF(),
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getEmail(),
                userDTO.getRole(),
                userDTO.getType()
        );
        persistenceService.saveUserProfile(newUser);

        return userDTO;
    }

    @Override
    public boolean isAuthorized(UserDataDTO user) {
        if (user.getRole() == null) return false;
        if (user.getRole() == UserRole.SUPERADMIN) return true;
        if (user.getRole() == UserRole.ADMIN) return true;
        if (user.getRole() == UserRole.STUDENT) return true;
        if (user.getRole() == UserRole.BLOCKED) {
            return persistenceService.findByCif(user.getCIF())
                    .map(UserProfile::getRole)
                    .filter(role -> role != UserRole.BLOCKED)
                    .isPresent();
        }
        return false;
    }
}

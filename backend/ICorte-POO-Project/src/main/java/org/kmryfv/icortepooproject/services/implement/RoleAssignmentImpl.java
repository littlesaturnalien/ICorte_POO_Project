package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.constants.Superadmin;
import org.kmryfv.icortepooproject.constants.Superadmin2;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.constants.UserRole;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.services.interfaces.IRoleAssignment;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static org.kmryfv.icortepooproject.constants.Superadmin.*;
import static org.kmryfv.icortepooproject.constants.Superadmin2.SUPERADMIN2_CIF;

@Service
public class RoleAssignmentImpl implements IRoleAssignment {
    private final IUserService userService;

    public RoleAssignmentImpl(IUserService userService) {
        this.userService = userService;
        initializeRoles();
    }

    private void initializeRoles() {
        if (userService.findByCif(SUPERADMIN_CIF).isEmpty()) {
            userService.saveUserProfile(Superadmin.superAdmin);
        }
        if (userService.findByCif(SUPERADMIN2_CIF).isEmpty()) {
            userService.saveUserProfile(Superadmin2.superAdmin);
        }
    }

    @Override
    public List<UserDataDTO> assignRoles(List<UserDataDTO> userDataList) {
        return userDataList.stream().map(this::assignRoleToUser).collect(Collectors.toList());
    }

    private UserDataDTO assignRoleToUser(UserDataDTO userDTO) {
        String cif = userDTO.getCIF();

        // Verificar si ya existe en la base de datos
        if (userService.findByCif(cif).isPresent()) {
            UserProfile existingUser = userService.findByCif(cif).get();
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
        userService.saveUserProfile(newUser);

        return userDTO;
    }
}

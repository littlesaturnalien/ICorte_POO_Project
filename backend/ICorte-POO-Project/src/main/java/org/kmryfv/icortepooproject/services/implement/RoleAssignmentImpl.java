package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.constants.Superadmin;
import org.kmryfv.icortepooproject.constants.Superadmin2;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.constants.UserRole;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IRoleAssignment;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static org.kmryfv.icortepooproject.constants.Superadmin.SUPERADMIN_CIF;
import static org.kmryfv.icortepooproject.constants.Superadmin.SUPERADMIN_PASSWORD_HASH;
import static org.kmryfv.icortepooproject.constants.Superadmin2.SUPERADMIN2_CIF;
import static org.kmryfv.icortepooproject.constants.Superadmin2.SUPERADMIN2_PASSWORD_HASH;

@Service
public class RoleAssignmentImpl implements IRoleAssignment {

    private final UserProfileRepository userProfileRepository;

    public RoleAssignmentImpl(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
        initializeRoles();
    }

    private void initializeRoles() {
        if (userProfileRepository.findById(SUPERADMIN_CIF).isEmpty()) {
            userProfileRepository.save(Superadmin.superAdmin);
        }
        if (userProfileRepository.findById(SUPERADMIN2_CIF).isEmpty()) {
            userProfileRepository.save(Superadmin2.superAdmin);
        }
    }

    @Override
    public List<UserDataDTO> assignRoles(List<UserDataDTO> userDataList) {
        return userDataList.stream().map(this::assignRoleToUser).collect(Collectors.toList());
    }

    private UserDataDTO assignRoleToUser(UserDataDTO userDTO) {
        String cif = userDTO.getCIF().toUpperCase();

        if (userProfileRepository.findById(cif).isPresent()) {
            UserProfile existingUser = userProfileRepository.findById(cif).get();
            userDTO.setRole(existingUser.getRole());
            return userDTO;
        }

        if ("Estudiante".equalsIgnoreCase(userDTO.getType())) {
            userDTO.setRole(UserRole.STUDENT);
        } else {
            userDTO.setRole(UserRole.BLOCKED);
        }

        UserProfile newUser = new UserProfile(
                cif,
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getEmail(),
                userDTO.getRole(),
                userDTO.getType()
        );
        userProfileRepository.save(newUser);

        return userDTO;
    }
}
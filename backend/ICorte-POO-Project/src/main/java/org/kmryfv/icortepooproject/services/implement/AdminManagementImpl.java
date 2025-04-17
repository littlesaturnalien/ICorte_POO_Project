package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.constants.UserRole;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IAdminManagement;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static org.kmryfv.icortepooproject.constants.Superadmin.SUPERADMIN_CIF;
import static org.kmryfv.icortepooproject.constants.Superadmin2.SUPERADMIN2_CIF;

@Service
public class AdminManagementImpl implements IAdminManagement {
    private final UserProfileRepository userProfileRepository;
    private final IUserService userService;

    public AdminManagementImpl(IUserService userService, UserProfileRepository userProfileRepository){
        this.userService = userService;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public void promoteToAdmin(String targetCif) {
        userService.updateRole(targetCif.toUpperCase(), UserRole.ADMIN);
    }

    @Override
    public void revokeAdminRole(String targetCif) {
        if (targetCif.equals(SUPERADMIN_CIF) || targetCif.equals(SUPERADMIN2_CIF)) {
            throw new RuntimeException("No se puede revocar el rol del superadministrador");
        }
        UserProfile userProfile = userService.findByCif(targetCif.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserRole defaultRole;
        if ("Estudiante".equalsIgnoreCase(userProfile.getType())) {
            defaultRole = UserRole.STUDENT;
        } else {
            defaultRole = UserRole.BLOCKED;
        }
        userService.updateRole(targetCif.toUpperCase(), defaultRole);
    }

    @Override
    public boolean canManageRoles(String cif) {
        return userService.findByCif(cif)
                .map(user -> user.getRole() == UserRole.SUPERADMIN || user.getRole() == UserRole.ADMIN)
                .orElse(false);
    }

    @Override
    public List<UserProfile> getAllAdmins() {
        return userProfileRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.SUPERADMIN)
                .collect(Collectors.toList());
    }
}
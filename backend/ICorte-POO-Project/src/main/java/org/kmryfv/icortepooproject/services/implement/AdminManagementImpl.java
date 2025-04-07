package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.dto.UserRole;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IAdminManagement;
import org.kmryfv.icortepooproject.services.interfaces.IRolePersistenceService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static org.kmryfv.icortepooproject.constants.Superadmin.SUPERADMIN_CIF;

@Service
public class AdminManagementImpl implements IAdminManagement {
    private final UserProfileRepository userProfileRepository;
    private final IRolePersistenceService persistenceService;

    public AdminManagementImpl(IRolePersistenceService persistenceService,
                               UserProfileRepository userProfileRepository){
        this.persistenceService = persistenceService;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public void promoteToAdmin(String targetCif) {
        persistenceService.updateRole(targetCif.toUpperCase(), UserRole.ADMIN);
    }

    @Override
    public void revokeAdminRole(String targetCif) {
        if (targetCif.equals(SUPERADMIN_CIF)) {
            throw new RuntimeException("No se puede revocar el rol del superadministrador");
        }
        UserProfile userProfile = persistenceService.findByCif(targetCif.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserRole defaultRole;
        if ("Estudiante".equalsIgnoreCase(userProfile.getType())) {
            defaultRole = UserRole.STUDENT;
        } else {
            defaultRole = UserRole.BLOCKED;
        }
        persistenceService.updateRole(targetCif.toUpperCase(), defaultRole);
    }

    @Override
    public boolean canManageRoles(String cif) {
        return persistenceService.findByCif(cif)
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

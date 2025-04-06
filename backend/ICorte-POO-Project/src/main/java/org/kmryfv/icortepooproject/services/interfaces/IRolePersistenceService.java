package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.UserRole;
import org.kmryfv.icortepooproject.models.UserProfile;

import java.util.Map;
import java.util.Optional;

public interface IRolePersistenceService {
    void saveUserProfile(UserProfile userProfile);
    Optional<UserProfile> findByCif(String cif);
    void updateRole(String cif, UserRole role);
}

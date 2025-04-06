package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.dto.UserRole;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IRolePersistenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class IRolePersistenceServiceImpl implements IRolePersistenceService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Override
    public void saveUserProfile(UserProfile userProfile) {
        userProfileRepository.save(userProfile);
    }

    @Override
    public Optional<UserProfile> findByCif(String cif) {
        return userProfileRepository.findById(cif);
    }

    @Override
    public void updateRole(String cif, UserRole role) {
        Optional<UserProfile> userOpt = findByCif(cif);
        userOpt.ifPresent(user -> {
            user.setRole(role);
            userProfileRepository.save(user);
        });
    }

    @Override
    public Map<String, UserRole> loadAllRoles() {
        return userProfileRepository.findAll().stream()
                .collect(HashMap::new, (map, user) -> map.put(user.getCif(), user.getRole()), HashMap::putAll);
    }
}

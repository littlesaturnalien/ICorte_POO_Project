package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.constants.UserRole;
import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.dto.UserProfileResponseDTO;
import org.kmryfv.icortepooproject.models.UserProfile;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<UserDataDTO> authenticate(LoginRequestDTO loginRequest);
    boolean isAuthorized(UserDataDTO user);
    Optional<UserProfile> findByCif(String cif);
    void updateRole(String cif, UserRole role);
    UserProfile update(UserProfile user);
    void delete(String cif);
    List<UserProfileResponseDTO> getAllUsers();
    UserProfileResponseDTO toResponseDTO(UserProfile user);
}
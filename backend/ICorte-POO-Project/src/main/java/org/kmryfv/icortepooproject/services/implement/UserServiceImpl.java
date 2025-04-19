package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.constants.UserRole;
import org.kmryfv.icortepooproject.dto.IDCardSimplifiedDTO;
import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.dto.UserProfileResponseDTO;
import org.kmryfv.icortepooproject.models.Degree;
import org.kmryfv.icortepooproject.models.Faculty;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.api.ApiManager;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    private final ApiManager api;

    @Autowired
    public UserServiceImpl(ApiManager api) {
        this.api = api;
    }

    @Override
    public List<UserDataDTO> authenticate(LoginRequestDTO loginRequest) {
        String cif = loginRequest.getCif();
        String password = loginRequest.getPassword();
        return api.userAuthenticationManager(cif, password);
    }

    @Override
    public boolean isAuthorized(UserDataDTO user) {
        if (user.getRole() == null) return false;
        if (user.getRole() == UserRole.SUPERADMIN) return true;
        if (user.getRole() == UserRole.ADMIN) return true;
        if (user.getRole() == UserRole.STUDENT) return true;
        if (user.getRole() == UserRole.BLOCKED) {
            return findByCif(user.getCIF())
                    .map(UserProfile::getRole)
                    .filter(role -> role != UserRole.BLOCKED)
                    .isPresent();
        }
        return false;
    }

    @Override
    public Optional<UserProfile> findByCif(String cif) {
        return userProfileRepository.findById(cif.toUpperCase());
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
    public UserProfile update(UserProfile user) {
        return userProfileRepository.save(user);
    }

    @Override
    public void delete(String cif) {
        if (!userProfileRepository.existsById(cif.toUpperCase())) {
            throw new EntityNotFoundException("No se puede eliminar. El usuario con cif " + cif + " no existe.");
        }
        userProfileRepository.deleteById(cif.toUpperCase());
    }

    @Override
    public List<UserProfileResponseDTO> getAllUsers() {
        return userProfileRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public UserProfileResponseDTO toResponseDTO(UserProfile user) {
        var idCards = user.getIdCards().stream()
                .map(card -> new IDCardSimplifiedDTO(
                        card.getSemester(),
                        card.getYear(),
                        card.getStatus().name(),
                        card.getDeliveryAppointment()
                ))
                .toList();

        return new UserProfileResponseDTO(
                user.getCif(),
                user.getNames(),
                user.getSurnames(),
                user.getEmail(),
                user.getRole().name(),
                user.getType(),
                user.getDegrees().stream()
                        .map(Degree::getDegreeName)
                        .collect(Collectors.toList()),
                user.getFaculties().stream()
                        .map(Faculty::getFacultyName)
                        .collect(Collectors.toList()),
                user.getPhoneNumber(),
                idCards
        );
    }
}
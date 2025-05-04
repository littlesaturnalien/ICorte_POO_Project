package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.constants.UserRole;
import org.kmryfv.icortepooproject.dto.*;
import org.kmryfv.icortepooproject.models.Degree;
import org.kmryfv.icortepooproject.models.Faculty;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.repositories.DegreeRepository;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.api.ApiManager;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private DegreeRepository degreeRepository;

    private final ApiManager api;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(ApiManager api, PasswordEncoder passwordEncoder) {
        this.api = api;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserProfileResponseDTO authenticateDB(LoginRequestDTO loginRequest) {
        String cif = loginRequest.getCif();
        String password = loginRequest.getPassword();
        return findByCif(cif)
                    .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                    .map(this::toResponseDTO)
                    .orElseThrow(() -> new RuntimeException("Credenciales inválidas (DB)"));
    }

    @Override
    public List<UserDataDTO> authenticateAPI(LoginRequestDTO loginRequest){
        String cif = loginRequest.getCif();
        String password = loginRequest.getPassword();
        var userData = api.userAuthenticationManager(cif, password);
        var profile = findByCif(cif).get();
        if (profile.getPassword().isEmpty()){
            profile.setPassword(passwordEncoder.encode(password));
            userProfileRepository.save(profile);
        }
        return userData;
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
    public boolean isAuthorized(UserProfileResponseDTO user) {
        if (user.getRole() == null) return false;
        if (user.getRole().equalsIgnoreCase(String.valueOf(UserRole.SUPERADMIN))) return true;
        if (user.getRole().equalsIgnoreCase(String.valueOf(UserRole.ADMIN))) return true;
        if (user.getRole().equalsIgnoreCase(String.valueOf(UserRole.STUDENT))) return true;
        if (user.getRole().equalsIgnoreCase(String.valueOf(UserRole.BLOCKED))) {
            return findByCif(user.getCif())
                    .map(UserProfile::getRole)
                    .filter(role -> role != UserRole.BLOCKED)
                    .isPresent();
        }
        return false;
    }

    @Override
    public UserProfileResponseDTO create(UserProfileRequestDTO user) {
        Set<Degree> degrees = user.getDegrees().stream().map(degreeId -> degreeRepository.findById(degreeId)
                .orElseThrow(() -> new EntityNotFoundException("La carrera con id " + degreeId + " no existe")))
                .collect(Collectors.toSet());
        Set<Faculty> faculties = degrees.stream().map(Degree::getFaculties).collect(Collectors.toSet());
        var userProfile = new UserProfile(user.getCif(),
                passwordEncoder.encode(user.getPassword()),
                user.getNames().toUpperCase(),
                user.getSurnames().toUpperCase(),
                user.getEmail().toLowerCase(), user.getRole(),
                user.getType(), degrees, faculties);
        userProfileRepository.save(userProfile);
        return toResponseDTO(userProfile);
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
package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.constants.IDCardStatus;
import org.kmryfv.icortepooproject.constants.UserRole;
import org.kmryfv.icortepooproject.dto.UserProfileResponseDTO;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagement;
import org.kmryfv.icortepooproject.services.interfaces.IFacultyManagement;
import org.kmryfv.icortepooproject.services.interfaces.IStudentManagement;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentManagementImpl implements IStudentManagement {

    @Autowired
    private UserProfileRepository userProfileRepository;

    private final IDegreeManagement degreeManagement;
    private final IFacultyManagement facultyManagement;
    private final IUserService userService;

    public StudentManagementImpl(IDegreeManagement degreeManagement, IFacultyManagement facultyManagement,
                                 IUserService userService){
        this.degreeManagement = degreeManagement;
        this.facultyManagement = facultyManagement;
        this.userService = userService;
    }

    @Override
    public List<UserProfile> getAllStudents() {
        return userProfileRepository.findAll().stream().filter(
                user -> user.getType().equals("Estudiante")).collect(Collectors.toList());
    }

    @Override
    public List<UserProfile> getAllStudentsByDegree(Long id) {
        return userProfileRepository.findAll().stream().filter(
                user -> user.getType().equals("Estudiante")
                        && user.getDegrees().contains(degreeManagement.getEntityById(id))).collect(Collectors.toList()
        );
    }

    @Override
    public List<UserProfile> getAllStudentsByFaculty(Long id) {
        return userProfileRepository.findAll().stream().filter(
                user -> user.getType().equals("Estudiante")
                && user.getFaculties().contains(facultyManagement.getById(id))).collect(Collectors.toList()
        );
    }

    @Override
    public List<UserProfile> getStudentsByIDCardStatus(String status) {
        IDCardStatus parsedStatus;

        try {
            parsedStatus = IDCardStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado inválido: " + status);
        }

        // Assuming each student has at most one IDCard. Adjust if needed.
        return userProfileRepository.findAll().stream()
                .filter(user -> user.getRole().equals(UserRole.STUDENT))
                .filter(user -> user.getIdCards().stream().anyMatch(card -> card.getStatus().equals(parsedStatus)))
                .collect(Collectors.toList());
    }

    @Override
    public UserProfileResponseDTO getStudentByCif(String cif) {
        UserProfile user = userProfileRepository.findById(cif.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Usuario con cif " + cif + " no encontrado"));

        if (!"Estudiante".equals(user.getType())) {
            throw new RuntimeException("El usuario con cif " + cif + " no es un estudiante");
        }

        return userService.toResponseDTO(user);
    }
}
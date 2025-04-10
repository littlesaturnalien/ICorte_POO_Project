package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagement;
import org.kmryfv.icortepooproject.services.interfaces.IFacultyManagement;
import org.kmryfv.icortepooproject.services.interfaces.IStudentManagement;
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

    public StudentManagementImpl(IDegreeManagement degreeManagement, IFacultyManagement facultyManagement){
        this.degreeManagement = degreeManagement;
        this.facultyManagement = facultyManagement;
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
                        && user.getDegrees().contains(degreeManagement.getDegreeById(id))).collect(Collectors.toList()
        );
    }

    @Override
    public List<UserProfile> getAllStudentsByFaculty(Long id) {
        return userProfileRepository.findAll().stream().filter(
                user -> user.getType().equals("Estudiante")
                && user.getFaculties().contains(facultyManagement.getById(id))).collect(Collectors.toList()
        );
    }
}

package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.models.UserProfile;

import java.util.List;

public interface IStudentManagement {
    List<UserProfile> getAllStudents();
    List<UserProfile> getAllStudentsByDegree(Long id);
    List<UserProfile> getAllStudentsByFaculty(Long id);
    List<UserProfile> getStudentsByIDCardStatus(String status);
}

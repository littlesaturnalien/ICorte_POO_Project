package org.kmryfv.icortepooproject.repositories;

import org.kmryfv.icortepooproject.models.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByFacultyName(String facultyName);

    boolean existsByFacultyName(String facultyName);
}
package org.kmryfv.icortepooproject.repositories;

import org.kmryfv.icortepooproject.models.Degree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DegreeRepository extends JpaRepository<Degree, Long> {
    Optional<Degree> findByDegreeName(String degreeName);
    boolean existsByDegreeName(String degreeName);
}
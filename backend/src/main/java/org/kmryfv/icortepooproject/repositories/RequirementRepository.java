package org.kmryfv.icortepooproject.repositories;

import org.kmryfv.icortepooproject.models.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequirementRepository extends JpaRepository<Requirement, Long> {
}
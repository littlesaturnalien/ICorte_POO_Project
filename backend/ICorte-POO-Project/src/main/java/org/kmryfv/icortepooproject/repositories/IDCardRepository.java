package org.kmryfv.icortepooproject.repositories;

import org.kmryfv.icortepooproject.models.IDCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IDCardRepository extends JpaRepository<IDCard, Long> {
}

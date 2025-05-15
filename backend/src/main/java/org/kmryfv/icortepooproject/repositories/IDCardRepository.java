package org.kmryfv.icortepooproject.repositories;

import org.kmryfv.icortepooproject.constants.IDCardStatus;
import org.kmryfv.icortepooproject.models.IDCard;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IDCardRepository extends JpaRepository<IDCard, Long> {
    @Query("SELECT DISTINCT c.user FROM IDCard c WHERE c.status = :status")
    List<UserProfile> findUsersByIDCardStatus(@Param("status") IDCardStatus status);
}
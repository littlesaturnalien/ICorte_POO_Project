package org.kmryfv.icortepooproject.repositories;

import org.kmryfv.icortepooproject.models.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
}
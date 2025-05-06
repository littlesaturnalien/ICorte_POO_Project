package org.kmryfv.icortepooproject.repositories;

import org.kmryfv.icortepooproject.models.Picture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PictureRepository extends JpaRepository<Picture, Long> {
}
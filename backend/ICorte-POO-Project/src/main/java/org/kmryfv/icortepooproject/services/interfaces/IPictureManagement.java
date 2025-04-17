package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.PictureRequestDTO;
import org.kmryfv.icortepooproject.dto.PictureResponseDTO;

import java.util.List;

public interface IPictureManagement {
    PictureResponseDTO create(PictureRequestDTO dto);
    List<PictureResponseDTO> getAll();
    PictureResponseDTO getById(Long id);
    PictureResponseDTO update(Long id, PictureRequestDTO dto);
    void delete(Long id);
}
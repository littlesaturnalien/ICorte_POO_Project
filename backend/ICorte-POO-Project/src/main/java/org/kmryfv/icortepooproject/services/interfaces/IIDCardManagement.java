package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.IDCardRequestDTO;
import org.kmryfv.icortepooproject.dto.IDCardResponseDTO;
import org.kmryfv.icortepooproject.models.IDCard;

import java.util.List;

public interface IIDCardManagement {
    IDCard create(IDCardRequestDTO dto);
    List<IDCard> getAll();
    IDCard getById(Long id);
    IDCardResponseDTO getDetailedById(Long id);
    void updateStatus(Long id, String status);
    void deleteById(Long id);
}
package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.IDCardRequestDTO;
import org.kmryfv.icortepooproject.dto.IDCardResponseDTO;
import org.kmryfv.icortepooproject.models.IDCard;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IIDCardManagement {
    IDCard create(IDCardRequestDTO dto);
    List<IDCard> getAll();
    IDCardResponseDTO getDetailedById(Long id);
    void updateStatus(Long id, String status);
    void updateNotes(Long id, String note);

    void updateDates(Long id, LocalDate issueDate, LocalDateTime deliveryAppointment);
    void deleteById(Long id);
}
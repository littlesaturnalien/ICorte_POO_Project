package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.dto.*;
import org.kmryfv.icortepooproject.models.IDCard;
import org.kmryfv.icortepooproject.services.interfaces.IIDCardManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/idcard")
public class IDCardController {

    private final IIDCardManagement idCardService;

    @Autowired
    public IDCardController(IIDCardManagement idCardService) {
        this.idCardService = idCardService;
    }

    @PostMapping
    public IDCardResponseDTO create(@RequestBody IDCardRequestDTO dto) {
        IDCard created = idCardService.create(dto);
        return idCardService.getDetailedById(created.getIdCardId());
    }

    @GetMapping
    public List<IDCardResponseDTO> getAll() {
        return idCardService.getAll().stream()
                .map(card -> idCardService.getDetailedById(card.getIdCardId()))
                .toList();
    }

    @GetMapping("/{id}")
    public IDCardResponseDTO getById(@PathVariable Long id) {
        return idCardService.getDetailedById(id);
    }

    @PatchMapping("/{id}/status")
    public void changeStatus(@PathVariable Long id, @RequestBody IDCardStatusUpdateDTO dto) {
        idCardService.updateStatus(id, dto.getStatus());
    }

    @PatchMapping("/{id}/addNotes")
    public void addNotes(@PathVariable Long id, @RequestBody IDCardNotesUpdateDTO dto) {
        idCardService.updateNotes(id, dto.getNotes());
    }


    @PatchMapping("/{id}/dates")
    public void updateDates(@PathVariable Long id, @RequestBody IDCardDatesUpdateDTO dto) {
        idCardService.updateDates(id, dto.getIssueDate(), dto.getDeliveryAppointment());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        idCardService.deleteById(id);
    }
}
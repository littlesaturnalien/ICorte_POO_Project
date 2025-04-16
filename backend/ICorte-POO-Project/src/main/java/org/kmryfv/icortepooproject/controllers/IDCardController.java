package org.kmryfv.icortepooproject.controllers;

import org.kmryfv.icortepooproject.dto.IDCardRequestDTO;
import org.kmryfv.icortepooproject.dto.IDCardResponseDTO;
import org.kmryfv.icortepooproject.dto.IDCardStatusUpdateDTO;
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
    public IDCard create(@RequestBody IDCardRequestDTO dto) {
        return idCardService.create(dto);
    }

    @GetMapping
    public List<IDCard> getAll() {
        return idCardService.getAll();
    }

    @GetMapping("/{id}")
    public IDCard getById(@PathVariable Long id) {
        return idCardService.getById(id);
    }

    @PatchMapping("/{id}/status")
    public void changeStatus(@PathVariable Long id, @RequestBody IDCardStatusUpdateDTO dto) {
        idCardService.updateStatus(id, dto.getStatus());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        idCardService.deleteById(id);
    }

    @GetMapping("/{id}/details")
    public IDCardResponseDTO getDetailedCard(@PathVariable Long id) {
        return idCardService.getDetailedById(id);
    }
}
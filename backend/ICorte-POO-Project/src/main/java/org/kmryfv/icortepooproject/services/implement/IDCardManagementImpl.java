package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.constants.IDCardStatus;
import org.kmryfv.icortepooproject.dto.IDCardRequestDTO;
import org.kmryfv.icortepooproject.dto.IDCardResponseDTO;
import org.kmryfv.icortepooproject.models.*;
import org.kmryfv.icortepooproject.repositories.IDCardRepository;
import org.kmryfv.icortepooproject.repositories.RequirementRepository;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IIDCardManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IDCardManagementImpl implements IIDCardManagement {

    private final IDCardRepository idCardRepository;
    private final UserProfileRepository userProfileRepository;
    private final RequirementRepository requirementRepository;

    @Autowired
    public IDCardManagementImpl(IDCardRepository idCardRepository,
                                UserProfileRepository userProfileRepository,
                                RequirementRepository requirementRepository) {
        this.idCardRepository = idCardRepository;
        this.userProfileRepository = userProfileRepository;
        this.requirementRepository = requirementRepository;
    }

    @Override
    public IDCard create(IDCardRequestDTO dto) {
        UserProfile user = userProfileRepository.findById(dto.getCif())
                .orElseThrow(() -> new EntityNotFoundException("Usuario con CIF " + dto.getCif() + " no encontrado"));

        int currentYear = LocalDate.now().getYear();
        if (idCardRepository.existsByUserAndYear(user, currentYear) ) {
            throw new IllegalStateException(
                    "El estudiante con CIF " + user.getCif()
                            + " ya tiene un carnet emitido en el año " + currentYear
            );
        }

        Requirement requirement = requirementRepository.findById(dto.getRequirementId())
                .orElseThrow(() -> new EntityNotFoundException("Requisito con ID " + dto.getRequirementId() + " no encontrado"));

        Degree selectedDegree = user.getDegrees().stream()
                .filter(degree -> degree.getDegreeId().equals(dto.getSelectedDegreeId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("La carrera seleccionada no pertenece al estudiante."));

        IDCard idCard = new IDCard(user, dto.getSemester());
        idCard.setSelectedDegree(selectedDegree);
        idCard.setRequirement(requirement);
        idCard.setDeliveryAppointment(dto.getDeliveryAppointment());
        idCard.setIssueDate(java.time.LocalDate.now()); // You can adjust this logic as needed

        return idCardRepository.save(idCard);
    }

    @Override
    public List<IDCard> getAll() {
        return idCardRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        if (!idCardRepository.existsById(id)) {
            throw new EntityNotFoundException("Carnet con ID " + id + " no encontrado para eliminar");
        }
        idCardRepository.deleteById(id);
    }

    @Override
    public void updateStatus(Long id, String status) {
        IDCard card = idCardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carnet con ID " + id + " no encontrado"));

        try {
            card.setStatus(IDCardStatus.changeStatus(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado inválido: " + status);
        }

        idCardRepository.save(card);
    }

    @Override
    public void updateNotes(Long id, String note) {
        IDCard card = idCardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carnet con ID " + id + " no encontrado"));
        card.setAdditional_notes(note);
        idCardRepository.save(card);
    }

    @Override
    public void updateDates(Long id, LocalDate issue, LocalDateTime delivery) {
        IDCard card = idCardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carnet con ID " + id + " no encontrado"));

        if (issue != null) {
            card.setIssueDate(issue);
        }
        if (delivery != null) {
            card.setDeliveryAppointment(delivery);
        }
        idCardRepository.save(card);
    }


    @Override
    public IDCardResponseDTO getDetailedById(Long id) {
        IDCard card = idCardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carnet con ID " + id + " no encontrado"));

        return mapToDto(card);
    }
    public IDCardResponseDTO mapToDto(IDCard card) {
        IDCardResponseDTO dto = new IDCardResponseDTO();
        dto.setIdCardId(card.getIdCardId());
        dto.setSemester(card.getSemester());
        dto.setYear(card.getYear());
        dto.setIssueDate(card.getIssueDate());
        dto.setExpirationDate(card.getExpirationDate());
        dto.setStatus(card.getStatus().name());
        dto.setDeliveryAppointment(card.getDeliveryAppointment());
        dto.setNotes(card.getAdditional_notes());

        UserProfile user = card.getUser();
        dto.setCif(user.getCif());
        dto.setNames(user.getNames());
        dto.setSurnames(user.getSurnames());

        Degree selected = card.getSelectedDegree();
        if (selected != null) {
            dto.setSelectedDegreeId(selected.getDegreeId());
            dto.setSelectedDegreeName(selected.getDegreeName());
            dto.setSelectedFacultyName(selected.getFaculties().getFacultyName());
        }

        Requirement requirement = card.getRequirement();
        dto.setRequirement_id(requirement.getRequirementId());
        dto.setPayment_proof_url(requirement.getPaymentProofUrl());
        dto.setPhotoAppointment(requirement.getPicture().getPhotoAppointment());
        dto.setPicture_url(requirement.getPicture().getPhotoUrl());

        return dto;
    }
}
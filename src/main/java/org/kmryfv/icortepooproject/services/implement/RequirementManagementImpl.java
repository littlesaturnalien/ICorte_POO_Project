package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.dto.RequirementRequestDTO;
import org.kmryfv.icortepooproject.dto.RequirementResponseDTO;
import org.kmryfv.icortepooproject.models.*;
import org.kmryfv.icortepooproject.repositories.PictureRepository;
import org.kmryfv.icortepooproject.repositories.RequirementRepository;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IRequirementManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequirementManagementImpl implements IRequirementManagement {

    private final RequirementRepository requirementRepository;
    private final UserProfileRepository userProfileRepository;
    private final PictureRepository pictureRepository;

    @Autowired
    public RequirementManagementImpl(
            RequirementRepository requirementRepository,
            UserProfileRepository userProfileRepository,
            PictureRepository pictureRepository
    ) {
        this.requirementRepository = requirementRepository;
        this.userProfileRepository = userProfileRepository;
        this.pictureRepository = pictureRepository;
    }

    @Override
    public RequirementResponseDTO create(RequirementRequestDTO dto) {
        UserProfile user = userProfileRepository.findById(dto.getCif())
                .orElseThrow(() -> new EntityNotFoundException("Usuario con CIF " + dto.getCif() + " no encontrado"));

        Picture picture = pictureRepository.findById(dto.getPictureId())
                .orElseThrow(() -> new EntityNotFoundException("Foto con ID " + dto.getPictureId() + " no encontrada"));

        Requirement requirement = new Requirement();
        requirement.setUser(user);
        requirement.setPaymentProofUrl(dto.getPaymentProofUrl());

        requirement.setPicture(picture);
        picture.setRequirement(requirement);

        return toDto(requirementRepository.save(requirement));
    }

    @Override
    public List<RequirementResponseDTO> getAll() {
        return requirementRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public RequirementResponseDTO getById(Long id) {
        Requirement req = requirementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Requisito con ID " + id + " no encontrado"));
        return toDto(req);
    }

    @Override
    public RequirementResponseDTO update(Long id, RequirementRequestDTO dto) {
        Requirement req = requirementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Requisito con ID " + id + " no encontrado"));

        if (dto.getCif() != null) {
            UserProfile user = userProfileRepository.findById(dto.getCif())
                    .orElseThrow(() -> new EntityNotFoundException("Usuario con CIF " + dto.getCif() + " no encontrado"));
            req.setUser(user);
        }

        if (dto.getPictureId() != null) {
            Picture picture = pictureRepository.findById(dto.getPictureId())
                    .orElseThrow(() -> new EntityNotFoundException("Foto con ID " + dto.getPictureId() + " no encontrada"));

            req.setPicture(picture);
            picture.setRequirement(req);
        }

        if (dto.getPaymentProofUrl() != null) {
            req.setPaymentProofUrl(dto.getPaymentProofUrl());
        }

        return toDto(requirementRepository.save(req));
    }

    @Override
    public void delete(Long id) {
        if (!requirementRepository.existsById(id)) {
            throw new EntityNotFoundException("No existe requisito con ID " + id);
        }
        requirementRepository.deleteById(id);
    }

    private RequirementResponseDTO toDto(Requirement r) {
        RequirementResponseDTO dto = new RequirementResponseDTO();
        dto.setRequirementId(r.getRequirementId());
        dto.setCif(r.getUser().getCif());
        dto.setUserName(r.getUser().getNames() + " " + r.getUser().getSurnames());
        dto.setPaymentProofUrl(r.getPaymentProofUrl());

        if (r.getPicture() != null) {
            dto.setPictureId(r.getPicture().getPictureId());
            dto.setPictureUrl(r.getPicture().getPhotoUrl());
        }

        return dto;
    }
}
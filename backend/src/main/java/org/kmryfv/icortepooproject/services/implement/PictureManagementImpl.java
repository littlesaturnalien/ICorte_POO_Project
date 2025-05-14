package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.dto.PictureRequestDTO;
import org.kmryfv.icortepooproject.dto.PictureResponseDTO;
import org.kmryfv.icortepooproject.models.Picture;
import org.kmryfv.icortepooproject.repositories.PictureRepository;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.kmryfv.icortepooproject.services.interfaces.IPictureManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PictureManagementImpl implements IPictureManagement {
    private final PictureRepository pictureRepository;
    private final UserProfileRepository userProfileRepository;

    @Autowired
    public PictureManagementImpl(PictureRepository pictureRepository, UserProfileRepository userProfileRepository) {
        this.pictureRepository = pictureRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public PictureResponseDTO create(PictureRequestDTO dto) {
        var student = userProfileRepository.findById(dto.getCif()).orElseThrow(() -> new EntityNotFoundException("Estudiante no encontrado"));
        Picture picture = new Picture();
        picture.setUser(student);
        if (dto.getPhotoAppointment() != null && dto.getPhotoAppointment().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La fecha para la toma de foto no puede ser anterior a la fecha actual.");
        }
        picture.setPhotoAppointment(dto.getPhotoAppointment());
        picture.setPhotoUrl(dto.getPhotoUrl());

        return toDto(pictureRepository.save(picture));
    }

    @Override
    public List<PictureResponseDTO> getAll() {
        return pictureRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PictureResponseDTO getById(Long id) {
        Picture picture = pictureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Foto con ID " + id + " no encontrada"));
        return toDto(picture);
    }

    @Override
    public PictureResponseDTO update(Long id, PictureRequestDTO dto) {
        Picture picture = pictureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Foto con ID " + id + " no encontrada"));

        if (dto.getPhotoAppointment() != null && dto.getPhotoAppointment().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La fecha para la toma de foto no puede ser anterior a la fecha actual.");
        }
        picture.setPhotoAppointment(dto.getPhotoAppointment());
        picture.setPhotoUrl(dto.getPhotoUrl());

        return toDto(pictureRepository.save(picture));
    }

    @Override
    public void delete(Long id) {
        if (!pictureRepository.existsById(id)) {
            throw new EntityNotFoundException("No existe la foto con ID " + id);
        }
        pictureRepository.deleteById(id);
    }

    private PictureResponseDTO toDto(Picture picture) {
        PictureResponseDTO dto = new PictureResponseDTO();
        dto.setPictureId(picture.getPictureId());
        dto.setCif(picture.getUser().getCif());
        dto.setName(picture.getUser().getNames() + " " + picture.getUser().getSurnames());
        dto.setPhotoAppointment(picture.getPhotoAppointment());
        dto.setPhotoUrl(picture.getPhotoUrl());
        return dto;
    }
}
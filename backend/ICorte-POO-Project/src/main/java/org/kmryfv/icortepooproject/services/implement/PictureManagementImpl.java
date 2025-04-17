package org.kmryfv.icortepooproject.services.implement;

import jakarta.persistence.EntityNotFoundException;
import org.kmryfv.icortepooproject.dto.PictureRequestDTO;
import org.kmryfv.icortepooproject.dto.PictureResponseDTO;
import org.kmryfv.icortepooproject.models.Picture;
import org.kmryfv.icortepooproject.repositories.PictureRepository;
import org.kmryfv.icortepooproject.services.interfaces.IPictureManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PictureManagementImpl implements IPictureManagement {
    private final PictureRepository pictureRepository;

    @Autowired
    public PictureManagementImpl(PictureRepository pictureRepository) {
        this.pictureRepository = pictureRepository;
    }

    @Override
    public PictureResponseDTO create(PictureRequestDTO dto) {
        Picture picture = new Picture();
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
        dto.setPhotoAppointment(picture.getPhotoAppointment());
        dto.setPhotoUrl(picture.getPhotoUrl());
        return dto;
    }
}
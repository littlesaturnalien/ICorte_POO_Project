package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.RequirementRequestDTO;
import org.kmryfv.icortepooproject.dto.RequirementResponseDTO;

import java.util.List;

public interface IRequirementManagement {

    RequirementResponseDTO create(RequirementRequestDTO dto);

    List<RequirementResponseDTO> getAll();

    RequirementResponseDTO getById(Long id);

    RequirementResponseDTO update(Long id, RequirementRequestDTO dto);

    void delete(Long id);
}
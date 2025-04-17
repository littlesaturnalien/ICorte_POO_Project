package org.kmryfv.icortepooproject.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequirementResponseDTO {
    private Long requirementId;
    private String cif;
    private String userName;
    private String paymentProofUrl;
    private Long pictureId;
    private String pictureUrl;
}
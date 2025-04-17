package org.kmryfv.icortepooproject.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequirementRequestDTO {
    private String cif;
    private String paymentProofUrl;
    private Long pictureId;
}
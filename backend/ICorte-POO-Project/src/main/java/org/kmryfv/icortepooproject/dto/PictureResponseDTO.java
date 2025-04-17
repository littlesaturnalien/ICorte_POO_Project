package org.kmryfv.icortepooproject.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PictureResponseDTO {
    private Long pictureId;
    private LocalDateTime photoAppointment;
    private String photoUrl;
}
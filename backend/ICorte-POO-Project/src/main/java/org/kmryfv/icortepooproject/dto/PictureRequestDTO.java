package org.kmryfv.icortepooproject.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PictureRequestDTO {
    private LocalDateTime photoAppointment;
    private String photoUrl;
}
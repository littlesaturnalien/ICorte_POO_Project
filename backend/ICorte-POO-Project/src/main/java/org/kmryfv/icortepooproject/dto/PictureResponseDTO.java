package org.kmryfv.icortepooproject.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
public class PictureResponseDTO {
    private Long pictureId;
    private String cif;
    private String name;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime photoAppointment;
    private String photoUrl;
}
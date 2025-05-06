package org.kmryfv.icortepooproject.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
public class IDCardDatesUpdateDTO {

    /** Formato ISO (yyyy‑MM‑dd) o vacío para no cambiar */
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate issueDate;

    /** Patrón dd‑MM‑yyyy HH:mm  (igual que en tu RequestDTO) */
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime deliveryAppointment;
}
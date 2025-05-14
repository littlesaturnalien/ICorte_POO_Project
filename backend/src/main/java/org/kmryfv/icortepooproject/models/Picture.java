package org.kmryfv.icortepooproject.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "Foto")
@Getter
@Setter
@NoArgsConstructor
public class Picture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pictureId;

    @ManyToOne
    @JoinColumn(name = "cif", nullable = false)
    private UserProfile user;

    @Column(name = "toma_de_foto", unique = true)
    private LocalDateTime photoAppointment;

    @Column(name = "url_foto")
    private String photoUrl;

    @OneToOne(mappedBy = "picture")
    private Requirement requirement;
}
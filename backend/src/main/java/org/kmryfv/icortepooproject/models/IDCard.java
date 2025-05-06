package org.kmryfv.icortepooproject.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.kmryfv.icortepooproject.constants.IDCardStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Carnet")
@Getter
@Setter @NoArgsConstructor
public class IDCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "carnet_id")
    private Long idCardId;

    @ManyToOne
    @JoinColumn(name = "cif", nullable = false)
    private UserProfile user;

    @Column(name = "semestre", nullable = false)
    private String semester;

    @Column(name = "año", nullable = false)
    private int year = LocalDate.now().getYear();

    @Column(name = "fecha_emisión")
    private LocalDate issueDate;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate expirationDate;

    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    private IDCardStatus status;

    @Column(name = "fecha_entrega")
    private LocalDateTime deliveryAppointment;

    @OneToOne
    @JoinColumn(name = "requisito_id", nullable = false)
    private Requirement requirement;

    @ManyToOne
    @JoinColumn(name = "degree_id", nullable = false)
    private Degree selectedDegree;

    @Column(name = "observaciones")
    private String additional_notes;

    public IDCard(UserProfile user, String semester) {
        this.user = user;
        this.semester = semester;
        this.status = IDCardStatus.PENDING;
        this.setExpirationByYear();
    }

    private void setExpirationByYear() {
        int expirationYear = LocalDate.now().getYear();
        this.expirationDate = LocalDate.of(expirationYear, 12, 31);
    }
}
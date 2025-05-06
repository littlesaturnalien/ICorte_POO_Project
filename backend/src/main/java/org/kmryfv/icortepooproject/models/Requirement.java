package org.kmryfv.icortepooproject.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Requisito")
@Getter
@Setter @NoArgsConstructor
@AllArgsConstructor @ToString
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requisito_id")
    private Long requirementId;

    @ManyToOne
    @JoinColumn(name = "cif", nullable = false)
    private UserProfile user;

    @Column(name = "comprobante_pago_url", nullable = false)
    private String paymentProofUrl;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "foto_id")
    private Picture picture;

    @OneToOne(mappedBy = "requirement")
    private IDCard idCard;
}
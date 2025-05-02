package org.kmryfv.icortepooproject.models;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class BaseUserCredentials {
    @Id
    @Column(name = "cif", nullable = false, updatable = false)
    private String cif;

    @Column(name = "contraseña")
    private String password;

    public BaseUserCredentials(String cif) {
        this.cif = cif;
    }

    public BaseUserCredentials(String cif, String password) {
        this.cif = cif;
        this.password = password;
    }
}

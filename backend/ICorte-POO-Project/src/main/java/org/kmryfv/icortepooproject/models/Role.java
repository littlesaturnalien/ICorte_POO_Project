package org.kmryfv.icortepooproject.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Rol")
@Getter @Setter
public class Role {
    @Id
    private Long roleId;
    private String roleType;
}

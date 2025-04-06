package org.kmryfv.icortepooproject.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Usuario")
@Getter @Setter

public class User {
    @Id
    private String userId;

    private String username;
    private String password;
}

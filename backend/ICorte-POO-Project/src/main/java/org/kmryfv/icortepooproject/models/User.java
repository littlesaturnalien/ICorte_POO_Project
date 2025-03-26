package org.kmryfv.icortepooproject.models;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {
    String cif;
    String password;
}

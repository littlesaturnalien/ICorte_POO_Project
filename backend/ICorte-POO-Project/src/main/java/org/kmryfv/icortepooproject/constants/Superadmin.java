package org.kmryfv.icortepooproject.constants;

import org.kmryfv.icortepooproject.models.UserProfile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Superadmin {
    public static final String SUPERADMIN_CIF = "23010471";
    public static final String SUPERADMIN_PIN = "234418";
    public static final String SUPERADMIN_NAME = "KAREN MARIZA ROSA YOLANDA";
    public static final String SUPERADMIN_SURNANME = "FONSECA VEGA";
    public static final String SUPERADMIN_EMAIl = "kmryfonseca@uamv.edu.ni";
    public static final String SUPERADMIN_TYPE = "Estudiante";

    public static final String SUPERADMIN_PASSWORD_HASH =
            new BCryptPasswordEncoder().encode(SUPERADMIN_PIN);

    public static UserProfile superAdmin = new UserProfile(SUPERADMIN_CIF, SUPERADMIN_PASSWORD_HASH,
            SUPERADMIN_NAME, SUPERADMIN_SURNANME, SUPERADMIN_EMAIl, UserRole.SUPERADMIN,
                SUPERADMIN_TYPE);
}
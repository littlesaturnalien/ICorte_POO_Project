package org.kmryfv.icortepooproject.constants;

import org.kmryfv.icortepooproject.models.UserProfile;

public class Superadmin2 {
    public static final String SUPERADMIN2_CIF = "18010053";
    public static final String SUPERADMIN2_NAME = "SILVIO ALEJANDRO";
    public static final String SUPERADMIN2_SURNANME = "MORA MENDOZA";
    public static final String SUPERADMIN2_EMAIl = "samora@uamv.edu.ni";
    public static final String SUPERADMIN2_TYPE = "Estudiante";
    public static UserProfile superAdmin = new UserProfile(SUPERADMIN2_CIF, SUPERADMIN2_NAME,
                SUPERADMIN2_SURNANME, SUPERADMIN2_EMAIl, UserRole.SUPERADMIN,
                SUPERADMIN2_TYPE);
}

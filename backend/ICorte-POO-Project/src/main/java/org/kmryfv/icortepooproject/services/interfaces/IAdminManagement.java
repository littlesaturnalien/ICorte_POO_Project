package org.kmryfv.icortepooproject.services.interfaces;


import org.kmryfv.icortepooproject.models.UserProfile;

import java.util.List;

public interface IAdminManagement {
    void promoteToAdmin(String targetCif);
    void revokeAdminRole(String targetCif);
    boolean canManageRoles(String cif);
    List<UserProfile> getAllAdmins();
}
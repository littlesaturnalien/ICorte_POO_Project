package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.UserRole;

import java.util.Map;

public interface IRolePersistence {
    void saveRoles(Map<String, UserRole> roleMap, Map<String, Boolean> approvalMap);
    Map<String, UserRole> loadRoles();
    Map<String, Boolean> loadApprovals();
}

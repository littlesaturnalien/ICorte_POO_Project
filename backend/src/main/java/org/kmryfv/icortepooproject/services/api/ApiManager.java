package org.kmryfv.icortepooproject.services.api;

import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.services.interfaces.IRoleAssignment;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApiManager {
    private final IApiUAM api;
    private final IRoleAssignment roleAssignment;

    public ApiManager(IApiUAM api, IRoleAssignment roleAssignment){
        this.api = api;
        this.roleAssignment = roleAssignment;
    }

    public List<UserDataDTO> userAuthenticationManager(String cif, String pin) {
        String token = api.getAuthToken(cif, pin);
        List<UserDataDTO> userData = api.authenticateUser(cif, token);
        return roleAssignment.assignRoles(userData);
    }
}
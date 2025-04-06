package org.kmryfv.icortepooproject.services.api;

import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApiManager {
    private final IApiUAM api;

    public ApiManager(IApiUAM api){
        this.api = api;
    }

    public List<UserDataDTO> userAuthenticationManager(String cif, String pin) {
        String token = api.getAuthToken(cif, pin);
        return api.authenticateUser(cif, token);
    }
}

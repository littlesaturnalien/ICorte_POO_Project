package org.kmryfv.icortepooproject.services.api;

import org.kmryfv.icortepooproject.dto.UserDataDTO;

import java.util.List;

public interface IApiUAM {
    String getAuthToken(String cif, String pin);
    List<UserDataDTO> authenticateUser(String cif, String token);
}

package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
import org.kmryfv.icortepooproject.dto.UserDataDTO;

import java.util.List;

public interface IUserService {
    List<UserDataDTO> authenticate(LoginRequestDTO loginRequest);
}

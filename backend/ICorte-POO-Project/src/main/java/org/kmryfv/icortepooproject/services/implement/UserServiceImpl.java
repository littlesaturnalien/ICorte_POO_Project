package org.kmryfv.icortepooproject.services.implement;

import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.kmryfv.icortepooproject.services.api.ApiManager;
import org.kmryfv.icortepooproject.services.api.ApiUAM;
import org.kmryfv.icortepooproject.services.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements IUserService {
    private final ApiManager api;

    @Autowired
    public UserServiceImpl(ApiManager api) {
        this.api = api;
    }

    @Override
    public List<UserDataDTO> authenticate(LoginRequestDTO loginRequest) {
        String cif = loginRequest.getCif();
        String password = loginRequest.getPassword();
        return api.userAuthenticationManager(cif, password);
    }
}

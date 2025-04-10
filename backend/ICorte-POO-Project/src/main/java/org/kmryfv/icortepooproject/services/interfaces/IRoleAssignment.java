package org.kmryfv.icortepooproject.services.interfaces;

import org.kmryfv.icortepooproject.dto.UserDataDTO;

import java.util.List;

public interface IRoleAssignment {
    List<UserDataDTO> assignRoles(List<UserDataDTO> userDataList);
}

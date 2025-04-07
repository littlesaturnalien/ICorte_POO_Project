package org.kmryfv.icortepooproject.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@ToString @EqualsAndHashCode
@Getter @Setter
@AllArgsConstructor
public class ResponseApiDTO {
    @JsonProperty("success")
    private boolean successOrNot;

    @JsonProperty("message")
    private String message;

    @JsonProperty("data")
    private List<UserDataDTO> userDataList;
}

package org.kmryfv.icortepooproject.services.api;

import org.kmryfv.icortepooproject.dto.LoginRequestDTO;
import org.kmryfv.icortepooproject.dto.ResponseApiDTO;
import org.kmryfv.icortepooproject.dto.UserDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ApiUAM implements IApiUAM {

    @Value("${uam.api.url}")
    private String baseURL;

    private RestTemplate createTimeoutRestTemplate() {
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(3000);
        return new RestTemplate(factory);
    }

    @Override
    public String getAuthToken(String cif, String pin) {
        try { //The URL has changed
            String loginUrl = baseURL + "login";
            LoginRequestDTO request = new LoginRequestDTO(cif, pin);

            // Creating headers
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            headers.add("X-Uam-Secure-Api", "version-1.0");

            HttpEntity<LoginRequestDTO> entity = new HttpEntity<>(request, headers); // Combine the request headers and body into an HttpEntity object

            RestTemplate restTemplate = createTimeoutRestTemplate();
            ResponseEntity<String> loginResponse = restTemplate.exchange(loginUrl, HttpMethod.POST, entity, String.class); // Will send the request (As POST) to the login endpoint

            if (!loginResponse.getStatusCode().is2xxSuccessful()) { // If the response isn't Successful then throw an Exception with some details
                throw new RuntimeException("Error Trying to Log-In | " + loginResponse.getStatusCode() + " | " + loginResponse.getBody());
            }
            // The response will give us a Token so we have to prepared to get it
            return loginResponse.getBody(); // Receiving the token
        } catch (Exception e) {
            throw new RuntimeException("Error obtaining the token: " + e.getMessage());
        }
    }

    @Override
    public List<UserDataDTO> authenticateUser(String cif, String token) {
        try {
            // Now we will get the data of the user, the url has changed again
            String dataUrl = baseURL + "GetStudentInformation?cif=" + cif;

            HttpHeaders headers = new HttpHeaders();
            headers.add("Accept", "application/json");
            headers.add("Content-Type", "application/json");
            headers.add("X-Uam-Secure-Api", "version-1.0");
            headers.add("Authorization", "Bearer " + token);
                                // Preparing the token in Bearer format, will be necessary to the next request
                                // Bearer means that the client of that Token is authorized of making a protected request

            // Creating a new HttpEntity with the new headers (A GET Request doesn't have a body, that's why its void)
            HttpEntity<Void> dataEntity = new HttpEntity<>(headers);

            // Send the request as GET
            RestTemplate restTemplate = createTimeoutRestTemplate();
            ResponseEntity<ResponseApiDTO> dataResponse = restTemplate.exchange(dataUrl, HttpMethod.GET, dataEntity, ResponseApiDTO.class);

            // If the response isn't Successful then throw an Exception with some details
            if (!dataResponse.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Error trying to get User Data: " + dataResponse.getStatusCode());
            }
            // GET the body of the response (user data)
            ResponseApiDTO apiResponse = dataResponse.getBody();
            // If the response was successful and was data then
            if (apiResponse != null && apiResponse.isSuccessOrNot() && !apiResponse.getUserDataList().isEmpty()) {
                return apiResponse.getUserDataList(); // Return the StudentDataList
            } else {
                throw new RuntimeException("Error getting User Data: " + (apiResponse != null ? apiResponse.getMessage() : "Empty Response"));
            } // else we throw an exception, the api response wasn't successful or the Response was empty

        } catch (Exception e) { // if there was an error not handled, we handle here (kinda general)
            throw new RuntimeException("Not Valid Access - Please Try Again | " + e.getMessage());
        }
    }
}
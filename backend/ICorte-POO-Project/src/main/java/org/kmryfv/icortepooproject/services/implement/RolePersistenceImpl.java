package org.kmryfv.icortepooproject.services.implement;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.kmryfv.icortepooproject.dto.UserRole;
import org.kmryfv.icortepooproject.services.interfaces.IRolePersistence;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class RolePersistenceImpl implements IRolePersistence {
    private static final String ROLES_FILE = "roles.json";
    private final ObjectMapper objectMapper;

    public RolePersistenceImpl() {
        this.objectMapper = new ObjectMapper();
        // Habilitar formato legible con saltos de línea y sangrías
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }
    @Override
    public void saveRoles(Map<String, UserRole> roleMap, Map<String, Boolean> approvalMap) {
        try {
            Map<String, Object> combinedData = new HashMap<>();
            combinedData.put("roles", roleMap);
            combinedData.put("approvals", approvalMap);
            objectMapper.writeValue(new File(ROLES_FILE), combinedData);
        } catch (IOException e) {
            System.err.println("Error al guardar roles en el archivo: " + e.getMessage());
            throw new RuntimeException("No se pudo guardar los roles", e);
        }
    }

    @Override
    public Map<String, UserRole> loadRoles() {
        File file = new File(ROLES_FILE);
        if (file.exists()) {
            try {
                // Leer el archivo JSON como un mapa genérico
                Map<String, Object> combinedData = objectMapper.readValue(file, new TypeReference<Map<String, Object>>() {});
                @SuppressWarnings("unchecked")
                Map<String, String> rawRoles = (Map<String, String>) combinedData.get("roles");

                // Convertir las cadenas a UserRole
                Map<String, UserRole> loadedRoles = new HashMap<>();
                if (rawRoles != null) {
                    for (Map.Entry<String, String> entry : rawRoles.entrySet()) {
                        loadedRoles.put(entry.getKey(), UserRole.valueOf(entry.getValue()));
                    }
                }
                return loadedRoles;
            } catch (IOException | IllegalArgumentException e) {
                System.err.println("Error al cargar roles desde el archivo: " + e.getMessage());
                return new HashMap<>();
            }
        }
        return new HashMap<>();
    }

    @Override
    public Map<String, Boolean> loadApprovals() {
        File file = new File(ROLES_FILE);
        if (file.exists()) {
            try {
                Map<String, Object> combinedData = objectMapper.readValue(file, new TypeReference<Map<String, Object>>() {});
                @SuppressWarnings("unchecked")
                Map<String, Boolean> loadedApprovals = (Map<String, Boolean>) combinedData.get("approvals");
                return loadedApprovals != null ? loadedApprovals : new HashMap<>();
            } catch (IOException e) {
                System.err.println("Error al cargar aprobaciones desde el archivo: " + e.getMessage());
                return new HashMap<>();
            }
        }
        return new HashMap<>();
    }
}

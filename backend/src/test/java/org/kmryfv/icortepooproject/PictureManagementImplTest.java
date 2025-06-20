package org.kmryfv.icortepooproject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.kmryfv.icortepooproject.constants.UserRole;
import org.kmryfv.icortepooproject.dto.PictureRequestDTO;
import org.kmryfv.icortepooproject.dto.PictureResponseDTO;
import org.kmryfv.icortepooproject.models.Picture;
import org.kmryfv.icortepooproject.models.UserProfile;
import org.kmryfv.icortepooproject.services.implement.PictureManagementImpl;
import org.kmryfv.icortepooproject.repositories.PictureRepository;
import org.kmryfv.icortepooproject.repositories.UserProfileRepository;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para PictureManagementImpl.
 * Verifican la creación, actualización y eliminación de fotos.
 */
public class PictureManagementImplTest {

    @Mock
    private PictureRepository pictureRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private PictureManagementImpl pictureManagement;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Test para verificar la creación de una foto con una cita en el pasado (debería fallar).
     * Este test verifica que el método 'create' lance una IllegalArgumentException si la cita de la foto está en el pasado.
     */
    @Test
    void testCreatePictureWithPastAppointment() {
        // Se configura el DTO de solicitud con una cita en el pasado.
        PictureRequestDTO request = new PictureRequestDTO();
        request.setCif("12345");
        request.setPhotoAppointment(LocalDateTime.now().minusDays(1));  // Cita en el pasado
        request.setPhotoUrl("http://photo.com/photo-past.jpg");

        // Simula la existencia del perfil del estudiante en la base de datos.
        UserProfile mockUserProfile = new UserProfile("12345", "John", "Doe", "someOtherArg", UserRole.STUDENT, "someOtherField");
        when(userProfileRepository.findById("12345")).thenReturn(java.util.Optional.of(mockUserProfile));

        // Se espera que se lance una IllegalArgumentException debido a la cita en el pasado.
        assertThrows(IllegalArgumentException.class, () -> pictureManagement.create(request));
    }

    /**
     * Test para verificar la creación de una foto con una cita válida.
     * Este test verifica que el método 'create' funcione correctamente si la cita está en el futuro.
     */
    @Test
    void testCreatePictureWithValidAppointment() {
        // Se configura el DTO de solicitud con una cita en el futuro.
        PictureRequestDTO request = new PictureRequestDTO();
        request.setCif("18010053");
        request.setPhotoAppointment(LocalDateTime.now().plusDays(1));  // Cita en el futuro
        request.setPhotoUrl("http://photo.com/photo-future.jpg");

        // Simula la existencia del perfil del estudiante en la base de datos.
        UserProfile mockUserProfile = new UserProfile("18010053", "Jane", "Doe", "someOtherArg", UserRole.STUDENT, "someOtherField");
        when(userProfileRepository.findById("18010053")).thenReturn(java.util.Optional.of(mockUserProfile));

        // Simula la respuesta esperada para PictureResponseDTO.
        PictureResponseDTO response = new PictureResponseDTO();
        response.setPictureId(1L);
        response.setCif("18010053");
        response.setPhotoAppointment(request.getPhotoAppointment());
        response.setPhotoUrl(request.getPhotoUrl());

        // Se simula que el método 'save' del repositorio devuelve un objeto Picture.
        when(pictureRepository.save(any())).thenReturn(new Picture());

        // Llamada al método 'create' del servicio.
        PictureResponseDTO createdPicture = pictureManagement.create(request);

        // Verificaciones:
        assertNotNull(createdPicture);  // Verifica que el resultado no sea nulo.
        assertEquals("18010053", createdPicture.getCif());  // Verifica que el CIF sea el esperado.
        verify(pictureRepository, times(1)).save(any());  // Verifica que el método 'save' fue llamado una vez.
    }
}
package org.kmryfv.icortepooproject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.kmryfv.icortepooproject.controllers.PictureController;
import org.kmryfv.icortepooproject.dto.PictureRequestDTO;
import org.kmryfv.icortepooproject.dto.PictureResponseDTO;
import org.kmryfv.icortepooproject.services.interfaces.IPictureManagement;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para el controlador PictureController.
 * Se utiliza JUnit 5 y Mockito para simular las dependencias del controlador.
 */
public class PictureControllerTest {

    @Mock
    private IPictureManagement pictureService;

    @InjectMocks
    private PictureController pictureController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Test para el método create de PictureController.
     * Verifica que el controlador pueda crear una foto correctamente.
     */
    @Test
    void testCreatePicture() {
        PictureRequestDTO request = new PictureRequestDTO();
        request.setCif("12345");
        request.setPhotoAppointment(LocalDateTime.now().plusDays(1));
        request.setPhotoUrl("http://photo.com/photo.jpg");

        PictureResponseDTO response = new PictureResponseDTO();
        response.setPictureId(1L);
        response.setCif("12345");
        response.setPhotoAppointment(request.getPhotoAppointment());
        response.setPhotoUrl(request.getPhotoUrl());

        when(pictureService.create(request)).thenReturn(response);

        ResponseEntity<PictureResponseDTO> createdPicture = pictureController.create(request);

        assertNotNull(createdPicture);
        assertEquals(1L, createdPicture.getBody().getPictureId());
        assertEquals("12345", createdPicture.getBody().getCif());
        verify(pictureService, times(1)).create(request);
    }

    /**
     * Test para el método getAll de PictureController.
     * Verifica que el controlador devuelva correctamente todas las fotos.
     */
    @Test
    void testGetAllPictures() {
        PictureResponseDTO picture1 = new PictureResponseDTO();
        picture1.setPictureId(1L);
        picture1.setCif("12345");
        picture1.setPhotoAppointment(LocalDateTime.now().plusDays(1));
        picture1.setPhotoUrl("http://photo.com/photo1.jpg");

        PictureResponseDTO picture2 = new PictureResponseDTO();
        picture2.setPictureId(2L);
        picture2.setCif("67890");
        picture2.setPhotoAppointment(LocalDateTime.now().plusDays(2));
        picture2.setPhotoUrl("http://photo.com/photo2.jpg");

        when(pictureService.getAll()).thenReturn(Arrays.asList(picture1, picture2));

        ResponseEntity<List<PictureResponseDTO>> allPictures = pictureController.getAll();

        assertNotNull(allPictures);
        assertEquals(2, allPictures.getBody().size());
        verify(pictureService, times(1)).getAll();
    }

    /**
     * Test para el método getById de PictureController.
     * Verifica que el controlador devuelva correctamente una foto por ID.
     */
    @Test
    void testGetPictureById() {
        PictureResponseDTO picture = new PictureResponseDTO();
        picture.setPictureId(1L);
        picture.setCif("12345");
        picture.setPhotoAppointment(LocalDateTime.now().plusDays(1));
        picture.setPhotoUrl("http://photo.com/photo1.jpg");

        when(pictureService.getById(1L)).thenReturn(picture);

        ResponseEntity<PictureResponseDTO> foundPicture = pictureController.getById(1L);

        assertNotNull(foundPicture);
        assertEquals(1L, foundPicture.getBody().getPictureId());
        verify(pictureService, times(1)).getById(1L);
    }

    /**
     * Test para el método update de PictureController.
     * Verifica que el controlador pueda actualizar una foto correctamente.
     */
    @Test
    void testUpdatePicture() {
        PictureRequestDTO request = new PictureRequestDTO();
        request.setCif("12345");
        request.setPhotoAppointment(LocalDateTime.now().plusDays(2));
        request.setPhotoUrl("http://photo.com/photo-updated.jpg");

        PictureResponseDTO response = new PictureResponseDTO();
        response.setPictureId(1L);
        response.setCif("12345");
        response.setPhotoAppointment(request.getPhotoAppointment());
        response.setPhotoUrl(request.getPhotoUrl());

        when(pictureService.update(1L, request)).thenReturn(response);

        ResponseEntity<PictureResponseDTO> updatedPicture = pictureController.update(1L, request);

        assertNotNull(updatedPicture);
        assertEquals("http://photo.com/photo-updated.jpg", updatedPicture.getBody().getPhotoUrl());
        verify(pictureService, times(1)).update(1L, request);
    }

    /**
     * Test para el método delete de PictureController.
     * Verifica que el controlador elimine correctamente una foto por ID.
     */
    @Test
    void testDeletePicture() {
        doNothing().when(pictureService).delete(1L);

        ResponseEntity<?> response = pictureController.delete(1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(pictureService, times(1)).delete(1L);
    }
}
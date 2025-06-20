package org.kmryfv.icortepooproject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.kmryfv.icortepooproject.controllers.DegreeController;
import org.kmryfv.icortepooproject.dto.DegreeRequestDTO;
import org.kmryfv.icortepooproject.dto.DegreeResponseDTO;
import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagement;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Clase de pruebas unitarias para el controlador DegreeController.
 * Se utiliza JUnit 5 y Mockito para simular las dependencias y verificar el comportamiento del controlador.
 */
public class DegreeControllerTest {

    // Se utiliza @Mock para crear un mock del servicio IDegreeManagement.
    @Mock
    private IDegreeManagement degreeService;

    // Se utiliza @InjectMocks para inyectar el mock en el controlador que vamos a probar.
    @InjectMocks
    private DegreeController degreeController;

    /**
     * Este método se ejecuta antes de cada prueba. Inicializa los mocks de Mockito.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);  // Inicializa los mocks antes de cada prueba.
    }

    /**
     * Test para el método getDegrees del controlador DegreeController.
     * Verifica que el controlador devuelva correctamente una lista de grados.
     */
    @Test
    void testGetDegrees() {
        // Simula dos grados para el servicio.
        DegreeResponseDTO degree1 = new DegreeResponseDTO(1L, "Computer Science", "Engineering");
        DegreeResponseDTO degree2 = new DegreeResponseDTO(2L, "Software Engineering", "Engineering");

        // Se simula la respuesta del servicio para que devuelva una lista con los dos grados.
        when(degreeService.getAll()).thenReturn(Arrays.asList(degree1, degree2));

        // Llamada al controlador para obtener la lista de grados.
        List<DegreeResponseDTO> degrees = degreeController.getDegrees();

        // Verificación de que la lista devuelta no es nula.
        assertNotNull(degrees);
        // Verifica que el tamaño de la lista es 2 (ya que simulamos 2 grados).
        assertEquals(2, degrees.size());
        // Verifica que el servicio getAll fue llamado exactamente una vez.
        verify(degreeService, times(1)).getAll();
    }

    /**
     * Test para el método createDegree del controlador DegreeController.
     * Verifica que el controlador pueda crear un grado correctamente.
     */
    @Test
    void testCreateDegree() {
        // Crea un DTO de solicitud con los datos del nuevo grado.
        DegreeRequestDTO request = new DegreeRequestDTO();
        request.setDegreeName("Information Systems");
        request.setFacultyId(1L);

        // Simula la respuesta del servicio al crear un nuevo grado.
        DegreeResponseDTO response = new DegreeResponseDTO(3L, "Information Systems", "Engineering");
        when(degreeService.save(request)).thenReturn(response);

        // Llamada al controlador para crear el nuevo grado.
        DegreeResponseDTO createdDegree = degreeController.createDegree(request);

        // Verifica que el grado creado no es nulo.
        assertNotNull(createdDegree);
        // Verifica que el nombre del grado es "Information Systems".
        assertEquals("Information Systems", createdDegree.getDegreeName());
        // Verifica que el servicio save fue llamado exactamente una vez.
        verify(degreeService, times(1)).save(request);
    }

    /**
     * Test para el método getDegreeById del controlador DegreeController.
     * Verifica que el controlador pueda recuperar un grado por su ID correctamente.
     */
    @Test
    void testGetDegreeById() {
        // Simula la respuesta del servicio al buscar un grado por su ID.
        DegreeResponseDTO degree = new DegreeResponseDTO(1L, "Computer Science", "Engineering");
        when(degreeService.getDegreeById(1L)).thenReturn(degree);

        // Llamada al controlador para obtener el grado por su ID.
        DegreeResponseDTO result = degreeController.getDegreeById(1L);

        // Verifica que el resultado no sea nulo.
        assertNotNull(result);
        // Verifica que el ID del grado es 1.
        assertEquals(1L, result.getDegreeId());
        // Verifica que el servicio getDegreeById fue llamado exactamente una vez.
        verify(degreeService, times(1)).getDegreeById(1L);
    }
}
package org.kmryfv.icortepooproject.controllers;


import org.kmryfv.icortepooproject.services.interfaces.IDegreeManagament;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/degree")
public class DegreeController {
    private final IDegreeManagament degreeService;
    public DegreeController(IDegreeManagament degreeService) {
        this.degreeService = degreeService;
    }

    @PostMapping("/createDegree")
    public
}

package com.cardiff.maplife.controllers;


import org.hibernate.annotations.SourceType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;

@RestController
public class MainController {

    // DI the community service
//    private UserService userService;

//    public MainController(UserService userService) {
//
//        this.userService = userService;
//    }


    @GetMapping("/")
    public ModelAndView showMapPage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("/navigator/bars");
        return modelAndView;
    }
}

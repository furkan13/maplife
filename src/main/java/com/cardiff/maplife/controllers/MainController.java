package com.cardiff.maplife.controllers;


import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
        modelAndView = new ModelAndView("landing/map");
        return modelAndView;
    }

    @GetMapping("/subscriptions")
    public ModelAndView showSubscriptionPage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("subscription/subscriptions");
        return modelAndView;
    }
    @GetMapping("/authform")
    public ModelAndView showAuthForm(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("authform/authform");
        return modelAndView;
    }



}

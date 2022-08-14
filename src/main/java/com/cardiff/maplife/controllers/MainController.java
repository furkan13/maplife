package com.cardiff.maplife.controllers;


import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class MainController {

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

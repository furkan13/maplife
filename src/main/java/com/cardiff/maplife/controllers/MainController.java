package com.cardiff.maplife.controllers;


import com.cardiff.maplife.services.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
public class MainController {
    private final UserService userService;

    public MainController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public ModelAndView showMapPage(ModelAndView modelAndView, HttpServletResponse response) {
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
    @GetMapping("/profile")
    public ModelAndView showProfilePage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("account/profile");
        return modelAndView;
    }
    @GetMapping("/settings")
    public ModelAndView showSettingsPage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("account/settings");
        return modelAndView;
    }
    @GetMapping("/streaming")
    public ModelAndView showStreamingPage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("/streaming");
        return modelAndView;
    }

}

package com.cardiff.maplife.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class Explorer {

    @RequestMapping("/explore")
    public ModelAndView showMapPage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("Explore/explore");
        return modelAndView;
    }





}
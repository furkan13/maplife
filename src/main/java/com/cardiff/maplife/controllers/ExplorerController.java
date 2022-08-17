package com.cardiff.maplife.controllers;

import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;


@Controller
public class ExplorerController {

    @Autowired
    EventService eventservice;


    @GetMapping("/explore")
    public String showMapPage(Model model) {


        List <Event> eventList=eventservice.eventRepository.findAll();
        if(eventList.size()>3)
        {
            eventList.subList(3, eventList.size()).clear();
        }
       model.addAttribute("eventList",eventList);
        return "Explore/explore";
    }
    @GetMapping("/nearby")
    public String showNearBy(Model model) {


        List <Event> eventList=eventservice.eventRepository.findAll();
        model.addAttribute("eventList",eventList);
        return "Explore/nearby";
    }
    @GetMapping("/trending")
    public String showTrending(Model model) {


        List <Event> eventList=eventservice.eventRepository.findAll();
        model.addAttribute("eventList",eventList);
        return "Explore/trending";
    }





}
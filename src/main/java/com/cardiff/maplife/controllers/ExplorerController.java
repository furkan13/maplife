package com.cardiff.maplife.controllers;

import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.List;


@Controller
public class ExplorerController {

    @Autowired
    EventService eventservice;

    /* All the controller methods for explorer page*/

    @GetMapping("/explore")                         // method for explore page
    public String showMapPage(Model model) {           // Passing a Model as parameter so that add an event object to model and pass it in the webpage


        List <Event> eventList=eventservice.findAll();  // getting all the events from the database
        if(eventList.size()>3)                                          // check if there are more than 3 events
        {
            eventList.subList(3, eventList.size()).clear();             // remove all the other events from the list after index 3 so that only three events will be shown in page
        }


        List <Event> upComingList=eventservice.searchUpcoming();
        if(upComingList.size()>3)                                          // check if there are more than 3 events
        {
            upComingList.subList(3, upComingList.size()).clear();             // remove all the other events from the list after index 3 so that only three events will be shown in page
        }

        Timestamp datetime = new Timestamp(System.currentTimeMillis());

        List<Event> liveList=eventservice.findLive();
        if(liveList.size()>3)                                          // check if there are more than 3 events
        {
            liveList.subList(3, liveList.size()).clear();             // remove all the other events from the list after index 3 so that only three events will be shown in page
        }



        model.addAttribute("liveList",liveList);



        model.addAttribute("eventList",upComingList);

        return "Explore/explore";
    }
    @GetMapping("/nearby")                                          //method for showing all the nearby events in different page
    public String showNearBy(Model model) {


        List <Event> upComingList=eventservice.searchUpcoming();
        model.addAttribute("eventList",upComingList);
        return "Explore/nearby";
    }
    @GetMapping("/trending")                                         //method for showing all the trending events in different page
    public String showTrending(Model model) {

        Timestamp datetime = new Timestamp(System.currentTimeMillis());
        List<Event> liveList=eventservice.findCustom(datetime);
        model.addAttribute("eventList",liveList);
        return "Explore/trending";
    }





}
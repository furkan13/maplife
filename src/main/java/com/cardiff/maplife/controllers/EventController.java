package com.cardiff.maplife.controllers;


import com.cardiff.maplife.entities.Event;

import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.TwilioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class EventController {
    private final EventService eventService;
    private final TwilioService twilioService;
    @Autowired
    public EventController(EventService eventService, TwilioService twilioService){
        this.eventService=eventService;
        this.twilioService = twilioService;
    }

    @PostMapping("/RoomCreation")
    private ResponseEntity<Event> addEvent(@RequestBody Event event){
//        System.out.println(event.getEvent_title());
        if(twilioService.CheckRoomExist(event)) { //If there is existing room with the same name
            event.setTitle("Error");
            System.out.println("Room exist");
            return new ResponseEntity<>(event, HttpStatus.OK);
        }
//        System.out.println(twilioService.CreateRoom(event));
        try{
            String cache = (twilioService.CreateRoom(event));
            event.setEvent_link(cache);
            Event savedEvent = eventService.saveEvent(event);
//            System.out.println(savedEvent.getEvent_link());
//            System.out.println(savedEvent.getEvent_title());
            return new ResponseEntity<>(savedEvent, HttpStatus.OK);
        }
        catch(Exception e){
            System.out.println("some error here...");
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/RoomDeletion")
    private void delEvent(@RequestBody Event event){

        twilioService.DeleteRoom(event);
        //Delete room in event table here
    }

    @GetMapping("/EventAccessToken")
    private String generateVideoToken(@RequestParam(value = "user", defaultValue = "null") String UserName, @RequestParam(value = "room", defaultValue = "null") String RoomName){
        //Check whether user is allowed to join video room in database
        //check if room exist
        System.out.println(UserName);

        System.out.println(RoomName);
        return twilioService.EventAccessToken(UserName, RoomName);
    }
    //token generation
    //Live player implementation
}

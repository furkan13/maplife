package com.cardiff.maplife.controllers;

import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.StreamService;
import com.cardiff.maplife.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StreamController {
    private final StreamService streamService;

    public StreamController(StreamService streamService){
        this.streamService=streamService;
    }

    @PostMapping("/RoomCreation")
    private ResponseEntity<Event> addEvent(@RequestBody Event event){
        try{
            Event savedEvent=streamService.saveEvent(event);
            return new ResponseEntity<>(savedEvent, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
        }
    }
}

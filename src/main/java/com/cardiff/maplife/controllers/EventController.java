package com.cardiff.maplife.controllers;


import com.cardiff.maplife.entities.Event;

import com.cardiff.maplife.entities.Live;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.LiveService;
import com.cardiff.maplife.services.TwilioService;
import com.cardiff.maplife.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.Set;

@RestController
public class EventController {
    private final EventService eventService;
    private final TwilioService twilioService;
    private final UserService userService;
    private final LiveService liveService;
    @Autowired
    public EventController(EventService eventService, TwilioService twilioService, UserService userService,  LiveService liveService){
        this.eventService=eventService;
        this.twilioService = twilioService;
        this.userService=userService;
        this.liveService = liveService;
    }
    @PostMapping("/RoomLocationUpdate")
    private void updateEventLocation(@RequestBody Event event) {
        //update the event's dis/long/lat/host_id
        Event ServerEvent = eventService.findById(event.getId());
        //Check if the user is the host of that room
        if (userService.findUserByUsername(userService.getAuthentication()).getId() == ServerEvent.getHost_id()) {
            ServerEvent.setLatitude(event.getLatitude());
            ServerEvent.setLongitude(event.getLongitude());
        }
    }
    @PostMapping("/RoomDetailUpdate")
    private void updateEventDetail(@RequestBody Event event){
        Event ServerEvent = eventService.findById(event.getId());
        //Check if the user is the host of that room
        if (userService.findUserByUsername(userService.getAuthentication()).getId() == ServerEvent.getHost_id()) {
            ServerEvent.setEvent_dis(event.getEvent_dis());
            ServerEvent.setHost_id(event.getHost_id());
        }
    }
    @PostMapping("/RoomCreation")
    private ResponseEntity<Event> addEvent(@RequestBody Event event){
//        System.out.println(event.getTitle());
        if(twilioService.CheckRoomExist(event)) { //If there is existing room with the same name
            event.setTitle("Error");
            System.out.println("Room exist");
            return new ResponseEntity<>(event, HttpStatus.OK);
        }
//        System.out.println(twilioService.CreateRoom(event));
        try{
            //set host_id as the current user id
            event.setHost_id(userService.findUserByUsername(userService.getAuthentication()).getId());
            //Set event_date as current time
            Timestamp datetime = new Timestamp(System.currentTimeMillis());
            event.setEvent_date(datetime);

            //Create twilio room and get url of the created room from twilio
            String link = (twilioService.CreateRoom(event));
            event.setEvent_link(link);
            Event savedEvent = eventService.save(event);
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
    private ResponseEntity delEvent(@RequestBody Event event){
        //Check if the event entities has id or title, then check if the user is the host
        Event eventCache;
        if(event.getId() != null) {
            eventCache = eventService.findById(event.getId());
        }
        else if(event.getTitle()!= null) {
            eventCache = eventService.findByName(event.getTitle());
        }
        else{return new ResponseEntity(HttpStatus.BAD_REQUEST);} //Invalid event data
        //Check if the user is the host of that room
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getHost_id()){
            eventService.deleteById(eventCache.getId()); //Delete room in event table
            twilioService.DeleteRoom(eventCache); //Delete room in twilio service
            liveService.deleteAllLiveByEventid(eventCache.getId()); //Delete all cohost in database
        }
        return new ResponseEntity(HttpStatus.OK);

    }
    @GetMapping("/CoHostRequest")
    private Set<Live> showLiveRequest(@RequestParam(value = "room", defaultValue = "null") String RoomName){
        //Send all request to be cohost to host
        //If the user is host
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventService.findByName(RoomName).getHost_id()){
            return liveService.findLiveByEventid( eventService.findByName(RoomName).getId());
        }
        return null;
    }
    @PostMapping("/CoHostAccept")
    private void LiveAccept(@RequestParam(value="room", defaultValue = "null")String RoomName, @RequestParam(value="username", defaultValue = "null")String UserName){
        //Accept the requested user as cohost
        //If the user is host
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventService.findByName(RoomName).getHost_id()){
            Live liveCache = liveService.findLiveByUserid(userService.findUserByUsername(UserName).getId());
            liveCache.setApproved(true);
            liveService.saveLive(liveCache);
        }
    }
    @PostMapping("/CoHostDecline")
    private void LiveDecline(@RequestParam(value="room", defaultValue = "null")String RoomName, @RequestParam(value="username", defaultValue = "null")String UserName){
        //Delete the cohost request
        //If the user is host
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventService.findByName(RoomName).getHost_id()){
            liveService.deleteLiveByCohostid(userService.findUserByUsername(UserName).getId());
        }
    }
    @PostMapping("/CoHostKick")
    private void LiveKick(@RequestParam(value="room", defaultValue = "null")String RoomName, @RequestParam(value="username", defaultValue = "null")String UserName){
        //Kick the existing cohost
        //If the user is host
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventService.findByName(RoomName).getHost_id()){
            liveService.deleteLiveByCohostid(userService.findUserByUsername(UserName).getId());
            //Add twilio kick participant here
            twilioService.KickCohost(RoomName, UserName);
        }
    }
    @PostMapping(value = "/roomStatus", produces = "application/x-www-form-urlencoded")
    private void getRoomStatus(@RequestParam(value ="RoomName")String RoomName, @RequestParam(value="StatusCallbackEvent")String status,@RequestParam(value ="ParticipantIdentity",defaultValue = "")String UserName){
        //Web hook from twilio, testing
        System.out.println(RoomName);
        System.out.println(status);
        Event eventCache = eventService.findByName(RoomName);
        if(status.equals("room-ended")){ //Delete room in database
            eventService.deleteById(eventCache.getId());
            liveService.deleteAllLiveByEventid(eventCache.getId());
        }
        if(status.equals("participant-disconnected")){ //Delete cohost in database
            User userCache = userService.findUserByUsername(UserName);

            if(userCache.getId() == eventCache.getHost_id()){ //Host disconnect, delete room
                eventService.deleteById(eventCache.getId());
                liveService.deleteAllLiveByEventid(eventCache.getId());
            }
            else{
                liveService.deleteLiveByCohostid(userCache.getId());
            }
        }
    }

    @GetMapping("/EventAccessToken")
    private String generateVideoToken(@RequestParam(value = "room", defaultValue = "null") String RoomName){
        //Check whether user is allowed to join video room in database
        //check if room exist
        User user = userService.findUserByUsername(userService.getAuthentication());
        System.out.println(user.getUsername());
        System.out.println(RoomName);
        if(RoomName != "" ) { //Create video token for user, only provide token if user is in Live/Event
            Event eventCache = eventService.findByName(RoomName);//Find the room in database
            Live liveCache = liveService.findLiveByUserid(user.getId());
            if(user.getId() == eventCache.getHost_id() || liveCache.isApproved()) {
                //Check if the user is host or approved live user by host(cohost)
                return twilioService.EventAccessToken(user.getUsername(), RoomName);
            }
        }
        return "";


    }
    //token generation
    //Live player implementation
}

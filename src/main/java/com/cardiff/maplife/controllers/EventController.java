package com.cardiff.maplife.controllers;


import com.cardiff.maplife.entities.Event;

import com.cardiff.maplife.entities.Live;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.LiveService;
import com.cardiff.maplife.services.TwilioService;
import com.cardiff.maplife.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
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
    @GetMapping("/EventList")
    private List<Event> GetEventList(){
        Timestamp datetime = new Timestamp(System.currentTimeMillis());
        return eventService.findCustom(datetime);

    }
    @PostMapping("/RoomLocationUpdate")
    private void updateEventLocation(@RequestBody Event event) {
        //update the event's dis/long/lat/host_id
        Event ServerEvent;
        try{ //Check if the room exist
            ServerEvent = eventService.findById(event.getId());
        }
        catch(Exception e){
            return;
        }
        //Check if the user is the host of that room
        if (userService.findUserByUsername(userService.getAuthentication()).getId() == ServerEvent.getHost_id()) {
            ServerEvent.setLatitude(event.getLatitude());
            ServerEvent.setLongitude(event.getLongitude());
            eventService.save(ServerEvent);
        }
    }
    @PostMapping("/RoomDetailUpdate")
    private void updateEventDetail(@RequestBody Event event){
        Event ServerEvent;
        try{ //Check if the room exist
            ServerEvent = eventService.findById(event.getId());
        }
        catch(Exception e){
            return;
        }
        //Check if the user is the host of that room
        if (userService.findUserByUsername(userService.getAuthentication()).getId() == ServerEvent.getHost_id()) {
            ServerEvent.setEvent_dis(event.getEvent_dis());
            ServerEvent.setHost_id(event.getHost_id());
            ServerEvent.setCat(event.getCat());
            eventService.save(ServerEvent);
        }
    }
    @PostMapping("/RoomFutureCreation")//for event in future
    private ResponseEntity<Event> addFutureEvent(@RequestBody Event event){
        Event ServerEvent;
        try{ //Check if the room exist
            ServerEvent = eventService.findById(event.getId());
        }
        catch(Exception e){
            ServerEvent = null;
        }
        if(twilioService.CheckRoomExist(event) || ServerEvent != null) { //If there is existing room with the same name
            event.setTitle("Error");
            System.out.println("Room exist");
            return new ResponseEntity<>(event, HttpStatus.OK);
        }
        Timestamp datetime = new Timestamp(System.currentTimeMillis());
        if(event.getEvent_date().getTime() > datetime.getTime()){ //If the event time is in future

            try{
                //set host_id as the current user id
               /* event.setHost_id(userService.findUserByUsername(userService.getAuthentication()).getId());*/
                event.setLive(false); //Not in live
                event.setEvent_link("");//Empty link as twilio api is not called
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
        return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
    }
    @PostMapping("/RoomCreation")
    private ResponseEntity<Event> addEvent(@RequestBody Event event, UriComponentsBuilder builder){
//        System.out.println(event.getTitle());
        Event eventCache;
        try{
            eventCache = eventService.findByName(event.getTitle());
        }
        catch (Exception e){
            eventCache = null;
        }
        if (twilioService.CheckRoomExist(event)) { //If there is existing twilio room with the same name
            event.setTitle("Error");
            System.out.println("Room exist");
            return new ResponseEntity<>(event, HttpStatus.OK);
        }
        if(eventCache == null) { //If there is no entry in database, create Event and twilio room

//        System.out.println(twilioService.CreateRoom(event));
            try {
                //set host_id as the current user id
                /*event.setHost_id(userService.findUserByUsername(userService.getAuthentication()).getId());*/
                //Set event_date as current time
               /* java.sql.Date date = new java.sql.Date(Calendar.getInstance().getTime().getTime());
                event.setEvent_date(date);*/
               /* Timestamp datetime = new Timestamp(System.currentTimeMillis());
                event.setEvent_date(datetime);*/
                event.setLive(true);
                //Create twilio room and get url of the created room from twilio
                String link = (twilioService.CreateRoom(event));
                event.setEvent_link(link);
                eventService.save(event);
//            System.out.println(savedEvent.getEvent_link());
//            System.out.println(savedEvent.getEvent_title());
                return new ResponseEntity<>(HttpStatus.CREATED);
            } catch (Exception e) {
                System.out.println("some error here...");
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
        }
        else{ //Future event but host call it now
            if(event.getHost_id() == eventCache.getHost_id()) {
                try {
                    //Turn event into live
                    eventCache.setLive(true);
                    //Create twilio room and get url of the created room from twilio
                    String link = (twilioService.CreateRoom(eventCache));
                    eventCache.setEvent_link(link);
                    eventService.save(eventCache);
//            System.out.println(savedEvent.getEvent_link());
//            System.out.println(savedEvent.getEvent_title());
                    return new ResponseEntity<>(HttpStatus.CREATED);
                } catch (Exception e) {
                    System.out.println("some error here...");
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
        }
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
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
            eventCache.setLive(false);
            eventService.save(eventCache);
//            eventService.deleteById(eventCache.getId()); //Delete room in event table
            twilioService.DeleteRoom(eventCache); //Delete room in twilio service
            liveService.deleteAllLiveByEventid(eventCache.getId()); //Delete all cohost in database
        }
        return new ResponseEntity(HttpStatus.OK);

    }
    @GetMapping("/CoHostRequest")
    private Set<Live> showLiveRequest(@RequestParam(value = "RoomName", defaultValue = "null") String RoomName){
        //Send all request to be cohost to host
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return null;
        }
        //If the user is the host of the room
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getHost_id()){
            return liveService.findLiveByEventid( eventService.findByName(RoomName).getId());
        }
        return null;
    }
    @PostMapping("/CoHostAccept")
    private void LiveAccept(@RequestParam(value="RoomName", defaultValue = "null")String RoomName, @RequestParam(value="username", defaultValue = "null")String UserName){
        //Accept the requested user as cohost
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return;
        }
        //If the user is host
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getHost_id()){
            Live liveCache = liveService.findLiveByUserid(userService.findUserByUsername(UserName).getId());
            liveCache.setApproved(true);
            liveService.saveLive(liveCache);
        }
    }
    @PostMapping("/CoHostDecline")
    private void LiveDecline(@RequestParam(value="RoomName", defaultValue = "null")String RoomName, @RequestParam(value="username", defaultValue = "null")String UserName){
        //Delete the cohost request
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return;
        }
        //If the user is host
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getHost_id()){
            liveService.deleteLiveByCohostid(userService.findUserByUsername(UserName).getId());
        }
    }
    @PostMapping("/CoHostKick")
    private void LiveKick(@RequestParam(value="RoomName", defaultValue = "null")String RoomName, @RequestParam(value="username", defaultValue = "null")String UserName){
        //Kick the existing cohost
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return;
        }
        //If the user is host
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getHost_id()){
            liveService.deleteLiveByCohostid(userService.findUserByUsername(UserName).getId());
            //Add twilio kick participant here
            twilioService.KickCohost(RoomName, UserName);
        }
    }
    @PostMapping("/CoHostSubmit") //User send a cohost request to host
    private void AddLiveEntry(@RequestParam(value="RoomName")String RoomName){
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return;
        }

            Live newLive = new Live();
            newLive.setApproved(false);
            newLive.setEventid(eventCache.getId());
            newLive.setCohostid(userService.findUserByUsername(userService.getAuthentication()).getId());
            liveService.saveLive(newLive);

    }
    @PostMapping(value = "/roomStatus", produces = "application/x-www-form-urlencoded")
    //Web hook with twilio
    private void getRoomStatus(@RequestParam(value ="RoomName")String RoomName, @RequestParam(value="StatusCallbackEvent")String status,@RequestParam(value ="ParticipantIdentity",defaultValue = "")String UserName){
        //Web hook from twilio, testing
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return;
        }
        if(status.equals("room-ended")){ //Delete room in database
            eventCache.setLive(false);
            eventService.save(eventCache);
            liveService.deleteAllLiveByEventid(eventCache.getId());
        }
        if(status.equals("participant-disconnected")){ //Delete cohost in database
            User userCache = userService.findUserByUsername(UserName);

            if(userCache.getId() == eventCache.getHost_id()){ //Host disconnect, delete room
                eventCache.setLive(false);
                eventService.save(eventCache);
                liveService.deleteAllLiveByEventid(eventCache.getId());
            }
            else{ //Remove entry related to cohost
                liveService.deleteLiveByCohostid(userCache.getId());
            }
        }
    }
    @GetMapping("/EventDetail")
    private Event GetEvent(@RequestParam(value = "RoomName", defaultValue = "null") String RoomName) {
        //check if room exist
        System.out.println(RoomName);
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return null;
        }
        return eventCache;
    }

    @GetMapping("/EventAccessToken")
    private String generateVideoToken(@RequestParam(value = "RoomName", defaultValue = "null") String RoomName){
        //Check whether user is allowed to join video room in database
        //check if room exist
        User user = userService.findUserByUsername(userService.getAuthentication());
//        System.out.println(user.getUsername());
//        System.out.println(RoomName);
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return "";
        }
         //Create video token for user, only provide token if user is in Live/Event

            if(eventCache.isLive()) { //If the room is streaming
                Live liveCache = liveService.findLiveByUserid(user.getId());
                if (user.getId() == eventCache.getHost_id() || liveCache.isApproved()) {
                    //Check if the user is host or approved live user by host(cohost)
                    return twilioService.EventAccessToken(user.getUsername(), RoomName);
                }
            }

        return "";


    }




  





    //token generation
    //Live player implementation
}

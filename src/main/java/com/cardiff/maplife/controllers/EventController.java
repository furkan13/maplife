package com.cardiff.maplife.controllers;


import com.baomidou.mybatisplus.extension.api.R;
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
import java.util.*;

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
    @GetMapping("/userEvent")
    private List<Event> UserEventList(@RequestParam(value="username", defaultValue = "null")String username){
        Timestamp datetime = new Timestamp(System.currentTimeMillis());
        return eventService.finduserCustom(datetime, username);
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
        if (userService.findUserByUsername(userService.getAuthentication()).getId() == ServerEvent.getUser().getId()) {
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
        if (userService.findUserByUsername(userService.getAuthentication()).getId() == ServerEvent.getUser().getId()) {
            ServerEvent.setEvent_dis(event.getEvent_dis());
            ServerEvent.setHost_id(event.getUser().getId());
            ServerEvent.setCat(event.getCat());
            eventService.save(ServerEvent);
        }
    }
    @PostMapping("/HostJoin") //Mostly used for future event, create twilio room when host join the room
    private void TwilioCheck(@RequestParam(value = "RoomName", defaultValue = "null") String RoomName ){
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return;
        }
        //If the user is the host of the room
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getUser().getId()){
            //Check if the room is created without twilio link (Created for future event)
            if( eventCache.getEvent_link() ==""){
                //Set the room to live and create twilio video room
                eventCache.setLive(true);
                Timestamp servertime = new Timestamp(System.currentTimeMillis());
                eventCache.setEvent_date(servertime);
                String link = (twilioService.CreateRoom(eventCache));
                eventCache.setEvent_link(link);
                eventService.save(eventCache);
            }

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
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getUser().getId()){
            eventCache.setLive(false);
            eventService.save(eventCache);
//            eventService.deleteById(eventCache.getId()); //Delete room in event table
            twilioService.DeleteRoom(eventCache); //Delete room in twilio service
            liveService.deleteAllLiveByEventid(eventCache.getId()); //Delete all cohost in database
        }
        return new ResponseEntity(HttpStatus.OK);

    }
    @GetMapping("/CoHostRequest")
    private List<Live> showLiveRequest(@RequestParam(value = "RoomName", defaultValue = "null") String RoomName){
        //Send all request to be cohost to host
        Event eventCache;
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return null;
        }
        //If the user is the host of the room
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getUser().getId()){
            List<Live> return_set= liveService.findPendingLiveByEventid( eventCache.getId());
            for(int i =0; i< return_set.size(); i++){
                return_set.get(i).setUserName(userService.findUserByUserId(return_set.get(i).getCohostid()).getUsername());
//
            }
            return return_set;
        }
        return null;
    }

    @PostMapping("/CoHostAccept")
    private void LiveAccept(@RequestParam(value="RoomName", defaultValue = "null")String RoomName, @RequestParam(value="username", defaultValue = "null")String UserName){
        //Accept the requested user as cohost
        Event eventCache;
        System.out.println(RoomName);
        System.out.println(UserName);
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
        }
        catch(Exception e){
            return;
        }
        //If the user is host
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getUser().getId()){
            Live liveCache = liveService.findLiveByUserid(userService.findUserByUsername(UserName).getId(),eventCache.getId() );
            try{
                liveCache.setApproved(true);
                liveService.saveLive(liveCache);
            }
            catch(Exception e){

            }

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
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getUser().getId()){
            liveService.deleteLiveByCohostid(userService.findUserByUsername(UserName).getId(),eventCache.getId());
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
        if(userService.findUserByUsername(userService.getAuthentication()).getId() == eventCache.getUser().getId()){
            liveService.deleteLiveByCohostid(userService.findUserByUsername(UserName).getId(),eventCache.getId());
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

            if(userCache.getId() == eventCache.getUser().getId()){ //Host disconnect, delete room
                eventCache.setLive(false);
                eventService.save(eventCache);
                liveService.deleteAllLiveByEventid(eventCache.getId());
            }
            else{ //Remove entry related to cohost
                liveService.deleteLiveByCohostid(userCache.getId(), eventCache.getId());
            }
        }
    }
    @GetMapping("/EventDetail")
    private Event GetEvent(@RequestParam(value = "RoomName", defaultValue = "null") String RoomName) {
        //check if room exist
//        System.out.println(RoomName);
        Event eventCache;
        Timestamp datetime = new Timestamp(System.currentTimeMillis());
        try{ //Check if the room exist
            eventCache = eventService.findByName(RoomName);
            //Check if the room closed. Only allow future room for host and live room for host&cohost
            //Checking is now done in sql
            System.out.println(eventCache.getTitle());
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
                Live liveCache = liveService.findLiveByUserid(user.getId(), eventCache.getId());
                boolean approved;
                try{
                    approved = liveCache.isApproved();
                }
                catch(Exception e){
                    approved = false;
                }
                if (user.getId() == eventCache.getUser().getId() || approved) {
                    //Check if the user is host or approved live user by host(cohost)
                    return twilioService.EventAccessToken(user.getUsername(), RoomName);
                }
            }

        return "";


    }





    @GetMapping("/EventTags")
    private List<String> GetEventTags(@RequestParam(value = "RoomName", defaultValue = "null") String RoomName) {
        System.out.println(RoomName);
        if(RoomName.equals(null))
        {return null;}
        else {
            String[] stringArray = eventService.findByName(RoomName).getCat().split(",");
            List<String> tagList = Arrays.asList(stringArray);
            for (int i = 0; i < tagList.size(); i++) {
                System.out.println(tagList.get(i));
            }


            return tagList;
        }
    }




  





    //token generation
    //Live player implementation
}

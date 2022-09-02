package com.cardiff.maplife.controllers;

import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.UserService;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@ControllerAdvice
public class BarController {
    private final UserService userService;
    private final EventService eventService;

    public BarController(UserService userService,EventService eventService) {
        this.userService = userService;
        this.eventService = eventService;
    }

    @ModelAttribute("newEventList")
    public List<Event> addGlobalEventList() {
        List<Event> newEventList = new ArrayList<>();
        if (userService.getAuthentication()!=null){
            User loggedUser = userService.findUserByUsername(userService.getAuthentication());
            Set<User> followingUserSet = loggedUser.getFollowingUserSet();
            Timestamp datetime = new Timestamp(System.currentTimeMillis());
            List<Event> eventList = eventService.findCustom(datetime);
            for (User followingUser : followingUserSet){
                for (Event event : eventList){
                    if (event.isLive()){
                        if (event.getUser().getUser_id().equals(followingUser.getUser_id())){
                            newEventList.add(event);
                        }
                    }

                }
            }
            return newEventList;
        }
        return null;
    }
}

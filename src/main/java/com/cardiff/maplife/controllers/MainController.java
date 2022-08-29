package com.cardiff.maplife.controllers;


import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
public class MainController {
    private final UserService userService;
    private final EventService eventService;

    public MainController(UserService userService,EventService eventService) {
        this.userService = userService;
        this.eventService = eventService;

    }

    @GetMapping("/")
    public ModelAndView showMapPage(ModelAndView modelAndView, HttpServletResponse response) {
        modelAndView = new ModelAndView("landing/map");
        if (userService.getAuthentication()!=null){
            List<Event> newEventList = new ArrayList<>();
            User loggedUser = userService.findUserByUsername(userService.getAuthentication());
            Set<User> followingUserSet = loggedUser.getFollowingUserSet();
            Timestamp datetime = new Timestamp(System.currentTimeMillis());
            List<Event> eventList = eventService.findCustom(datetime);
            for (User followingUser : followingUserSet){
                for (Event event : eventList){
                    if (event.getUser().getUser_id().equals(followingUser.getUser_id())){
                        newEventList.add(event);
                    }
                }
            }
            modelAndView.addObject("eventList",newEventList);
        }
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
//    @GetMapping("/profile")
//    public ModelAndView showProfilePage(ModelAndView modelAndView) {
//        modelAndView = new ModelAndView("account/profile");
//        return modelAndView;
//    }
    @GetMapping("/settings")
    public ModelAndView showSettingsPage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("account/settings");
        return modelAndView;
    }
    @GetMapping("/streaming")
    public ModelAndView showStreamingPage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("Streaming/HostStream");
        return modelAndView;
    }
    @RequestMapping("/profile/{username}")
    public ModelAndView getProfile(ModelAndView modelAndView, @PathVariable String username) {
        User searchUser = (User) userService.loadUserByUsername(username);
        String loggedUsername = userService.getAuthentication();
        modelAndView.setViewName("account/profile");
        modelAndView.addObject("loggedUsername",loggedUsername);
        modelAndView.addObject("username", searchUser.getUsername());
        modelAndView.addObject("video",searchUser.getVideo());
        modelAndView.addObject("total_view",searchUser.getViews());
        modelAndView.addObject("bio",searchUser.getBio());
        modelAndView.addObject("userIcon",searchUser.getIcon());
//        Set<Event> upcomingEvent = project.getEvent();
        return modelAndView;
    }


}

package com.cardiff.maplife.controllers;


import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.EventService;
import com.cardiff.maplife.services.UserService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

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
        return modelAndView;
    }

    @GetMapping("/subscriptions")
    public ModelAndView showSubscriptionPage(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("subscription/subscriptions");
        User gotUser = userService.findUserByUsername(userService.getAuthentication());
        Set<User> followingUserSet = gotUser.getFollowingUserSet();
        modelAndView.addObject("followingUserSet", followingUserSet);
        modelAndView.addObject("followToggle","Followed");
        return modelAndView;
    }
    @GetMapping("/authform")
    public ModelAndView showAuthForm(ModelAndView modelAndView) {
        modelAndView = new ModelAndView("authform/authform");
        return modelAndView;
    }

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
        //get searchUser profile details
        User searchUser = (User) userService.loadUserByUsername(username);
        String loggedUsername = userService.getAuthentication();
        //check whether logged user followed the search user or not.
        User gotUser = userService.findUserByUsername(loggedUsername);
        Set<User> followingUserSet = gotUser.getFollowingUserSet();
        Set<User> followerUserSet=gotUser.getFollowerUserSet();
        modelAndView.addObject("followToggle","Follow");
        for (User followedUser : followingUserSet) {
            if(username.equals(followedUser.getUsername())){
                modelAndView.addObject("followedUsername",followedUser.getUsername());
                modelAndView.addObject("followToggle","Followed");
                break;
            }
        }
        //get upcoming event
        Timestamp datetime = new Timestamp(System.currentTimeMillis());
        List<Event> upcomingEventList = eventService.finduserCustom(datetime, username);

        modelAndView.setViewName("account/profile");
        modelAndView.addObject("loggedUsername",loggedUsername);
        modelAndView.addObject("username", username);
        modelAndView.addObject("video",searchUser.getVideo());
        modelAndView.addObject("total_view",searchUser.getViews());
        modelAndView.addObject("bio",searchUser.getBio());
        modelAndView.addObject("userIcon",searchUser.getIcon());
        modelAndView.addObject("following",followingUserSet.size());
        modelAndView.addObject("follower",followerUserSet.size());
        modelAndView.addObject("upcomingEventList",upcomingEventList);
        return modelAndView;
    }

    @GetMapping("/search")
    public ModelAndView showResults(ModelAndView modelAndView, Model model,@RequestParam("keyword")String key)
    {
        Timestamp servertime = new Timestamp(System.currentTimeMillis());
        List<Event> results=eventService.searchResults(key,servertime);
        List<User> userList=userService.searchResult(key);
        model.addAttribute("results",results);
        model.addAttribute("userList",userList);
        modelAndView =new ModelAndView("Explore/search");
        return modelAndView;
    }

    @PostMapping("/search")
    public ModelAndView getResults(ModelAndView modelAndView, Model model,@RequestParam("keyword")String key)
    {

        return new ModelAndView("redirect:/search?key="+key);
    }







}

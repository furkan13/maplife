package com.cardiff.maplife.controllers;

import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class LoginController {
    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/api/getUser")
    public User getUser(@RequestBody User user) {
        User gotUser= userService.findUserByUsername(user.getUsername());
        return gotUser;
//        return (User) userService.loadUserByUsername(user.getUsername());
    }


}



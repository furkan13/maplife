package com.cardiff.maplife.controllers;

import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

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



package com.cardiff.maplife.controllers;

import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@RestController
public class LoginController {
    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/api/getUser")
    public ResponseEntity<User> getUser() {

        User gotUser = userService.findUserByUsername(userService.getAuthentication());
        if (gotUser != null) {

            if(gotUser.getLastLogin()!=null)
            {

                if(gotUser.getLastLogin().equals(java.time.LocalDate.now().minusDays(1)))
                {
                    gotUser.setCoin(gotUser.getCoin()+10);
                    gotUser.setLastLogin(java.time.LocalDate.now());
                }
                else
                {
                    gotUser.setLastLogin(java.time.LocalDate.now());
                }

            }

            else
            {
                gotUser.setLastLogin(java.time.LocalDate.now());
                gotUser.setCoin(100);
            }



                userService.saveUser(gotUser);

            return new ResponseEntity<>(gotUser, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }
}



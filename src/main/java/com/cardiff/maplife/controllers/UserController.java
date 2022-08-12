package com.cardiff.maplife.controllers;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.Set;

@RestController
public class UserController {
   private final UserService userService;

   public UserController(UserService userService){
       this.userService=userService;
   }
   //sign up
   @PostMapping("/addUser")
    private ResponseEntity<User> addUser(@RequestBody User user){
       String usernameFromUser = user.getUsername();
       try{
           user.setIcon("default icon.png");
           /*validation for username*/
           User signingUser = (User) userService.loadUserByUsername(usernameFromUser);
           if(signingUser == null){
               User savedUser=userService.saveUser(user);
               return new ResponseEntity<>(savedUser, HttpStatus.OK);
           }
           else{
               return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
           }
       }
       catch(Exception e){
           return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
       }
   }

    //login in
    @PostMapping("/userLogin")
   public Object userLogin(@RequestBody User user) {
        String usernameFromUser = user.getUsername();
        String passwordFromUser = user.getPassword();
        User loginUser = null;

        try {
            User loggingUser = (User) userService.loadUserByUsername(usernameFromUser);
            if (loggingUser != null) {
                String passwordFromDB = loggingUser.getPassword();
                if (passwordFromDB.equals(passwordFromUser)) {
                    loginUser = loggingUser;
                }
                else {
                    return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
                }
            }
            else {
                return new ResponseEntity<>(loginUser, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(loginUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

}

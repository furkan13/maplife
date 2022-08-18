package com.cardiff.maplife.controllers;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class UserController {
   private final UserService userService;

   public UserController(UserService userService){
       this.userService=userService;
   }
   //sign up
   @PostMapping("/api/addUser")
    private ResponseEntity<User> addUser(@RequestBody User user){
       String usernameFromUser = user.getUsername();
       try{
           user.setIcon("default icon.png");
           user.setRoles("ROLE_USER");
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

}

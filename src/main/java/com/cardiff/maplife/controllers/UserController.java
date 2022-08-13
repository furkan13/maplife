package com.cardiff.maplife.controllers;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

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

//    @RequestMapping(path = "/userLogin", method = RequestMethod.POST)
//    public ModelAndView userLogin(HttpServletResponse response, User user, @RequestParam(value = "username") String username, @RequestParam(value = "password") String password) {
//        ModelAndView mav = new ModelAndView();
//        try {
//            User loggingUser = (User) userService.loadUserByUsername(username);
//            if (loggingUser != null) {
//                String passwordFromDB = loggingUser.getPassword();
//                if (passwordFromDB.equals(password)) {
//                    mav.setViewName("subscription/subscriptions");
//                    return mav;
//                }
//                else {
////                    mav.addObject("msg"," wrong username or password");
//                    mav.setViewName("authform/authform");
//                    return mav;
//                }
//            }
//            else {
//                mav.setViewName("authform/authform");
//                return mav;
//            }
//        } catch (Exception e) {
//            mav.setViewName("authform/authform");
//            return mav;
//        }
//    }

}

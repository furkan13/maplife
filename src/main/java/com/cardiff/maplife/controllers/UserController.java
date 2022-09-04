package com.cardiff.maplife.controllers;
import com.cardiff.maplife.entities.Event;
import com.cardiff.maplife.entities.User;
import com.cardiff.maplife.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    //sign up
    @PostMapping("/api/addUser")
    private ResponseEntity<User> addUser(@RequestBody User user) {
        String usernameFromUser = user.getUsername();
        try {
            user.setIcon("default-icon.png");
            user.setRoles("ROLE_USER");
            /*validation for username*/
            User signingUser = (User) userService.loadUserByUsername(usernameFromUser);
            if (signingUser == null) {
                User savedUser = userService.saveUser(user);
                return new ResponseEntity<>(savedUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    //update personal video
    @PostMapping("/api/updateVideo")
    private ResponseEntity<User> updateVideo(@RequestBody User user) {
        try {
            String usernameFromUser = userService.getAuthentication();
            User loggedUser = (User) userService.loadUserByUsername(usernameFromUser);
            loggedUser.setVideo(user.getVideo());
            userService.saveUser(loggedUser);
            return new ResponseEntity<>(loggedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        }
    }

    //update bio
    @PostMapping("/api/updateBio")
    private ResponseEntity<User> updateBio(@RequestBody User user) {
        try {
            String usernameFromUser = userService.getAuthentication();
            User loggedUser = (User) userService.loadUserByUsername(usernameFromUser);
            loggedUser.setBio(user.getBio());
            userService.saveUser(loggedUser);
            return new ResponseEntity<>(loggedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        }
    }

    //update email
    @PostMapping("/api/updateEmail")
    private ResponseEntity<User> updateEmail(@RequestBody User user) {
        try {
            String usernameFromUser = userService.getAuthentication();
            User loggedUser = (User) userService.loadUserByUsername(usernameFromUser);
            loggedUser.setEmail(user.getEmail());
            userService.saveUser(loggedUser);
            return new ResponseEntity<>(loggedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        }
    }

    //verify password
    @PostMapping("/api/verifiedPassword")
    private ResponseEntity<User> verifiedPassword(@RequestBody User user) {
        try {
            String usernameFromUser = userService.getAuthentication();
            String passwordFromUser = user.getPassword();
            User loggedUser = (User) userService.loadUserByUsername(usernameFromUser);
            String passwordFromDB = loggedUser.getPassword();
            if (passwordFromUser.equals(passwordFromDB)) {
                return new ResponseEntity<>(loggedUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        }
    }

    //update password
    @PostMapping("/api/updatePassword")
    private ResponseEntity<User> updatePassword(@RequestBody User user) {
        try {
            String usernameFromUser = userService.getAuthentication();
            User loggedUser = (User) userService.loadUserByUsername(usernameFromUser);
            loggedUser.setPassword(user.getPassword());
            userService.saveUser(loggedUser);
            return new ResponseEntity<>(loggedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        }
    }

    //delete Account
    @PostMapping("/api/deleteAccount")
    private String deleteAccount() {
        try {
            String usernameFromUser = userService.getAuthentication();
            User loggedUser = (User) userService.loadUserByUsername(usernameFromUser);
            userService.deleteById(loggedUser.getId());
            return "delete successfully";
        } catch (Exception e) {
            return null;
        }
    }

    @PutMapping("/api/followUser")
    private ResponseEntity<User> followUser(@RequestBody User user) {
        try {
            User loggedUser = userService.findUserByUsername(userService.getAuthentication());
            //followingUser = user you want to follow
            User followerUser = userService.findUserByUsername(user.getUsername());
            Set<User> followerUserSet = followerUser.getFollowerUserSet();
            followerUserSet.add(loggedUser);
            followerUser.setFollowerUserSet(followerUserSet);
            User followedUser = userService.saveUser(followerUser);
            return new ResponseEntity<>(followedUser, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/api/unFollowUser")
    private ResponseEntity<User> unFollowUser(@RequestBody User user) {
        try {
            User loggedUser = userService.findUserByUsername(userService.getAuthentication());
            //followingUser = user you want to follow
            User followerUser = userService.findUserByUsername(user.getUsername());
            Set<User> followerUserSet = followerUser.getFollowerUserSet();
            followerUserSet.remove(loggedUser);
            followerUser.setFollowerUserSet(followerUserSet);
            User followedUser = userService.saveUser(followerUser);
            return new ResponseEntity<>(followedUser, HttpStatus.OK);


        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/api/GetfollowingUser")
    private ResponseEntity<Set<User>> GetfollowingUser(@RequestBody User user) {
        try {
            User loggedUser = userService.findUserByUsername(userService.getAuthentication());
            //followingUser = user you want to follow
            User followerUser = userService.findUserByUsername(user.getUsername());
            Set<User> followerUserSet = followerUser.getFollowerUserSet();
            return followerUserSet;
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

}
